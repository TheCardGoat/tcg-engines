import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { docTakingNotes } from "./040-doc-taking-notes";

const otherSevenDwarfInPlay = createMockCharacter({
  id: "doc-other-seven-dwarf",
  name: "Grumpy",
  version: "Bad-Tempered",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
});

const princessInPlay = createMockCharacter({
  id: "doc-princess",
  name: "Snow White",
  version: "Fair-Hearted",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const nonQualifyingCharacter = createMockCharacter({
  id: "doc-non-qualifying",
  name: "Generic Hero",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Doc - Taking Notes", () => {
  describe("SHARE KNOWLEDGE - When you play this character, if you have another Seven Dwarfs character or a Princess character in play, draw a card.", () => {
    it("draws a card when played with another Seven Dwarfs character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [docTakingNotes],
        inkwell: docTakingNotes.cost,
        play: [otherSevenDwarfInPlay],
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handBefore = playerOne.getZonesCardCount("player_one").hand;

      expect(playerOne.playCard(docTakingNotes)).toBeSuccessfulCommand();

      const handAfter = playerOne.getZonesCardCount("player_one").hand;
      // Played 1 card (-1) and drew 1 card (+1) = net 0 change
      expect(handAfter).toBe(handBefore);
    });

    it("draws a card when played with a Princess character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [docTakingNotes],
        inkwell: docTakingNotes.cost,
        play: [princessInPlay],
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handBefore = playerOne.getZonesCardCount("player_one").hand;

      expect(playerOne.playCard(docTakingNotes)).toBeSuccessfulCommand();

      const handAfter = playerOne.getZonesCardCount("player_one").hand;
      // Played 1 card (-1) and drew 1 card (+1) = net 0 change
      expect(handAfter).toBe(handBefore);
    });

    it("does not draw a card when no other Seven Dwarfs or Princess character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [docTakingNotes],
        inkwell: docTakingNotes.cost,
        play: [nonQualifyingCharacter],
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handBefore = playerOne.getZonesCardCount("player_one").hand;

      expect(playerOne.playCard(docTakingNotes)).toBeSuccessfulCommand();

      const handAfter = playerOne.getZonesCardCount("player_one").hand;
      // Played 1 card (-1) and drew 0 cards = net -1
      expect(handAfter).toBe(handBefore - 1);
    });

    it("does not draw a card when played alone (Doc himself does not satisfy the 'another Seven Dwarfs' condition)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [docTakingNotes],
        inkwell: docTakingNotes.cost,
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();
      const handBefore = playerOne.getZonesCardCount("player_one").hand;

      expect(playerOne.playCard(docTakingNotes)).toBeSuccessfulCommand();

      const handAfter = playerOne.getZonesCardCount("player_one").hand;
      // Played 1 card (-1) and drew 0 cards = net -1
      expect(handAfter).toBe(handBefore - 1);
    });
  });
});
