import { describe, expect, it } from "vite-plus/test";

import type { FabRulesFacts } from "../../rules-view.ts";
import { dependencyStages } from "../../continuous/compiler/dependencies.ts";
import { EMPTY_RULES_FACTS } from "../../rules-evaluator.ts";
import { evaluateSwordHitThisTurn } from "./sword-hit-this-turn.ts";

const facts = (swordHits: number): FabRulesFacts =>
  ({
    ...EMPTY_RULES_FACTS,
    phase: "end",
    playerSwordHitsThisTurn: { ...EMPTY_RULES_FACTS.playerSwordHitsThisTurn, p1: swordHits },
  }) satisfies FabRulesFacts;

const context = (swordHits: number) => ({
  controllerId: "p1",
  source: null,
  bindings: { objects: {}, numbers: {}, strings: {} },
  facts: facts(swordHits),
});

describe("sword-hit-this-turn condition", () => {
  it("is owned as a dedicated typed condition with stage-independent facts", () => {
    expect(dependencyStages({ condition: { type: "sword-hit-this-turn" } })).toEqual({
      ok: true,
      stages: [],
    });
  });

  it("matches the controller's sword-hit ledger and fails when empty", () => {
    expect(evaluateSwordHitThisTurn({ type: "sword-hit-this-turn" }, context(1), new Map())).toBe(
      true,
    );
    expect(evaluateSwordHitThisTurn({ type: "sword-hit-this-turn" }, context(0), new Map())).toBe(
      false,
    );
  });
});
