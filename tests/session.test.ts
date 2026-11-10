import { describe, expect, it } from "vitest";

import {
  SessionLimitError,
  claimMockRun,
  getAttemptsUsed,
  getOrCreateSessionId,
  markMockRunCompleted,
  recordMockInvocation,
  type StorageLike,
} from "@/lib/session/browser-session";

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

describe("browser session helpers", () => {
  it("preserves one session id", () => {
    const storage = new MemoryStorage();
    const generate = () => "8f4f4a5f-4160-4dcb-a789-74e5e6699694";

    expect(getOrCreateSessionId(storage, generate)).toBe(generate());
    expect(
      getOrCreateSessionId(
        storage,
        () => "850d5734-6db5-41cc-972b-19949b6640ab",
      ),
    ).toBe(generate());
  });

  it("claims attempts 1–4, reuses duplicate run ids, and blocks attempt 5", () => {
    const storage = new MemoryStorage();
    const sessionId = "session";

    expect(claimMockRun(storage, sessionId, "run-1")).toEqual({
      attempt: 1,
      isNew: true,
    });
    expect(claimMockRun(storage, sessionId, "run-1")).toEqual({
      attempt: 1,
      isNew: false,
    });
    expect(claimMockRun(storage, sessionId, "run-2").attempt).toBe(2);
    expect(claimMockRun(storage, sessionId, "run-3").attempt).toBe(3);
    expect(claimMockRun(storage, sessionId, "run-4").attempt).toBe(4);
    expect(() => claimMockRun(storage, sessionId, "run-5")).toThrow(
      SessionLimitError,
    );
    expect(getAttemptsUsed(storage, sessionId)).toBe(4);
  });

  it("tracks retry invocations without spending another attempt", () => {
    const storage = new MemoryStorage();
    const sessionId = "session";
    claimMockRun(storage, sessionId, "run-1");

    expect(recordMockInvocation(storage, sessionId, "run-1")).toBe(1);
    expect(recordMockInvocation(storage, sessionId, "run-1")).toBe(2);
    markMockRunCompleted(storage, sessionId, "run-1");
    expect(getAttemptsUsed(storage, sessionId)).toBe(1);
  });
});
