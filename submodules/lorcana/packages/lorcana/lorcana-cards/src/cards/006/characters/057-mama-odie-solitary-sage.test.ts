import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { mamaOdieSolitarySage } from "./057-mama-odie-solitary-sage";

const song = createMockSong({
  id: "mama-odie-test-song",
  name: "Test Song",
  cost: 3,
  text: "A test song.",
  abilities: [],
});

const damagedAlly = createMockCharacter({
  id: "mama-odie-test-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  willpower: 5,
});

const opposingCharacter = createMockCharacter({
  id: "mama-odie-test-opposing",
  name: "Opposing Character",
  cost: 2,
  willpower: 5,
});

const nonSongAction = createMockAction({
  id: "mama-odie-test-action",
  name: "Non-Song Action",
  cost: 3,
});

describe("Mama Odie - Solitary Sage", () => {
  it("should have correct base stats", () => {
    expect(mamaOdieSolitarySage.cost).toBe(5);
    expect(mamaOdieSolitarySage.strength).toBe(4);
    expect(mamaOdieSolitarySage.willpower).toBe(5);
    expect(mamaOdieSolitarySage.lore).toBe(1);
    expect(mamaOdieSolitarySage.inkable).toBe(false);
    expect(mamaOdieSolitarySage.inkType).toEqual(["amethyst"]);
    expect(mamaOdieSolitarySage.classifications).toEqual(["Storyborn", "Ally", "Sorcerer"]);
  });

  describe("I HAVE TO DO EVERYTHING AROUND HERE - Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.", () => {
    it("triggers when you play a song and moves up to 2 damage from chosen character to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mamaOdieSolitarySage, { card: damagedAlly, damage: 3 }],
          hand: [song],
          inkwell: song.cost,
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(song)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mamaOdieSolitarySage, {
          resolveOptional: true,
          targets: [damagedAlly, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(2);
    });

    it("is optional - can decline to move damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mamaOdieSolitarySage, { card: damagedAlly, damage: 3 }],
          hand: [song],
          inkwell: song.cost,
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(song)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mamaOdieSolitarySage, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(3);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
    });

    it("can move less than 2 damage when source has less damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mamaOdieSolitarySage, { card: damagedAlly, damage: 1 }],
          hand: [song],
          inkwell: song.cost,
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(song)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mamaOdieSolitarySage, {
          resolveOptional: true,
          targets: [damagedAlly, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
    });

    it("can target Mama Odie herself as the damage source", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mamaOdieSolitarySage, damage: 2 }],
          hand: [song],
          inkwell: song.cost,
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(song)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mamaOdieSolitarySage, {
          resolveOptional: true,
          targets: [mamaOdieSolitarySage, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(mamaOdieSolitarySage)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(2);
    });

    it("does NOT trigger when playing a non-song action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mamaOdieSolitarySage, { card: damagedAlly, damage: 3 }],
          hand: [nonSongAction],
          inkwell: nonSongAction.cost,
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nonSongAction)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(3);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
    });

    it("does NOT trigger when opponent plays a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mamaOdieSolitarySage, { card: damagedAlly, damage: 3 }],
          deck: 2,
        },
        {
          hand: [song],
          inkwell: song.cost,
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(song)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(3);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
    });
  });
});
