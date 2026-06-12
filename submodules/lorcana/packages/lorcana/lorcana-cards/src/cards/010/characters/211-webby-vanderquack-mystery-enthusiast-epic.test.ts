import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { webbyVanderquackMysteryEnthusiastEpic } from "./211-webby-vanderquack-mystery-enthusiast-epic";

const targetCharacter = createMockCharacter({
  id: "webby-epic-test-target",
  name: "Target Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Webby Vanderquack - Mystery Enthusiast", () => {
  describe("CONTAGIOUS ENERGY - When you play this character, chosen character gets +1 {S} this turn", () => {
    it("gives chosen character +1 strength this turn when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [webbyVanderquackMysteryEnthusiastEpic],
          inkwell: webbyVanderquackMysteryEnthusiastEpic.cost,
          play: [targetCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(3);

      // Play Webby -- her triggered ability goes to the bag
      expect(
        testEngine.asPlayerOne().playCard(webbyVanderquackMysteryEnthusiastEpic),
      ).toBeSuccessfulCommand();

      // Resolve the triggered ability by choosing a target
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(webbyVanderquackMysteryEnthusiastEpic, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(4);
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [webbyVanderquackMysteryEnthusiastEpic],
          inkwell: webbyVanderquackMysteryEnthusiastEpic.cost,
          play: [targetCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(webbyVanderquackMysteryEnthusiastEpic),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(webbyVanderquackMysteryEnthusiastEpic, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(4);

      // Pass turn: bonus should expire
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(3);
    });

    it("can target herself for the +1 strength bonus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [webbyVanderquackMysteryEnthusiastEpic],
          inkwell: webbyVanderquackMysteryEnthusiastEpic.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(webbyVanderquackMysteryEnthusiastEpic),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(webbyVanderquackMysteryEnthusiastEpic, {
          targets: [webbyVanderquackMysteryEnthusiastEpic],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(webbyVanderquackMysteryEnthusiastEpic)).toBe(
        2,
      );

      // Pass turn: bonus should expire
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(webbyVanderquackMysteryEnthusiastEpic)).toBe(
        1,
      );
    });

    it("can target opponent's character for the +1 strength bonus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [webbyVanderquackMysteryEnthusiastEpic],
          inkwell: webbyVanderquackMysteryEnthusiastEpic.cost,
          deck: 5,
        },
        {
          play: [targetCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(3);

      expect(
        testEngine.asPlayerOne().playCard(webbyVanderquackMysteryEnthusiastEpic),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(webbyVanderquackMysteryEnthusiastEpic, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(4);
    });
  });
});
