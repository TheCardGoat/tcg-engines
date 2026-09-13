/**
 * Translation-contract tests: the `en` catalog must ship one template per
 * registered key, and every template's `{placeholder}` set must match the
 * typed values map exactly (no missing, no extra, no stray braces).
 */
import { describe, expect, it } from "vitest";
import { FAB_LOG_KEYS } from "./messages.ts";
import {
  FAB_LOG_TRANSLATIONS_BY_LOCALE,
  REQUIRED_FAB_LOG_LOCALES,
  assertFabLogTranslationContract,
  collectFabLogTranslationIssues,
} from "./translation-contract.ts";

describe("FabLog translation contract", () => {
  it("ships exactly one template per registered key in every required locale", () => {
    expect(REQUIRED_FAB_LOG_LOCALES).toContain("en");
    for (const locale of REQUIRED_FAB_LOG_LOCALES) {
      // `$`-prefixed entries are catalog metadata (inlang $schema), not messages.
      const templateKeys = Object.keys(FAB_LOG_TRANSLATIONS_BY_LOCALE[locale]).filter(
        (key) => !key.startsWith("$"),
      );
      expect(templateKeys.sort()).toEqual([...FAB_LOG_KEYS].sort());
    }
  });

  it("reports zero parity issues (missing keys / missing or extra placeholders)", () => {
    expect(collectFabLogTranslationIssues()).toEqual([]);
  });

  it("assertFabLogTranslationContract does not throw for the shipped catalog", () => {
    expect(() => assertFabLogTranslationContract()).not.toThrow();
  });
});
