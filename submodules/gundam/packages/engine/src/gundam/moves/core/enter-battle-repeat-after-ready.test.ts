import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "../../../index.ts";

const readyOnAttack: CardEffect = {
  type: "triggered",
  activation: { timing: ["attack"] },
  directives: [
    {
      action: {
        action: "setActive",
        target: { owner: "self", cardType: "unit" },
      },
    },
  ],
  sourceText: "【Attack】Set this Unit as active.",
};

describe("repeat attacks after an effect readies the attacker", () => {
  it("lets an active Unit declare another attack in the same turn", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5, effects: [readyOnAttack] });
    const defender = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expect(p1.isExhausted(attackerId)).toBe(false);
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p1.enterBattle(attackerId, defenderId));
  });
});
