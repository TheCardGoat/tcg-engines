import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { st05GrazeCommanderType008 } from "./008-graze-commander-type.ts";

describe("Graze Commander Type (ST05-008)", () => {
  it("<Blocker> lets Graze Commander Type intercept an attack targeted at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: defender, exhausted: true }, st05GrazeCommanderType008] },
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

    expect(p2.getDamage(blockerId)).toBe(1);
    expect(p2.getDamage(defenderId)).toBe(0);
  });
});
