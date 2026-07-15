import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { betaRickDom030 } from "./030-rick-dom.ts";
describe("Rick Dom (GD01-030)", () => {
  it("<Breach 2> deals 2 damage to a shield when the attacker destroys a Unit", () => {
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const shieldSeed = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [betaRickDom030] },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shieldSeed] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const rickId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(rickId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
  });
});
