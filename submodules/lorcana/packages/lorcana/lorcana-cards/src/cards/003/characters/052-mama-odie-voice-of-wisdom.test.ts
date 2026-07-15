import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mamaOdieVoiceOfWisdom } from "./052-mama-odie-voice-of-wisdom";

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

describe("Mama Odie - Voice of Wisdom", () => {
  it("should have correct base stats", () => {
    expect(mamaOdieVoiceOfWisdom.cost).toBe(6);
    expect(mamaOdieVoiceOfWisdom.strength).toBe(3);
    expect(mamaOdieVoiceOfWisdom.willpower).toBe(6);
    expect(mamaOdieVoiceOfWisdom.lore).toBe(2);
    expect(mamaOdieVoiceOfWisdom.inkable).toBe(false);
    expect(mamaOdieVoiceOfWisdom.inkType).toEqual(["amethyst"]);
    expect(mamaOdieVoiceOfWisdom.classifications).toEqual(["Dreamborn", "Ally", "Sorcerer"]);
  });

  describe("LISTEN TO YOUR MAMA NOW - Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.", () => {
    it("triggers when Mama Odie quests and moves 2 damage from chosen character to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mamaOdieVoiceOfWisdom, { card: damagedAlly, damage: 2 }],
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().quest(mamaOdieVoiceOfWisdom)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mamaOdieVoiceOfWisdom, {
          resolveOptional: true,
          targets: [damagedAlly, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(2);
    });

    it("is optional - can decline to move damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mamaOdieVoiceOfWisdom, { card: damagedAlly, damage: 2 }],
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().quest(mamaOdieVoiceOfWisdom)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mamaOdieVoiceOfWisdom, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
    });

    it("can target Mama Odie herself as the damage source", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mamaOdieVoiceOfWisdom, damage: 3 }],
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().quest(mamaOdieVoiceOfWisdom)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mamaOdieVoiceOfWisdom, {
          resolveOptional: true,
          targets: [mamaOdieVoiceOfWisdom, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(mamaOdieVoiceOfWisdom)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(2);
    });

    it("moves only available damage if character has less than 2 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mamaOdieVoiceOfWisdom, { card: damagedAlly, damage: 1 }],
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().quest(mamaOdieVoiceOfWisdom)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mamaOdieVoiceOfWisdom, {
          resolveOptional: true,
          targets: [damagedAlly, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
    });
  });
});
