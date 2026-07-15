import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04FlatMilitia077 } from "./077-flat-militia.ts";

describe("Flat (Militia) (GD04-077)", () => {
  it("<Blocker> lets Flat (Militia) intercept an attack targeted at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: defender, exhausted: true }, gd04FlatMilitia077] },
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

    expect(p2.getCardZone(blockerId)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p2.getDamage(blockerId)).toBe(3);
    expect(p2.getDamage(defenderId)).toBe(0);
    expect(p1.getDamage(attackerId)).toBe(2);
  });
});
