import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectAttackRedirectedTo,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04FlatMilitia077 } from "./077-flat-militia.ts";

describe("Flat (Militia) (GD04-077)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04FlatMilitia077.keywordEffects.map((effect) => effect.keyword)).toEqual(["Blocker"]);
  });

  it("<Blocker> lets Flat (Militia) intercept an attack targeted at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [defender, gd04FlatMilitia077] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(blockerId));

    expectAttackRedirectedTo(engine, blockerId);
  });
});
