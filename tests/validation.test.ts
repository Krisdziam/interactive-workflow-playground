import { describe, expect, it } from "vitest";

import { executeWorkflowRequestSchema } from "@/lib/validation/execute-request";

const validRequest = {
  name: "  Олександр  ",
  company: "  Acme  ",
  topic: "ai_automation",
  locale: "uk",
  session_id: "8f4f4a5f-4160-4dcb-a789-74e5e6699694",
  run_id: "850d5734-6db5-41cc-972b-19949b6640ab",
};

describe("executeWorkflowRequestSchema", () => {
  it("normalizes valid Unicode input", () => {
    const parsed = executeWorkflowRequestSchema.parse(validRequest);

    expect(parsed.name).toBe("Олександр");
    expect(parsed.company).toBe("Acme");
    expect(parsed.locale).toBe("uk");
  });

  it("rejects control characters", () => {
    const parsed = executeWorkflowRequestSchema.safeParse({
      ...validRequest,
      name: "Alex\nAdmin",
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects unsupported topics and non-v4 UUIDs", () => {
    expect(
      executeWorkflowRequestSchema.safeParse({
        ...validRequest,
        topic: "portfolio",
      }).success,
    ).toBe(false);
    expect(
      executeWorkflowRequestSchema.safeParse({
        ...validRequest,
        run_id: "850d5734-6db5-11cc-972b-19949b6640ab",
      }).success,
    ).toBe(false);
  });

  it("uses a strict object policy", () => {
    expect(
      executeWorkflowRequestSchema.safeParse({
        ...validRequest,
        secret_header: "never-accepted",
      }).success,
    ).toBe(false);
  });
});
