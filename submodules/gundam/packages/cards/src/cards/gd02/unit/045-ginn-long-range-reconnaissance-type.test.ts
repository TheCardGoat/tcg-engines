import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GinnLongRangeReconnaissanceType045 } from "./045-ginn-long-range-reconnaissance-type.ts";

describe("GINN Long-Range Reconnaissance Type (GD02-045)", () => {
  it("【Attack】does NOT draw when AP < 5 (printed AP is 1)", () => {
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd02GinnLongRangeReconnaissanceType045], deck: 10 },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.enterBattle(attackerId, defenderId));

    // Condition "AP ≥ 5" fails → no draw.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before);
  });
});
