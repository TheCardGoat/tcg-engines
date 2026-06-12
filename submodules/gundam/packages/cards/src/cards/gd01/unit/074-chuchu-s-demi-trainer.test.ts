import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01ChuchuSDemiTrainer074 } from "./074-chuchu-s-demi-trainer.ts";

describe("Chuchu's Demi Trainer (GD01-074)", () => {
  it("【Attack】Draw 1. Then, discard 1.", () => {
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd01ChuchuSDemiTrainer074], deck: 10, hand: [createMockUnit()] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });

    expectSuccess(p1.enterBattle(attackerId, defenderId));

    // Draw 1, discard 1 → net hand size change is 0 and deck -1.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore);
  });
});
