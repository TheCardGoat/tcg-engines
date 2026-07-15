import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { arielAdventurousCollector } from "./103-ariel-adventurous-collector";

const testSong = createMockSong({
  id: "ariel-test-song",
  name: "Ariel Test Song",
  cost: 3,
  text: "A test song.",
  abilities: [],
});

const chosenCharacter = createMockCharacter({
  id: "ariel-test-chosen-character",
  name: "Chosen Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Ariel - Adventurous Collector", () => {
  describe("INSPIRING VOICE — Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.", () => {
    it("grants Evasive to the chosen character and removes it at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [testSong],
          inkwell: testSong.cost,
          play: [arielAdventurousCollector, chosenCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(arielAdventurousCollector, { targets: [chosenCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(chosenCharacter, "Evasive")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(chosenCharacter, "Evasive")).toBe(true);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(chosenCharacter, "Evasive")).toBe(false);
    });

    it("does NOT trigger when a non-song action is played", () => {
      const nonSongAction = createMockAction({
        id: "ariel-test-non-song-action",
        name: "Non Song Action",
        cost: 2,
        text: "A non-song action.",
        abilities: [],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nonSongAction],
          inkwell: nonSongAction.cost,
          play: [arielAdventurousCollector, chosenCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nonSongAction)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(0);
    });
  });
});
