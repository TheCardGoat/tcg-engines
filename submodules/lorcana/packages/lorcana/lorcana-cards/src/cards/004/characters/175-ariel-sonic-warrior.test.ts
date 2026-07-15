import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { arielSonicWarrior } from "./175-ariel-sonic-warrior";

const targetCharacter = createMockCharacter({
  id: "ariel-sonic-warrior-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const toughCharacter = createMockCharacter({
  id: "ariel-sonic-warrior-tough-target",
  name: "Tough Target",
  cost: 2,
  strength: 2,
  willpower: 8,
});

const testSong = createMockSong({
  id: "ariel-sonic-warrior-test-song",
  name: "Test Song",
  cost: 1,
  text: "A test song.",
});

describe("Ariel - Sonic Warrior", () => {
  describe("AMPLIFIED VOICE - Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.", () => {
    it("deals 3 damage to a chosen character when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielSonicWarrior],
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
        testEngine.asPlayerOne().resolvePendingByCard(arielSonicWarrior, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      // 3 damage >= 3 willpower = banished
      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("discard");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielSonicWarrior],
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
        testEngine.asPlayerOne().resolvePendingByCard(arielSonicWarrior, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(targetCharacter)).toBe("play");
    });

    it("does not trigger when playing a non-song action", () => {
      const nonSongAction = createMockAction({
        id: "ariel-sonic-warrior-non-song-action",
        name: "Non Song Action",
        cost: 1,
        text: "Do nothing.",
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielSonicWarrior],
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

    it("does not trigger when opponent plays a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielSonicWarrior],
          deck: 2,
        },
        {
          hand: [testSong],
          play: [targetCharacter],
          inkwell: testSong.cost,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(testSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("can target own characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielSonicWarrior, toughCharacter],
          hand: [testSong],
          inkwell: testSong.cost + 2,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielSonicWarrior, {
          targets: [toughCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(toughCharacter)).toBe("play");
    });
  });
});
