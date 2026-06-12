import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { chipRetrievalExpert } from "./014-chip-retrieval-expert";

const highWillpowerCharacter = createMockCharacter({
  id: "chip-retrieval-high-willpower",
  name: "High Willpower Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const veryHighWillpowerCharacter = createMockCharacter({
  id: "chip-retrieval-very-high-willpower",
  name: "Very High Willpower Character",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
});

const lowWillpowerCharacter = createMockCharacter({
  id: "chip-retrieval-low-willpower",
  name: "Low Willpower Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const daleCharacter = createMockCharacter({
  id: "chip-retrieval-dale",
  name: "Dale",
  version: "Helpful Friend",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const notDaleCharacter = createMockCharacter({
  id: "chip-retrieval-not-dale",
  name: "Not Dale",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Chip - Retrieval Expert", () => {
  describe("THERE YOU ARE! - When you play this character, you may return a character card with 4 {W} or more from your discard to your hand.", () => {
    it("creates an optional bag effect when discard contains a 4+ willpower character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipRetrievalExpert],
        inkwell: chipRetrievalExpert.cost,
        discard: [highWillpowerCharacter],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(chipRetrievalExpert)).toBeSuccessfulCommand();
      expect(playerOne.getCardZone(chipRetrievalExpert)).toBe("play");
      expect(playerOne.getBagCount()).toBe(1);
    });

    it("returns a 4+ willpower character from discard to hand when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipRetrievalExpert],
        inkwell: chipRetrievalExpert.cost,
        discard: [highWillpowerCharacter],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(chipRetrievalExpert)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(chipRetrievalExpert, {
          resolveOptional: true,
          targets: [highWillpowerCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(highWillpowerCharacter)).toBe("hand");
    });

    it("returns a 6 willpower character (well over the 4 threshold)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipRetrievalExpert],
        inkwell: chipRetrievalExpert.cost,
        discard: [veryHighWillpowerCharacter],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(chipRetrievalExpert)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(chipRetrievalExpert, {
          resolveOptional: true,
          targets: [veryHighWillpowerCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(veryHighWillpowerCharacter)).toBe("hand");
    });

    it("can decline the optional trigger and leave the character in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipRetrievalExpert],
        inkwell: chipRetrievalExpert.cost,
        discard: [highWillpowerCharacter],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(chipRetrievalExpert)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(chipRetrievalExpert, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(highWillpowerCharacter)).toBe("discard");
    });

    it("does not create a bag effect when only low-willpower characters are in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipRetrievalExpert],
        inkwell: chipRetrievalExpert.cost,
        discard: [lowWillpowerCharacter],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(chipRetrievalExpert)).toBeSuccessfulCommand();

      // Only a 3 willpower character is in discard — no valid targets, so no bag effect.
      expect(playerOne.getBagCount()).toBe(0);
      expect(playerOne.getCardZone(lowWillpowerCharacter)).toBe("discard");
    });

    it("does not create a bag effect when discard is empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipRetrievalExpert],
        inkwell: chipRetrievalExpert.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(chipRetrievalExpert)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("only targets 4+ willpower characters — low-willpower cards in discard are not valid targets", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipRetrievalExpert],
        inkwell: chipRetrievalExpert.cost,
        discard: [highWillpowerCharacter, lowWillpowerCharacter],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(chipRetrievalExpert)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(chipRetrievalExpert, {
          resolveOptional: true,
          targets: [highWillpowerCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(highWillpowerCharacter)).toBe("hand");
      expect(playerOne.getCardZone(lowWillpowerCharacter)).toBe("discard");
    });
  });

  describe("FRIENDLY ASSIST - Your characters named Dale get +1 {W}.", () => {
    it("grants +1 willpower to your characters named Dale", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [chipRetrievalExpert, daleCharacter],
      });

      expect(testEngine.asPlayerOne().getCard(daleCharacter)?.willpower).toBe(
        daleCharacter.willpower + 1,
      );
    });

    it("does not grant willpower to non-Dale characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [chipRetrievalExpert, notDaleCharacter],
      });

      expect(testEngine.asPlayerOne().getCard(notDaleCharacter)?.willpower).toBe(
        notDaleCharacter.willpower,
      );
    });

    it("does not grant willpower to opposing characters named Dale", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [chipRetrievalExpert],
        },
        {
          play: [daleCharacter],
        },
      );

      expect(testEngine.asPlayerTwo().getCard(daleCharacter)?.willpower).toBe(
        daleCharacter.willpower,
      );
    });
  });

  describe("release notes ruling", () => {
    it("Friendly Assist's +1 W applies only to Dales in play, NOT to a Dale in discard — cannot return Dale-Bumbler (3 W base) via There You Are", () => {
      // Release-notes Q&A: Dale – Bumbler has 3 W. Chip's Friendly Assist
      // (+1 W to your Dales) only applies in play, not in discard.
      // Therefore, There You Are! cannot return Dale-Bumbler from discard
      // (it sees a 3-W card, not 4).
      const daleBumblerInDiscard = createMockCharacter({
        id: "chip-release-dale-bumbler",
        name: "Dale",
        version: "Bumbler",
        cost: 1,
        strength: 1,
        willpower: 3,
        lore: 1,
        classifications: ["Storyborn", "Hero"],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chipRetrievalExpert],
        inkwell: chipRetrievalExpert.cost,
        discard: [daleBumblerInDiscard],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(chipRetrievalExpert)).toBeSuccessfulCommand();

      // No valid target — only the 3-W Dale is in discard, and Friendly
      // Assist does NOT add +1 W in the discard zone.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(daleBumblerInDiscard)).toBe("discard");
    });
  });
});
