import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  expectPlayer,
  expectPublicLog,
} from "@tcg/gundam-engine";
import { gd04VictoryGundam003 } from "./003-victory-gundam.ts";

describe("Victory Gundam (GD04-003)", () => {
  describe("【Attack】If you have 3 or more (League Militaire) Units in play, draw 1.", () => {
    it("draws 1 when 3 or more (League Militaire) Units are in play", () => {
      const lm1 = createMockUnit({ ap: 1, hp: 1, traits: ["league militaire"] });
      const lm2 = createMockUnit({ ap: 1, hp: 1, traits: ["league militaire"] });
      const defender = createMockUnit({ ap: 1, hp: 5 });

      const engine = GundamTestEngine.create(
        { play: [gd04VictoryGundam003, lm1, lm2], deck: 5 },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = p1.getCardsInZone("deck").length;
      const handBefore = p1.getHand().length;

      p1.must.attack(gd04VictoryGundam003).into(defender);

      expectPublicLog(engine, "gundam.move.attackDeclared", {
        attackerPlayerId: PLAYER_ONE,
      });
      expectPlayer(p1)
        .toHaveDeckCount(deckBefore - 1)
        .toHaveHandCount(handBefore + 1);
    });

    it("does not draw when only 2 (League Militaire) Units are in play", () => {
      const lm1 = createMockUnit({ ap: 1, hp: 1, traits: ["league militaire"] });
      const defender = createMockUnit({ ap: 1, hp: 5 });

      const engine = GundamTestEngine.create(
        { play: [gd04VictoryGundam003, lm1], deck: 5 },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = p1.getCardsInZone("deck").length;
      const handBefore = p1.getHand().length;

      p1.must.attack(gd04VictoryGundam003).into(defender);

      expectPlayer(p1).toHaveDeckCount(deckBefore).toHaveHandCount(handBefore);
    });

    it("does not count non-(League Militaire) Units toward the threshold", () => {
      const lm1 = createMockUnit({ ap: 1, hp: 1, traits: ["league militaire"] });
      const nonLm = createMockUnit({ ap: 1, hp: 1, traits: ["earth federation"] });
      const defender = createMockUnit({ ap: 1, hp: 5 });

      const engine = GundamTestEngine.create(
        // Victory (LM) + 1 LM + 1 non-LM = only 2 LM units
        { play: [gd04VictoryGundam003, lm1, nonLm], deck: 5 },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = p1.getCardsInZone("deck").length;

      p1.must.attack(gd04VictoryGundam003).into(defender);

      expectPlayer(p1).toHaveDeckCount(deckBefore);
    });
  });
});
