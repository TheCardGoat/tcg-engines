import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { blueFairyRewardingGoodDeeds } from "./036-blue-fairy-rewarding-good-deeds";

const floodbornCharacter = createMockCharacter({
  id: "blue-fairy-floodborn",
  name: "Floodborn Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Floodborn"],
});

const nonFloodbornCharacter = createMockCharacter({
  id: "blue-fairy-non-floodborn",
  name: "Non-Floodborn Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Blue Fairy - Rewarding Good Deeds", () => {
  describe("ETHEREAL GLOW - Whenever you play a Floodborn character, you may draw a card", () => {
    it("draws a card when you accept the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [{ card: floodbornCharacter }],
        inkwell: floodbornCharacter.cost,
        play: [blueFairyRewardingGoodDeeds],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(floodbornCharacter)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(blueFairyRewardingGoodDeeds, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 1,
        }),
      );
    });

    it("does not draw a card when you decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [{ card: floodbornCharacter }],
        inkwell: floodbornCharacter.cost,
        play: [blueFairyRewardingGoodDeeds],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(floodbornCharacter)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(blueFairyRewardingGoodDeeds, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 0,
          deck: 2,
        }),
      );
    });

    it("does not trigger for non-Floodborn characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [{ card: nonFloodbornCharacter }],
        inkwell: nonFloodbornCharacter.cost,
        play: [blueFairyRewardingGoodDeeds],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(nonFloodbornCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 0,
          deck: 2,
        }),
      );
    });
  });
});
