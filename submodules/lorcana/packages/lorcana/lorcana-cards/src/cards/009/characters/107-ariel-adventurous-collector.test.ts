import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { arielAdventurousCollector } from "./107-ariel-adventurous-collector";
import { arielAdventurousCollectorEnchanted } from "./232-ariel-adventurous-collector-enchanted";

const song = createMockSong({
  id: "ariel-adventurous-collector-song",
  name: "Ariel Song",
  cost: 3,
  text: "A test song.",
  abilities: [],
});

const friendlyCharacter = createMockCharacter({
  id: "ariel-adventurous-collector-friendly",
  name: "Friendly Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opposingCharacter = createMockCharacter({
  id: "ariel-adventurous-collector-opponent",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const nonSongAction = createMockAction({
  id: "ariel-adventurous-collector-action",
  name: "Non-Song Action",
  cost: 3,
});

describe("Ariel - Adventurous Collector", () => {
  describe("INSPIRING VOICE - Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.", () => {
    it("grants Evasive to one of your characters when you play a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [song],
          inkwell: song.cost,
          play: [arielAdventurousCollector, friendlyCharacter],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(song)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielAdventurousCollector, {
          targets: [friendlyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(friendlyCharacter, "Evasive")).toBe(true);
      expect(testEngine.asPlayerTwo().hasKeyword(opposingCharacter, "Evasive")).toBe(false);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(friendlyCharacter, "Evasive")).toBe(false);
    });

    it("does NOT trigger when playing a non-song action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nonSongAction],
          inkwell: nonSongAction.cost,
          play: [arielAdventurousCollector, friendlyCharacter],
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

  describe("Enchanted version", () => {
    it("grants Evasive to one of your characters when you play a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [song],
          inkwell: song.cost,
          play: [arielAdventurousCollectorEnchanted, friendlyCharacter],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(song)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielAdventurousCollectorEnchanted, {
          targets: [friendlyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(friendlyCharacter, "Evasive")).toBe(true);
      expect(testEngine.asPlayerTwo().hasKeyword(opposingCharacter, "Evasive")).toBe(false);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(friendlyCharacter, "Evasive")).toBe(false);
    });
  });
});
