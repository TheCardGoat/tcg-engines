import { describe, expect, it } from "vitest";
import {
  DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID,
  getGrandArchiveAutomatedActionStrategyOption,
  getSafeGrandArchiveAutomatedActionStrategyOption,
  GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES,
  resolveGrandArchiveAutomatedActionStrategyOption,
} from "./strategy-registry.ts";

describe("Grand Archive automated strategy registry", () => {
  it("owns unique strategy identities and explicit scopes", () => {
    const ids = GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES.map((option) => option.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      "champion-profile",
      "value-extract",
      "first-legal",
      "pass-only",
      "random",
    ]);
    expect(GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES[0]?.scope).toBe("dispatcher");
    expect(
      GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES.slice(1).every(
        (option) => option.scope === "generic",
      ),
    ).toBe(true);
  });

  it("resolves the declared default and safely falls back from unknown ids", () => {
    const defaultOption = getSafeGrandArchiveAutomatedActionStrategyOption();
    expect(defaultOption.id).toBe(DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID);
    expect(defaultOption).not.toHaveProperty("testOnly");
    expect(getSafeGrandArchiveAutomatedActionStrategyOption("unknown").id).toBe(
      DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID,
    );
    expect(resolveGrandArchiveAutomatedActionStrategyOption(null, "pass-only").id).toBe(
      "pass-only",
    );
  });

  it("returns undefined from strict lookup so configuration boundaries can reject typos", () => {
    expect(getGrandArchiveAutomatedActionStrategyOption("random")?.strategy).toBeTypeOf("function");
    expect(getGrandArchiveAutomatedActionStrategyOption("typo")).toBeUndefined();
  });
});
