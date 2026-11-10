"use client";

import Link from "next/link";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { DigitalTwinResult } from "@/components/playground/DigitalTwinResult";
import { ErrorState } from "@/components/playground/ErrorState";
import { LocaleSwitcher } from "@/components/playground/LocaleSwitcher";
import { NeutralSubmitting } from "@/components/playground/NeutralSubmitting";
import { RunLimitBanner } from "@/components/playground/RunLimitBanner";
import { WorkflowReplay } from "@/components/playground/WorkflowReplay";
import { WorkflowRunForm } from "@/components/playground/WorkflowRunForm";
import { translate } from "@/lib/i18n/translate";
import {
  MockWorkflowRequestError,
  executeMockWorkflow,
} from "@/lib/mock/provider";
import {
  SessionLimitError,
  claimMockRun,
  clearPendingRun,
  createUuid,
  getAttemptsUsed,
  getOrCreateSessionId,
  getPendingRun,
  getStoredLocale,
  markMockRunCompleted,
  recordMockInvocation,
  setPendingRun,
  storeLocale,
} from "@/lib/session/browser-session";
import {
  experienceReducer,
  initialExperienceState,
} from "@/lib/state/experience-machine";
import {
  executeWorkflowRequestSchema,
  toFieldErrors,
  workflowFormSchema,
} from "@/lib/validation/execute-request";
import {
  mockScenarios,
  type Attempt,
  type ExecuteWorkflowRequest,
  type Locale,
  type MockScenario,
  type WorkflowFormValues,
} from "@/types/workflow";

