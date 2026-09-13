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
import {
  classifyTargetFilter,
  collectFirstSegmentActivationActions,
  extractActionFilters,
  getFilterCountBounds,
} from "./target-legality.ts";

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

describe("classifyTargetFilter", () => {
  it("treats a counted public-zone choose as a targetChoice", () => {
    expect(classifyTargetFilter({ owner: "opponent", cardType: "unit", count: 1 })).toBe(
      "targetChoice",
    );
    expect(
      classifyTargetFilter({
        owner: "friendly",
        cardType: "unit",
        zone: "trash",
        count: 1,
      }),
    ).toBe("targetChoice");
  });

  it("does not treat hand, deck, or shield selections as 10-2-2-1 targets", () => {
    expect(classifyTargetFilter({ owner: "friendly", zone: "hand", count: 1 })).toBe(
      "privateSelection",
    );
    expect(classifyTargetFilter({ owner: "friendly", zone: "deck", count: 1 })).toBe(
      "privateSelection",
    );
    expect(classifyTargetFilter({ owner: "friendly", zone: "shieldArea", count: 1 })).toBe(
      "privateSelection",
    );
  });

  it("treats self and mass filters as non-gates", () => {
    expect(classifyTargetFilter({ owner: "self", cardType: "unit" })).toBe("implicitSelf");
    expect(classifyTargetFilter({ owner: "opponent", cardType: "unit", count: "all" })).toBe(
      "massAction",
    );
  });
});

describe("collectFirstSegmentActivationActions", () => {
  it("stops before an If-you-do choose (rule 10-1-8-1-2)", () => {
    const actions = collectFirstSegmentActivationActions([
      {
        action: {
          action: "rest",
          target: { owner: "friendly", cardType: "unit", state: "active", count: 2 },
        },
      },
      {
        action: {
          action: "dealDamage",
          amount: 3,
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
        dependsOnPrevious: true,
      },
    ]);
    expect(actions).toHaveLength(1);
    expect(actions[0]?.action.action).toBe("rest");
  });

  it("does not treat drawIfTargetMatches as a new activation-gate choose", () => {
    const actions = collectFirstSegmentActivationActions([
      {
        action: {
          action: "recoverHP",
          amount: 2,
          target: { owner: "friendly", cardType: "unit", count: 1 },
        },
      },
      {
        action: {
          action: "drawIfTargetMatches",
          count: 1,
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "pairedPilotLevel", comparison: "lte", value: 3 }],
          },
        },
      },
    ]);
    expect(actions).toHaveLength(1);
    expect(actions[0]?.action.action).toBe("recoverHP");
  });

  it("does not put a discard or later If-you-do choose in the activation gate", () => {
    const actions = collectFirstSegmentActivationActions([
      { action: { action: "discard", count: 1 } },
      {
        action: {
          action: "dealDamage",
          amount: 1,
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
        dependsOnPrevious: true,
      },
    ]);
    expect(actions).toEqual([]);
  });

  it("keeps a following public choose in the first segment after implicit self", () => {
    const actions = collectFirstSegmentActivationActions([
      {
        action: {
          action: "destroy",
          target: { owner: "self", cardType: "unit", count: 1 },
        },
      },
      {
        action: {
          action: "dealDamage",
          amount: 1,
          target: {
            owner: "opponent",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
          },
        },
      },
    ]);
    expect(actions).toHaveLength(1);
    expect(actions[0]?.action.action).toBe("dealDamage");
  });

  it("stops before a Then-choose that follows a non-target preamble", () => {
    const actions = collectFirstSegmentActivationActions([
      { action: { action: "addShieldToHand", count: 1 } },
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: 2,
          duration: "thisTurn",
          target: { owner: "friendly", cardType: "unit", count: 1 },
        },
      },
    ]);
    expect(actions).toEqual([]);
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

  it("includes both target filters for redirectBattleDamage", () => {
    const target = { owner: "self", cardType: "unit" };
    const redirectTo = { owner: "friendly", cardType: "unit", count: 1 };
    const action = {
      action: "redirectBattleDamage",
      target,
      redirectTo,
    } as never;

    expect(extractActionFilters(action)).toEqual([target, redirectTo]);
  });

  it.each([
    "millDeckThenAddToHand",
    "millDeckThenDamageIfTrait",
    "millDeckThenDamageByTraitCount",
    "millDeckThenStatModifierIfTrait",
    "millDeckThenStatModifierIfLevel",
  ])("defers the target filter for %s until after milling", (actionName) => {
    const action = {
      action: actionName,
      target: { owner: "opponent", cardType: "unit", count: 1 },
    } as never;

    expect(extractActionFilters(action)).toEqual([]);
  });
});
