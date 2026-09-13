import { describe, expect, it } from "vitest";
import type { FabEffect, FabKeyword } from "@tcg/flesh-and-blood-types";
import {
  FAB_EFFECT_TYPES,
  FAB_KEYWORD_NAMES,
  KEYWORD_EFFECT_INVENTORY,
  type InventoryStatus,
} from "./keyword-effect-inventory.ts";
import { CR_SECTION_8_5_COVERAGE } from "./docs/cr-section-8.5-coverage.ts";

// ── Compile-time guards: the inventory must list every discriminant. ──
// Adding a new FabEffect.type / FabKeyword.name without a corresponding entry
// in FAB_EFFECT_TYPES / FAB_KEYWORD_NAMES fails tsc here. This is the primary
// drift-catcher that makes later phases' type additions self-driving.
type _EveryEffectTypeListed = FabEffect["type"] extends (typeof FAB_EFFECT_TYPES)[number]
  ? true
  : never;
type _EveryKeywordNameListed = FabKeyword["name"] extends (typeof FAB_KEYWORD_NAMES)[number]
  ? true
  : never;
// Force both aliases to be evaluated by the compiler (tuple, not intersection,
// to avoid a duplicate-constituent lint warning when both resolve to `true`).
export type __InventoryCompileGuard = readonly [_EveryEffectTypeListed, _EveryKeywordNameListed];

const ALLOWED_STATUSES: readonly InventoryStatus[] = [
  "tested",
  "meta",
  "noop",
  "label-shell",
  "unsupported",
  "partial",
  "deferred",
];

describe("keyword-effect inventory ledger", () => {
  it("has no duplicate ids within a kind", () => {
    const seenEffect = new Set<string>();
    const seenKeyword = new Set<string>();
    for (const row of KEYWORD_EFFECT_INVENTORY) {
      const set = row.kind === "effect" ? seenEffect : seenKeyword;
      expect(set.has(row.id), `duplicate ${row.kind} id: ${row.id}`).toBe(false);
      set.add(row.id);
    }
  });

  it("every effect id declared in FAB_EFFECT_TYPES has a row", () => {
    const rowIds = new Set(
      KEYWORD_EFFECT_INVENTORY.filter((r) => r.kind === "effect").map((r) => r.id),
    );
    for (const t of FAB_EFFECT_TYPES) {
      expect(rowIds.has(t), `effect type ${t} has no inventory row`).toBe(true);
    }
  });

  it("every keyword name declared in FAB_KEYWORD_NAMES has a row", () => {
    const rowIds = new Set(
      KEYWORD_EFFECT_INVENTORY.filter((r) => r.kind === "keyword").map((r) => r.id),
    );
    for (const n of FAB_KEYWORD_NAMES) {
      expect(rowIds.has(n), `keyword ${n} has no inventory row`).toBe(true);
    }
  });

  it("every row has a valid status and non-empty CR + suite", () => {
    for (const row of KEYWORD_EFFECT_INVENTORY) {
      expect(ALLOWED_STATUSES).toContain(row.status);
      expect(row.cr.length).toBeGreaterThan(0);
      expect(row.suite.length).toBeGreaterThan(0);
    }
  });
});

describe("CR §8.5 section coverage ledger", () => {
  it("covers all 58 effect keywords exactly once", () => {
    expect(CR_SECTION_8_5_COVERAGE).toHaveLength(58);
    const seen = new Set<string>();
    for (const row of CR_SECTION_8_5_COVERAGE) {
      expect(seen.has(row.cr), `duplicate CR section ${row.cr}`).toBe(false);
      seen.add(row.cr);
    }
  });

  it("every referenced inventory id exists in the inventory", () => {
    const ids = new Set(KEYWORD_EFFECT_INVENTORY.map((r) => r.id));
    for (const row of CR_SECTION_8_5_COVERAGE) {
      for (const id of row.inventoryIds) {
        expect(ids.has(id), `CR ${row.cr} references unknown inventory id ${id}`).toBe(true);
      }
    }
  });

  it("every covered row references at least one inventory id", () => {
    for (const row of CR_SECTION_8_5_COVERAGE) {
      if (row.status === "covered") {
        expect(
          row.inventoryIds.length,
          `CR ${row.cr} is 'covered' but lists no inventory id`,
        ).toBeGreaterThan(0);
      }
    }
  });
});
