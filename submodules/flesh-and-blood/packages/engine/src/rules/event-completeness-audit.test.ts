import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import * as publicEngine from "../index.ts";
import { FAB_EVENT_PRODUCTION_SUPPORT } from "./event-production-support.ts";
import {
  FAB_COST_PRODUCTION_SUPPORT,
  FAB_EFFECT_PRODUCTION_SUPPORT,
} from "./effect-production-support.ts";
type SupportedTriggerCategory = "static" | "inline" | "delayed" | "state" | "granted";

const TRIGGER_CATEGORY_COVERAGE = {
  static: {
    matcher: "matches actor relationships, card filters, and event bindings",
    production: "collects and resolves a static event trigger",
  },
  inline: {
    matcher: "an inline-triggered effect triggers only in its generation window",
    production: "collects an inline trigger from the resolving card's LKI",
  },
  delayed: {
    matcher: "counts a prevented trigger toward its limit",
    production: "registers, consumes, and resolves a delayed trigger",
  },
  state: {
    matcher: "collects an eligible state trigger and suppresses the same pending layer",
    production: "scans a state trigger to quiescence before returning priority",
  },
  granted: {
    matcher: "snapshots static, granted, and persisted delayed trigger sources",
    production: "collects a triggered ability granted by a canonical property effect",
  },
} satisfies Record<
  SupportedTriggerCategory,
  { readonly matcher: string; readonly production: string }
>;

describe("FAB event completeness gates", () => {
  it("requires a production producer or an explicit unsupported mechanic for every event", () => {
    const entries = Object.entries(FAB_EVENT_PRODUCTION_SUPPORT);
    expect(entries.length).toBeGreaterThan(0);
    for (const [eventName, support] of entries) {
      if (support.status === "production") {
        expect(support.producer, `${eventName} producer`).not.toHaveLength(0);
      } else {
        expect(support.mechanic, `${eventName} unsupported marker`).not.toHaveLength(0);
      }
    }
  });

  it("records the executable and unsupported boundary for every canonical effect type", () => {
    for (const [effectType, support] of Object.entries({
      ...FAB_EFFECT_PRODUCTION_SUPPORT,
      ...Object.fromEntries(
        Object.entries(FAB_COST_PRODUCTION_SUPPORT).map(([name, support]) => [
          `cost:${name}`,
          support,
        ]),
      ),
    })) {
      if (support.status === "partial") {
        expect(support.supported, `${effectType} supported shapes`).not.toHaveLength(0);
        expect(support.unsupported, `${effectType} unsupported shapes`).not.toHaveLength(0);
      } else {
        expect(support.mechanic, `${effectType} unsupported mechanic`).not.toHaveLength(0);
      }
    }
  });

  it("does not expose or retain the legacy state-mutating effect interpreter", () => {
    expect("applySimpleEffect" in publicEngine).toBe(false);
    expect("applyModalAbility" in publicEngine).toBe(false);

    const abilityHelpers = readFileSync(new URL("../abilities.ts", import.meta.url), "utf8");
    expect(abilityHelpers).not.toContain("function applySimpleEffect");
    expect(abilityHelpers).not.toContain("function applyModalAbility");
  });

  it("requires matcher and normal production-move coverage for every supported trigger category", () => {
    const matcherTests = readFileSync(
      new URL("./trigger-matcher.test.ts", import.meta.url),
      "utf8",
    );
    const snapshotTests = readFileSync(new URL("./snapshots.test.ts", import.meta.url), "utf8");
    const productionTests = readFileSync(
      new URL("./trigger-category-production.test.ts", import.meta.url),
      "utf8",
    );
    for (const [category, coverage] of Object.entries(TRIGGER_CATEGORY_COVERAGE)) {
      expect(
        matcherTests.includes(coverage.matcher) || snapshotTests.includes(coverage.matcher),
        `${category} matcher coverage`,
      ).toBe(true);
      expect(productionTests, `${category} production move coverage`).toContain(
        coverage.production,
      );
    }
  });
});
