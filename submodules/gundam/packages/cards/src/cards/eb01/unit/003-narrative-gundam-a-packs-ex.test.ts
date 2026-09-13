import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import type { CardEffect } from "@tcg/gundam-types";
import { eb01NarrativeGundamAPacksEx003 } from "./003-narrative-gundam-a-packs-ex.ts";

describe("Narrative Gundam A-Packs (EX) (EB01-003)", () => {
  it("<Repair 2> recovers 2 HP at the end of its controller's turn", () => {
    const engine = GundamTestEngine.create({
      play: [{ card: eb01NarrativeGundamAPacksEx003, damage: 3 }],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(unitId)).toBe(1);
  });

  it("rests all Units and draws when that effect rests three or more Units", () => {
    const restedWitness = createMockUnit({
      effects: [
        {
          type: "triggered",
          activation: { timing: ["onRestedByEffect"], conditions: [{ type: "eventCardIsSelf" }] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 1,
                target: { owner: "self", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "When this Unit is rested by an effect, deal 1 damage to this Unit.",
        },
      ] as CardEffect[],
    });
    const engine = GundamTestEngine.create(
      {
        play: [eb01NarrativeGundamAPacksEx003, createMockUnit()],
        deck: [createMockUnit()],
      },
      {
        play: [
          { card: createMockUnit({ hp: 10 }), exhausted: true },
          restedWitness,
          createMockUnit(),
        ],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const p1Units = p1.getCardsInZone("battleArea");
    const enemyIds = p2.getCardsInZone("battleArea");
    const witnessId = enemyIds[1]!;

    expectSuccess(p1.enterBattle(p1Units[0]!, enemyIds[0]!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.isExhausted(p1Units[0]!)).toBe(true);
    expect(p1.isExhausted(p1Units[1]!)).toBe(true);
    expect(p2.getDamage(witnessId)).toBe(1);
    expect(p1.getHand()).toHaveLength(1);
  });
});
