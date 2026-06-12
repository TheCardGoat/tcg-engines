import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lefouInstigator } from "./112-lefou-instigator";

const exertedCharacter = createMockCharacter({
  id: "lefou-instigator-exerted-char",
  name: "Exerted Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "lefou-instigator-opponent-char",
  name: "Opponent Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("LeFou - Instigator", () => {
  describe("FAN THE FLAMES — When you play this character, ready chosen character. They can't quest for the rest of this turn.", () => {
    it("readies a chosen exerted character when LeFou is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lefouInstigator],
          inkwell: lefouInstigator.cost,
          play: [{ card: exertedCharacter, exerted: true }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCard(exertedCharacter).exerted).toBe(true);

      expect(testEngine.asPlayerOne().playCard(lefouInstigator)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(lefouInstigator, { targets: [exertedCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(exertedCharacter).exerted).toBe(false);
    });

    it("applies cant-quest restriction to the chosen character for the rest of this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lefouInstigator],
          inkwell: lefouInstigator.cost,
          play: [{ card: exertedCharacter, exerted: true }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(lefouInstigator)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(lefouInstigator, { targets: [exertedCharacter] }),
      ).toBeSuccessfulCommand();

      // The readied character cannot quest this turn
      expect(testEngine.asPlayerOne().getCard(exertedCharacter).hasQuestRestriction).toBe(true);
    });

    it("quest restriction is lifted after the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lefouInstigator],
          inkwell: lefouInstigator.cost,
          play: [{ card: exertedCharacter, exerted: true }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(lefouInstigator)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(lefouInstigator, { targets: [exertedCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(exertedCharacter).hasQuestRestriction).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(exertedCharacter).hasQuestRestriction).toBe(false);
    });

    it("can target an opponent's character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lefouInstigator],
          inkwell: lefouInstigator.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(lefouInstigator)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(lefouInstigator, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(opponentCharacter).exerted).toBe(false);
    });
  });
});