const initialForm: WorkflowFormValues = {
  name: "",
  company: "",
  topic: "ai_automation",
};

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedForQa =
      new URLSearchParams(window.location.search).get("motion") === "reduce";
    const update = () => setReducedMotion(forcedForQa || mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function readScenario(): MockScenario {
  const value = new URLSearchParams(window.location.search).get("scenario");
  return mockScenarios.includes(value as MockScenario)
    ? (value as MockScenario)
    : "default";
}

export function WorkflowPlayground() {
  const [locale, setLocale] = useState<Locale>("en");
  const [form, setForm] = useState<WorkflowFormValues>(initialForm);
  const [sessionId, setSessionId] = useState("");
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [scenario, setScenario] = useState<MockScenario>("default");
  const [experience, dispatch] = useReducer(
    experienceReducer,
    initialExperienceState,
  );
  const stageRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const contactUrl = process.env.NEXT_PUBLIC_CONTACT_URL || undefined;

  /* Browser storage is intentionally hydrated after mount. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedLocale = getStoredLocale(window.localStorage);
    const currentSessionId = getOrCreateSessionId(window.sessionStorage);
    const selectedScenario = readScenario();
    setLocale(storedLocale);
    setSessionId(currentSessionId);
    setAttemptsUsed(getAttemptsUsed(window.sessionStorage, currentSessionId));
    setScenario(selectedScenario);

    const pending = getPendingRun(window.sessionStorage);
    if (pending && pending.request.session_id === currentSessionId) {
      setForm({
        name: pending.request.name,
        company: pending.request.company,
        topic: pending.request.topic,
      });
      dispatch({
        type: "REQUEST_FAILED",
        code: "RUN_ALREADY_PROCESSING",
        runId: pending.request.run_id,
        attempt: pending.attempt,
        scenario: pending.scenario,
        canRetrySameRun: true,
      });
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (experience.phase === "ready") return;

    if (experience.phase === "validation_error") {
      const field = experience.fieldErrors.name
        ? "recruiter-name"
        : experience.fieldErrors.company
          ? "company-name"
          : null;
      if (field) {
        document.getElementById(field)?.focus();
        return;
      }
    }

    window.setTimeout(
      () => stageRef.current?.focus({ preventScroll: true }),
      0,
    );
  }, [experience]);

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    storeLocale(window.localStorage, nextLocale);
  };

  const runClaimedRequest = useCallback(
    async (
      request: ExecuteWorkflowRequest,
      attempt: Attempt,
      runScenario: MockScenario,
    ) => {
      setPendingRun(window.sessionStorage, {
        request,
        attempt,
        scenario: runScenario,
      });
      dispatch({
        type: "SUBMIT_STARTED",
        runId: request.run_id,
        attempt,
        scenario: runScenario,
      });

      const invocation = recordMockInvocation(
        window.sessionStorage,
        request.session_id,
        request.run_id,
      );

      try {
        const response = await executeMockWorkflow({
          request,
          attempt,
          scenario: runScenario,
          invocation,
        });
        markMockRunCompleted(
          window.sessionStorage,
          request.session_id,
          request.run_id,
        );
        setAttemptsUsed(
          getAttemptsUsed(window.sessionStorage, request.session_id),
        );
        dispatch({ type: "RESPONSE_RECEIVED", response });
      } catch (error) {
        const requestError =
          error instanceof MockWorkflowRequestError
            ? error
            : new MockWorkflowRequestError("WORKFLOW_UNAVAILABLE", true);
        dispatch({
          type: "REQUEST_FAILED",
          code: requestError.code,
          runId: request.run_id,
          attempt,
          scenario: runScenario,
          canRetrySameRun: requestError.canRetrySameRun,
        });
      }
    },
    [],
  );

  const submitNewRun = () => {
    const formResult = workflowFormSchema.safeParse(form);
    if (!formResult.success) {
      dispatch({
        type: "VALIDATION_FAILED",
        fieldErrors: toFieldErrors(formResult.error),
      });
      return;
    }

    const currentSessionId =
      sessionId || getOrCreateSessionId(window.sessionStorage);
    const runId = createUuid();
    const requestResult = executeWorkflowRequestSchema.safeParse({
      ...formResult.data,
      locale,
      session_id: currentSessionId,
      run_id: runId,
    });

    if (!requestResult.success) {
      dispatch({
        type: "VALIDATION_FAILED",
        fieldErrors: toFieldErrors(requestResult.error),
      });
      return;
    }

    setForm(formResult.data);
    setSessionId(currentSessionId);

    try {
      const claim = claimMockRun(
        window.sessionStorage,
        currentSessionId,
        runId,
      );
      setAttemptsUsed(getAttemptsUsed(window.sessionStorage, currentSessionId));
      void runClaimedRequest(requestResult.data, claim.attempt, scenario);
    } catch (error) {
      if (error instanceof SessionLimitError) {
        dispatch({ type: "SESSION_LIMIT_REACHED" });
        setAttemptsUsed(4);
      }
    }
  };

  const retrySameRun = () => {
    if (experience.phase !== "request_error") return;
    const pending = getPendingRun(window.sessionStorage);
    if (!pending || pending.request.run_id !== experience.runId) {
      dispatch({
        type: "REQUEST_FAILED",
        code: "RUN_STATE_UNKNOWN",
        runId: experience.runId,
        attempt: experience.attempt,
        scenario: experience.scenario,
        canRetrySameRun: false,
      });
      return;
    }

    void runClaimedRequest(pending.request, pending.attempt, pending.scenario);
  };

  const startAnotherRun = () => {
    clearPendingRun(window.sessionStorage);
    dispatch({ type: "RETURN_READY" });
  };

  const completeReplay = useCallback(() => {
    dispatch({ type: "REPLAY_COMPLETED" });
  }, []);

  const fieldErrors =
    experience.phase === "validation_error" ? experience.fieldErrors : {};
  const stageAnnouncement = (() => {
    switch (experience.phase) {
      case "submitting":
        return translate(locale, "submitting.title");
      case "replay":
        return translate(locale, "workflow.title");
      case "result":
        return translate(locale, "twin.name");
      case "request_error":
        return translate(locale, "error.title");
      case "session_limit":
        return translate(locale, "limit.title");
      case "validation_error":
        return translate(locale, "error.VALIDATION_ERROR");
      case "ready":
        return "";
    }
  })();

  return (
    <div className="playground-shell">
      <div aria-hidden="true" className="ambient ambient-one" />
      <div aria-hidden="true" className="ambient ambient-two" />
      <div aria-hidden="true" className="page-grid" />

      <header className="app-header">
        <Link
          aria-label="Interactive Workflow Playground"
          className="brand"
          href="/playground"
        >
          <span className="brand-mark">K</span>
          <span>
            <strong>{translate(locale, "brand.name")}</strong>
            <small>{translate(locale, "brand.context")}</small>
          </span>
        </Link>
        <div className="header-meta">
          <span className="mock-chip">{translate(locale, "mock.badge")}</span>
          <LocaleSwitcher locale={locale} onChange={changeLocale} />
        </div>
      </header>

      <main className="app-main">
        <section className="experience-stage" ref={stageRef} tabIndex={-1}>
          {experience.phase === "ready" ||
          experience.phase === "validation_error" ? (
            <div className="ready-stage">
              <div className="hero-copy">
                <div className="hero-kicker-row">
                  <span className="hero-kicker">
                    {translate(locale, "page.eyebrow")}
                  </span>
                  <span className="duration-pill">
                    {translate(locale, "page.duration")}
                  </span>
                </div>
                <h1>{translate(locale, "page.title")}</h1>
                <p className="hero-description">
                  {translate(locale, "page.description")}
                </p>
                <div
                  aria-label={translate(locale, "page.stackLabel")}
                  className="stack-rail"
                >
                  {[
                    ["01", "n8n"],
                    ["02", "LLM"],
                    ["03", "Sheets"],
                    ["04", "Telegram"],
                  ].map(([number, label]) => (
                    <span key={label}>
                      <small>{number}</small>
                      {label}
                    </span>
                  ))}
                </div>
                <div className="mock-notice">
                  <span aria-hidden="true">◎</span>
                  <p>{translate(locale, "mock.notice")}</p>
                </div>
                {scenario !== "default" ? (
                  <code className="qa-scenario">
                    {translate(locale, "mock.qaMode", { scenario })}
                  </code>
                ) : null}
              </div>

              <WorkflowRunForm
                attemptsUsed={attemptsUsed}
                errors={fieldErrors}
                locale={locale}
                onChange={setForm}
                onSubmit={submitNewRun}
                values={form}
              />
            </div>
          ) : null}

          {experience.phase === "submitting" ? (
            <NeutralSubmitting locale={locale} runId={experience.runId} />
          ) : null}

          {experience.phase === "replay" ? (
            <WorkflowReplay
              locale={locale}
              onComplete={completeReplay}
              reducedMotion={reducedMotion}
              response={experience.response}
            />
          ) : null}

          {experience.phase === "result" ? (
            <DigitalTwinResult
              attemptsUsed={attemptsUsed}
              contactUrl={contactUrl}
              locale={locale}
              onNewRun={startAnotherRun}
              response={experience.response}
            />
          ) : null}

          {experience.phase === "request_error" ? (
            <ErrorState
              canRetrySameRun={experience.canRetrySameRun}
              code={experience.code}
              locale={locale}
              onNewRun={startAnotherRun}
              onRetry={retrySameRun}
              runId={experience.runId}
            />
          ) : null}

          {experience.phase === "session_limit" ? (
            <RunLimitBanner contactUrl={contactUrl} locale={locale} />
          ) : null}
        </section>

        <p aria-live="polite" className="sr-only" role="status">
          {stageAnnouncement}
        </p>
      </main>

      <footer className="app-footer">
        <span>{translate(locale, "footer.contract")}</span>
        <span aria-hidden="true">·</span>
        <span>{translate(locale, "footer.privacy")}</span>
      </footer>
    </div>
  );
}
