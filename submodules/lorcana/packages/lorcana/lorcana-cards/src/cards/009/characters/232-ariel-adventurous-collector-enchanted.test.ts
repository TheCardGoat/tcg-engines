import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { arielAdventurousCollectorEnchanted } from "./232-ariel-adventurous-collector-enchanted";

const song = createMockSong({
  id: "ariel-enchanted-test-song",
  name: "Test Song",
  cost: 3,
  text: "A test song.",
  abilities: [],
});

const nonSongAction = createMockAction({
  id: "ariel-enchanted-test-action",
  name: "Test Action",
  cost: 3,
  text: "A non-song action.",
  abilities: [],
});

const friendlyCharacter = createMockCharacter({
  id: "ariel-enchanted-friendly",
  name: "Friendly Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opposingCharacter = createMockCharacter({
  id: "ariel-enchanted-opponent",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Ariel - Adventurous Collector Enchanted", () => {
  describe("Evasive keyword", () => {
    it("has Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielAdventurousCollectorEnchanted],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().hasKeyword(arielAdventurousCollectorEnchanted, "Evasive"),
      ).toBe(true);
    });
  });

  describe("INSPIRING VOICE - Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.", () => {
    it("grants Evasive to a chosen character when you play a song", () => {
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
    });

    it("Evasive is removed at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [song],
          inkwell: song.cost,
          play: [arielAdventurousCollectorEnchanted, friendlyCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(song)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielAdventurousCollectorEnchanted, {
          targets: [friendlyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(friendlyCharacter, "Evasive")).toBe(true);

      // Pass both turns - Evasive should persist through opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(friendlyCharacter, "Evasive")).toBe(true);

      // Start of player one's next turn - Evasive should be removed
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(friendlyCharacter, "Evasive")).toBe(false);
    });

    it("does NOT trigger when a non-song action is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nonSongAction],
          inkwell: nonSongAction.cost,
          play: [arielAdventurousCollectorEnchanted, friendlyCharacter],
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
