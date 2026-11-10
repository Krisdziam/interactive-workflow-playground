import type {
  Attempt,
  ExecuteWorkflowRequest,
  Locale,
  MockScenario,
} from "@/types/workflow";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const SESSION_ID_KEY = "workflow_session_id";
export const LOCALE_KEY = "workflow_locale";
export const MOCK_LEDGER_KEY = "workflow_mock_ledger_v1";
export const PENDING_RUN_KEY = "workflow_pending_run_v1";

const uuidV4Pattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface MockRunRecord {
  attempt: Attempt;
  invocations: number;
  completed: boolean;
}

interface MockLedger {
  version: 1;
  sessionId: string;
  attemptsUsed: number;
  runs: Record<string, MockRunRecord>;
}

export interface PendingRun {
  request: ExecuteWorkflowRequest;
  attempt: Attempt;
  scenario: MockScenario;
}

const emptyLedger = (sessionId: string): MockLedger => ({
  version: 1,
  sessionId,
  attemptsUsed: 0,
  runs: {},
});

export class SessionLimitError extends Error {
  readonly code = "SESSION_LIMIT_REACHED" as const;
  readonly attemptsUsed = 4;

  constructor() {
    super("The browser session has used all four workflow runs.");
    this.name = "SessionLimitError";
  }
}

export function createUuid(): string {
  return crypto.randomUUID();
}

export function getOrCreateSessionId(
  storage: StorageLike,
  generateId: () => string = createUuid,
): string {
  const existing = storage.getItem(SESSION_ID_KEY);
  if (existing && uuidV4Pattern.test(existing)) {
    return existing;
  }

  const sessionId = generateId();
  storage.setItem(SESSION_ID_KEY, sessionId);
  return sessionId;
}

export function getStoredLocale(storage: StorageLike): Locale {
  return storage.getItem(LOCALE_KEY) === "uk" ? "uk" : "en";
}

export function storeLocale(storage: StorageLike, locale: Locale): void {
  storage.setItem(LOCALE_KEY, locale);
}

function readLedger(storage: StorageLike, sessionId: string): MockLedger {
  const serialized = storage.getItem(MOCK_LEDGER_KEY);
  if (!serialized) {
    return emptyLedger(sessionId);
  }

  try {
    const parsed = JSON.parse(serialized) as Partial<MockLedger>;
    if (
      parsed.version !== 1 ||
      parsed.sessionId !== sessionId ||
      typeof parsed.attemptsUsed !== "number" ||
      !parsed.runs ||
      typeof parsed.runs !== "object"
    ) {
      return emptyLedger(sessionId);
    }

    return parsed as MockLedger;
  } catch {
    return emptyLedger(sessionId);
  }
}

function writeLedger(storage: StorageLike, ledger: MockLedger): void {
  storage.setItem(MOCK_LEDGER_KEY, JSON.stringify(ledger));
}

export function getAttemptsUsed(
  storage: StorageLike,
  sessionId: string,
): number {
  return readLedger(storage, sessionId).attemptsUsed;
}

export function claimMockRun(
  storage: StorageLike,
  sessionId: string,
  runId: string,
): { attempt: Attempt; isNew: boolean } {
  const ledger = readLedger(storage, sessionId);
  const existing = ledger.runs[runId];

  if (existing) {
    return { attempt: existing.attempt, isNew: false };
  }

  if (ledger.attemptsUsed >= 4) {
    throw new SessionLimitError();
  }

  const attempt = (ledger.attemptsUsed + 1) as Attempt;
  ledger.attemptsUsed = attempt;
  ledger.runs[runId] = {
    attempt,
    invocations: 0,
    completed: false,
  };
  writeLedger(storage, ledger);

  return { attempt, isNew: true };
}

export function recordMockInvocation(
  storage: StorageLike,
  sessionId: string,
  runId: string,
): number {
  const ledger = readLedger(storage, sessionId);
  const record = ledger.runs[runId];

  if (!record) {
    throw new Error("Cannot invoke an unclaimed mock run.");
  }

  record.invocations += 1;
  writeLedger(storage, ledger);
  return record.invocations;
}

export function markMockRunCompleted(
  storage: StorageLike,
  sessionId: string,
  runId: string,
): void {
  const ledger = readLedger(storage, sessionId);
  const record = ledger.runs[runId];
  if (!record) {
    return;
  }

  record.completed = true;
  writeLedger(storage, ledger);
  clearPendingRun(storage);
}

export function setPendingRun(
  storage: StorageLike,
  pendingRun: PendingRun,
): void {
  storage.setItem(PENDING_RUN_KEY, JSON.stringify(pendingRun));
}

export function getPendingRun(storage: StorageLike): PendingRun | null {
  const serialized = storage.getItem(PENDING_RUN_KEY);
  if (!serialized) {
    return null;
  }

  try {
    const parsed = JSON.parse(serialized) as PendingRun;
    if (
      !parsed.request?.run_id ||
      !parsed.request?.session_id ||
      !parsed.attempt ||
      !parsed.scenario
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingRun(storage: StorageLike): void {
  storage.removeItem(PENDING_RUN_KEY);
}
