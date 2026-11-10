import { z } from "zod";

import { locales, topics, type FieldErrors } from "@/types/workflow";

const controlCharacterPattern = /\p{Cc}/u;
export const uuidV4Pattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalize = (value: string) => value.trim().normalize("NFC");

const nameSchema = z
  .string()
  .transform(normalize)
  .refine((value) => value.length >= 2, "validation.nameMin")
  .refine((value) => value.length <= 60, "validation.nameMax")
  .refine(
    (value) => !controlCharacterPattern.test(value),
    "validation.controlCharacters",
  );

const companySchema = z
  .string()
  .transform(normalize)
  .refine((value) => value.length <= 80, "validation.companyMax")
  .refine(
    (value) => !controlCharacterPattern.test(value),
    "validation.controlCharacters",
  );

const uuidV4Schema = z.string().regex(uuidV4Pattern, "validation.uuidV4");

export const workflowFormSchema = z
  .object({
    name: nameSchema,
    company: companySchema,
    topic: z.enum(topics),
  })
  .strict();

export const executeWorkflowRequestSchema = workflowFormSchema
  .extend({
    locale: z.enum(locales),
    session_id: uuidV4Schema,
    run_id: uuidV4Schema,
  })
  .strict();

export type ExecuteWorkflowRequestInput = z.input<
  typeof executeWorkflowRequestSchema
>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      (field === "name" || field === "company" || field === "topic") &&
      !fieldErrors[field]
    ) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
