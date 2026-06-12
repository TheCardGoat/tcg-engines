import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectAttackRedirectedTo,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { st02Tragos009 } from "./009-tragos.ts";

describe("Tragos (ST02-009)", () => {
  it("declares the <Blocker> keyword in card data", () => {
    expect(st02Tragos009.keywordEffects?.some((k) => k.keyword === "Blocker")).toBe(true);
  });

  it("<Blocker> lets Tragos intercept an attack targeted at another friendly Unit", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [defender, st02Tragos009] },
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
