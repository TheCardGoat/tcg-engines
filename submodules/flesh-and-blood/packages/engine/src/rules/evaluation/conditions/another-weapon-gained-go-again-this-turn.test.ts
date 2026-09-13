import { describe, expect, it } from "vite-plus/test";

import type { FabObjectRef } from "../../continuous/ir.ts";
import { dependencyStages } from "../../continuous/compiler/dependencies.ts";
import { EMPTY_RULES_FACTS } from "../../rules-evaluator.ts";
import { evaluateAnotherWeaponGainedGoAgainThisTurn } from "./another-weapon-gained-go-again-this-turn.ts";

const quicksilver: FabObjectRef = { instanceId: "quicksilver", incarnation: 0 };

const context = (gainedWeaponInstanceIds: readonly string[]) => ({
  controllerId: "p1",
  source: quicksilver,
  subject: quicksilver,
  bindings: { objects: {}, numbers: {}, strings: {} },
  facts: {
    ...EMPTY_RULES_FACTS,
    playerWeaponInstancesGainedGoAgainThisTurn: { p1: gainedWeaponInstanceIds },
  },
});

describe("another-weapon-gained-go-again-this-turn condition", () => {
  it("is an explicitly owned condition with stage-independent fact dependencies", () => {
    expect(
      dependencyStages({ condition: { type: "another-weapon-gained-go-again-this-turn" } }),
    ).toEqual({ ok: true, stages: [] });
  });

  it("matches another weapon but excludes the source weapon", () => {
    const condition = { type: "another-weapon-gained-go-again-this-turn" } as const;
    expect(
      evaluateAnotherWeaponGainedGoAgainThisTurn(
        condition,
        context(["quicksilver", "other-weapon"]),
        new Map(),
      ),
    ).toBe(true);
    expect(
      evaluateAnotherWeaponGainedGoAgainThisTurn(condition, context(["quicksilver"]), new Map()),
    ).toBe(false);
    expect(evaluateAnotherWeaponGainedGoAgainThisTurn(condition, context([]), new Map())).toBe(
      false,
    );
  });
});
