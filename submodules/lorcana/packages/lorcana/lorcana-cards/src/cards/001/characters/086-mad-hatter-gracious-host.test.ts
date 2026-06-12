import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { madHatterGraciousHost } from "./086-mad-hatter-gracious-host";

const attacker = createMockCharacter({
  id: "mad-hatter-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const defender = createMockCharacter({
  id: "mad-hatter-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Mad Hatter - Gracious Host", () => {
  describe("TEA PARTY: Whenever this character is challenged, you may draw a card.", () => {
    it("triggers when challenged — controller may draw a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: madHatterGraciousHost, exerted: true }],
          deck: 1,
        },
      );

      const handBefore = testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).hand;
      const deckBefore = testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).deck;

      expect(
        testEngine.asPlayerOne().challenge(attacker, madHatterGraciousHost),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(madHatterGraciousHost, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).hand).toBe(handBefore + 1);
      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).deck).toBe(deckBefore - 1);
    });

    it("is optional — controller can decline to draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: madHatterGraciousHost, exerted: true }],
          deck: 1,
        },
      );

      const handBefore = testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).hand;
      const deckBefore = testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).deck;

      expect(
        testEngine.asPlayerOne().challenge(attacker, madHatterGraciousHost),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(madHatterGraciousHost, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).hand).toBe(handBefore);
      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).deck).toBe(deckBefore);
    });

    it("works when controller has no cards in deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: madHatterGraciousHost, exerted: true }],
          deck: 0,
        },
      );

      const handBefore = testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).hand;

      expect(
        testEngine.asPlayerOne().challenge(attacker, madHatterGraciousHost),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine
            .asPlayerTwo()
            .resolvePendingByCard(madHatterGraciousHost, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).hand).toBe(handBefore);
    });
  });
});
