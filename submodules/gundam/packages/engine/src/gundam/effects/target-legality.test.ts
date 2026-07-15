/**
 * Target-legality shared primitives.
 *
 * These primitives are the foundation under three different evaluators
 * (`play-command.ts:validateEffectTargets`,
 *  `play-card-shared.ts:validateDeployTriggerTargets`,
 *  `pending-effects.ts:evaluateLegalTargets`). The structural pieces
 * (count bounds, gather, filter extraction) are shared so play-time and
 * resolve-time evaluations cannot drift.
 *
 * Direct unit tests on the primitives pin the contract; the consolidated
 * end-to-end behaviour is covered by the existing per-move test suites.
 */

import { describe, it, expect } from "vite-plus/test";
import type { TargetFilter } from "@tcg/gundam-types";
import { extractActionFilters, getFilterCountBounds } from "./target-legality.ts";

describe("getFilterCountBounds", () => {
  it("treats undefined count as unbounded", () => {
    const filter = { owner: "opponent", cardType: "unit" } as unknown as TargetFilter;
    expect(getFilterCountBounds(filter)).toEqual({ min: 0, max: Number.POSITIVE_INFINITY });
  });

  it("treats 'all' as unbounded", () => {
    const filter = { owner: "opponent", cardType: "unit", count: "all" } as unknown as TargetFilter;
    expect(getFilterCountBounds(filter)).toEqual({ min: 0, max: Number.POSITIVE_INFINITY });
  });

  it("interprets a numeric count as exact", () => {
    const filter = { owner: "opponent", cardType: "unit", count: 2 } as unknown as TargetFilter;
    expect(getFilterCountBounds(filter)).toEqual({ min: 2, max: 2 });
  });

  it("interprets a {min, max} count as a range", () => {
    const filter = {
      owner: "opponent",
      cardType: "unit",
      count: { min: 1, max: 3 },
    } as unknown as TargetFilter;
    expect(getFilterCountBounds(filter)).toEqual({ min: 1, max: 3 });
  });
});

describe("extractActionFilters", () => {
  it("returns the action's target filter when present", () => {
    const action = {
      action: "rest",
      target: { owner: "opponent", cardType: "unit", count: 1 },
    } as never;
    const filters = extractActionFilters(action);
    expect(filters).toHaveLength(1);
    expect((filters[0] as { cardType: string }).cardType).toBe("unit");
  });

  it("returns an empty array for actions without a target", () => {
    const action = { action: "draw", count: 1 } as never;
    expect(extractActionFilters(action)).toEqual([]);
  });

  it("includes the `unit` filter for chooseAttackTarget (play-time required choice)", () => {
    const action = {
      action: "chooseAttackTarget",
      unit: { owner: "friendly", cardType: "unit", count: 1 },
      attackTarget: { owner: "opponent", cardType: "unit" },
    } as never;
    const filters = extractActionFilters(action);
    // Both `target` (if present) and `unit` are extracted; the
    // `attackTarget` field is intentionally excluded because it's a
    // "may choose later" filter, not a play-time required choice.
    expect(filters).toHaveLength(1);
    expect((filters[0] as { owner: string }).owner).toBe("friendly");
  });

  it("does not include `unit` for non-chooseAttackTarget actions even when present", () => {
    // Defensive: a `unit` field on some other action should not be
    // confused for a required choice — only chooseAttackTarget elevates
    // it to play-time-required status.
    const action = {
      action: "rest",
      target: { owner: "opponent", cardType: "unit", count: 1 },
      unit: { owner: "friendly", cardType: "unit", count: 1 },
    } as never;
    const filters = extractActionFilters(action);
    expect(filters).toHaveLength(1);
    expect((filters[0] as { owner: string }).owner).toBe("opponent");
  });
});
