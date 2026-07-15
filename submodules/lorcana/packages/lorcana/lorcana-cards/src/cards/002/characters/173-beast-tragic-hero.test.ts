import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { beastTragicHero } from "./173-beast-tragic-hero";

const beastHunter = createMockCharacter({
  id: "beast-tragic-hero-hunter",
  name: "Beast Hunter",
  cost: 4,
  strength: 5,
  willpower: 5,
});

describe("Beast - Tragic Hero", () => {
  describe("IT'S BETTER THIS WAY - At start of turn: no damage = draw; otherwise +4 Strength", () => {
    it("draws a card at the start of your turn when Beast has no damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [beastTragicHero], deck: 3 },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      const zonesBeforeResolvingTrigger = testEngine.asPlayerOne().getZonesCardCount();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(beastTragicHero),
      ).toBeSuccessfulCommand();

      const zones = testEngine.asPlayerOne().getZonesCardCount();
      expect(zones.deck).toBe(zonesBeforeResolvingTrigger.deck - 2);
      expect(zones.hand).toBe(zonesBeforeResolvingTrigger.hand + 2);
      expect(testEngine.asPlayerOne().getCardStrength(beastTragicHero)).toBe(
        beastTragicHero.strength,
      );
    });

    it("gets +4 Strength instead of drawing when Beast is damaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: beastTragicHero, damage: 1 }], deck: 3 },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      const zonesBeforeResolvingTrigger = testEngine.asPlayerOne().getZonesCardCount();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(beastTragicHero),
      ).toBeSuccessfulCommand();

      const zones = testEngine.asPlayerOne().getZonesCardCount();
      expect(zones.deck).toBe(zonesBeforeResolvingTrigger.deck - 1);
      expect(zones.hand).toBe(zonesBeforeResolvingTrigger.hand + 1);
      expect(testEngine.asPlayerOne().getCardStrength(beastTragicHero)).toBe(
        beastTragicHero.strength + 4,
      );
    });

    it("does not trigger once Beast has already been banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [beastHunter], deck: 2 },
        { play: [{ card: beastTragicHero, exerted: true }], deck: 3 },
      );
      const zonesBefore = testEngine.asPlayerTwo().getZonesCardCount();

      expect(
        testEngine.asPlayerOne().challenge(beastHunter, beastTragicHero),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(beastTragicHero)).toBe("discard");

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const zones = testEngine.asPlayerTwo().getZonesCardCount();
      expect(zones.deck).toBe(zonesBefore.deck - 1);
      expect(zones.hand).toBe(zonesBefore.hand + 1);
      expect(testEngine.asPlayerTwo().getBagEffects()).toHaveLength(0);
    });
  });
});
