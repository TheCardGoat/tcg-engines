/**
 * Permissive `chooseAttackTarget` → `grant-attack-target-option` (Gap A).
 *
 * Validates that the executor registers a `grant-attack-target-option`
 * continuous effect (not `force-attack-target`) when executing a
 * `chooseAttackTarget` action. This models "may choose" semantics where
 * the unit gains the *option* to attack additional targets rather than
 * being forced to only attack those targets.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "../../index.ts";

/**
 * GD01-043 shape: triggered deploy → chooseAttackTarget with thisTurn duration.
 */
const deployGrantUnit: UnitCard = {
  cardNumber: "TEST-GRANT-01",
  name: "Deploy Grant Test Unit",
  type: "unit",
  color: "green",
  traits: ["test"],
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect:
    "【Deploy】Choose 1 of your green Units. During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "green" }],
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText: "【Deploy】test grant attack target option",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};

describe("grant-attack-target-option (chooseAttackTarget executor)", () => {
  it("deploy trigger registers grant-attack-target-option on chosen unit", () => {
    const greenTarget = createMockUnit({ ap: 3, hp: 3, color: "green" });
    const engine = GundamTestEngine.create({
      hand: [deployGrantUnit],
      play: [greenTarget],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(deployGrantUnit, { targets: [targetId] }));

    const effects = engine.getG().continuousEffects;
    const grantEffect = effects.find(
      (e) => e.targetId === targetId && e.payload.kind === "grant-attack-target-option",
    );
    expect(grantEffect).toBeDefined();
    expect(grantEffect!.duration).toBe("this-turn");
  });

  it("does NOT register force-attack-target (old behavior)", () => {
    const greenTarget = createMockUnit({ ap: 3, hp: 3, color: "green" });
    const engine = GundamTestEngine.create({
      hand: [deployGrantUnit],
      play: [greenTarget],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(deployGrantUnit, { targets: [targetId] }));

    const effects = engine.getG().continuousEffects;
    const forceEffect = effects.find(
      (e) => e.targetId === targetId && e.payload.kind === "force-attack-target",
    );
    expect(forceEffect).toBeUndefined();
  });
});
