import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { st02Aries008 } from "./008-aries.ts";

describe("Aries (ST02-008)", () => {
  it("<Blocker> lets Aries intercept an attack targeted at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: defender, exhausted: true }, st02Aries008] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(blockerId));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(blockerId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getDamage(defenderId)).toBe(0);
  });
});
