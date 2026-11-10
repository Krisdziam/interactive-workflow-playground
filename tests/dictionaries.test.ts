import { describe, expect, it } from "vitest";

import { en, uk } from "@/lib/i18n/dictionaries";
import { buildTwinResponse } from "@/lib/i18n/translate";

describe("localization dictionaries", () => {
  it("keeps EN and UA keys identical", () => {
    expect(Object.keys(uk).sort()).toEqual(Object.keys(en).sort());
  });

  it("contains no empty values", () => {
    expect(Object.values(en).every((value) => value.trim().length > 0)).toBe(
      true,
    );
    expect(Object.values(uk).every((value) => value.trim().length > 0)).toBe(
      true,
    );
  });

  it("builds localized response copy without unresolved placeholders", () => {
    const response = buildTwinResponse({
      locale: "uk",
      name: "Ірина",
      company: "Acme",
      topic: "api_integrations",
      attempt: 2,
    });

    expect(response).toContain("Ірина");
    expect(response).toContain("для Acme");
    expect(response).not.toContain("{{");
  });
});
