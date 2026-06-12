import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04VictoryGundam003 } from "./003-victory-gundam.ts";

describe("Victory Gundam (GD04-003)", () => {
  it("【Attack】 draws 1 when 3+ (League Militaire) Units are in play", () => {
    const lm1 = createMockUnit({ ap: 1, hp: 1, traits: ["league militaire"] });
    const lm2 = createMockUnit({ ap: 1, hp: 1, traits: ["league militaire"] });
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      { play: [gd04VictoryGundam003, lm1, lm2], deck: 5 },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });

    expectSuccess(p1.enterBattle(attackerId, defenderId));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore + 1);
  });

  it("【Attack】 does NOT draw when fewer than 3 (League Militaire) Units are in play", () => {
    const lm1 = createMockUnit({ ap: 1, hp: 1, traits: ["league militaire"] });
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      { play: [gd04VictoryGundam003, lm1], deck: 5 },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.enterBattle(attackerId, defenderId));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
  });
});
