import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  expectFailure,
} from "@tcg/gundam-engine";
import { st01Zowort009 } from "./009-zowort.ts";

describe("Zowort (ST01-009)", () => {
  it("<Blocker> lets Zowort intercept an attack targeted at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 5 },
      { play: [st01Zowort009, { card: defender, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const zowortId = p2.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(zowortId));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(zowortId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getDamage(defenderId)).toBe(0);
  });

  it("cantTargetPlayer restriction prevents direct attacks", () => {
    const engine = GundamTestEngine.create({ play: [st01Zowort009], deck: 5 }, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);

    const zowortId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.enterBattle(zowortId, "direct"), "CANNOT_TARGET_PLAYER");
  });
});
