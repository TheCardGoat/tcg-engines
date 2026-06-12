import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { arielSonicWarriorEnchanted } from "./220-ariel-sonic-warrior-enchanted";

const targetCharacter = createMockCharacter({
  id: "ariel-sonic-warrior-enchanted-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const toughCharacter = createMockCharacter({
  id: "ariel-sonic-warrior-enchanted-tough-target",
  name: "Tough Target",
  cost: 2,
  strength: 2,
  willpower: 8,
});

const testSong = createMockSong({
  id: "ariel-sonic-warrior-enchanted-test-song",
  name: "Test Song",
  cost: 1,
  text: "A test song.",
});

describe("Ariel - Sonic Warrior (Enchanted)", () => {
  describe("AMPLIFIED VOICE - Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.", () => {
    it("deals 3 damage to a chosen character when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielSonicWarriorEnchanted],
          hand: [testSong],
          inkwell: testSong.cost + 2,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielSonicWarriorEnchanted, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("discard");
    });

    it("pays 2 ink when resolving the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielSonicWarriorEnchanted],
          hand: [testSong],
          inkwell: testSong.cost + 2,
          deck: 2,
        },
        {
          play: [toughCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielSonicWarriorEnchanted, {
          targets: [toughCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(toughCharacter)).toBe(3);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielSonicWarriorEnchanted],
          hand: [testSong],
          inkwell: testSong.cost + 2,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielSonicWarriorEnchanted, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("play");
    });

    it("does not trigger when playing a non-song action", () => {
      const nonSongAction = createMockAction({
        id: "ariel-sonic-warrior-enchanted-non-song-action",
        name: "Non Song Action",
        cost: 1,
        text: "Do nothing.",
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielSonicWarriorEnchanted],
          hand: [nonSongAction],
          inkwell: nonSongAction.cost + 2,
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nonSongAction)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
