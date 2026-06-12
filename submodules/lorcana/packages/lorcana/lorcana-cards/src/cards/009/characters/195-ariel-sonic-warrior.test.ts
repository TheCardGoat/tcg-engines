import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { arielSonicWarrior } from "./195-ariel-sonic-warrior";

const testSong = createMockSong({
  id: "ariel-sonic-warrior-test-song",
  name: "Test Song",
  cost: 2,
  text: "A test song.",
});

const targetCharacter = createMockCharacter({
  id: "ariel-sonic-warrior-target",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 5,
});

describe("Ariel - Sonic Warrior", () => {
  describe("AMPLIFIED VOICE - Whenever you play a song, you may pay 2 ink to deal 3 damage to chosen character.", () => {
    it("deals 3 damage to a chosen character when you play a song and pay 2 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [testSong],
          inkwell: testSong.cost + 2,
          play: [arielSonicWarrior],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielSonicWarrior, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(3);
    });

    it("does not trigger when playing a non-song action", () => {
      const nonSongAction = createMockCharacter({
        id: "ariel-sonic-warrior-non-song",
        name: "Non Song Card",
        cost: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nonSongAction],
          inkwell: nonSongAction.cost + 2,
          play: [arielSonicWarrior],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(nonSongAction)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not deal damage if controller cannot pay 2 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [testSong],
          inkwell: testSong.cost,
          play: [arielSonicWarrior],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toEqual([]);

      // Cannot pay 2 ink, so no damage is dealt
      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(0);
    });
  });
});
