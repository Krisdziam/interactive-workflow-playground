import type {
  Attempt,
  FieldErrors,
  MockScenario,
  PublicErrorCode,
  WorkflowSuccessResponse,
} from "@/types/workflow";

export type ExperienceState =
  | { phase: "ready" }
  | { phase: "validation_error"; fieldErrors: FieldErrors }
  | {
      phase: "submitting";
      runId: string;
      attempt: Attempt;
      scenario: MockScenario;
    }
  | { phase: "replay"; response: WorkflowSuccessResponse }
  | { phase: "result"; response: WorkflowSuccessResponse }
  | {
      phase: "request_error";
      code: PublicErrorCode;
      runId: string;
      attempt: Attempt;
      scenario: MockScenario;
      canRetrySameRun: boolean;
    }
  | { phase: "session_limit"; attemptsUsed: 4 };

export type ExperienceAction =
  | { type: "RETURN_READY" }
  | { type: "VALIDATION_FAILED"; fieldErrors: FieldErrors }
  | {
      type: "SUBMIT_STARTED";
      runId: string;
      attempt: Attempt;
      scenario: MockScenario;
    }
  | { type: "RESPONSE_RECEIVED"; response: WorkflowSuccessResponse }
  | { type: "REPLAY_COMPLETED" }
  | {
      type: "REQUEST_FAILED";
      code: PublicErrorCode;
      runId: string;
      attempt: Attempt;
      scenario: MockScenario;
      canRetrySameRun: boolean;
    }
  | { type: "SESSION_LIMIT_REACHED" };

export const initialExperienceState: ExperienceState = { phase: "ready" };

export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "RETURN_READY":
      return { phase: "ready" };
    case "VALIDATION_FAILED":
      return {
        phase: "validation_error",
        fieldErrors: action.fieldErrors,
      };
    case "SUBMIT_STARTED":
      return {
        phase: "submitting",
        runId: action.runId,
        attempt: action.attempt,
        scenario: action.scenario,
      };
    case "RESPONSE_RECEIVED":
      return { phase: "replay", response: action.response };
    case "REPLAY_COMPLETED":
      return state.phase === "replay"
        ? { phase: "result", response: state.response }
        : state;
    case "REQUEST_FAILED":
      return {
        phase: "request_error",
        code: action.code,
        runId: action.runId,
        attempt: action.attempt,
        scenario: action.scenario,
        canRetrySameRun: action.canRetrySameRun,
      };
    case "SESSION_LIMIT_REACHED":
      return { phase: "session_limit", attemptsUsed: 4 };
  }
}
