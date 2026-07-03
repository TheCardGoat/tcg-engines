import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { morphLittleImitator } from "./057-morph-little-imitator";
import { sulleyBooScareBuddies } from "./029-sulley-boo-scare-buddies";

const sulleyBase = createMockCharacter({
  id: "sulley-boo-scare-buddies-sulley-base",
  name: "Sulley",
  cost: 2,
});

const booBase = createMockCharacter({
  id: "sulley-boo-scare-buddies-boo-base",
  name: "Boo",
  cost: 2,
});

const banishChosenCharacter = createMockAction({
  id: "sulley-boo-scare-buddies-banish-action",
  name: "Banish Chosen Character",
  cost: 1,
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          cardTypes: ["character"],
          zones: ["play"],
        },
      },
    },
  ],
});

type ShiftTargetId = ReturnType<LorcanaMultiplayerTestEngine["findCardInstanceId"]>;

function playWithComboShift(
  testEngine: LorcanaMultiplayerTestEngine,
  primaryShiftTarget: ShiftTargetId,
  additionalShiftTargets: ShiftTargetId[] = [],
) {
  return testEngine.asPlayerOne().playCard(sulleyBooScareBuddies, {
    cost: {
      cost: "shift",
      shiftTarget: primaryShiftTarget,
      ...(additionalShiftTargets.length > 0 ? { additionalShiftTargets } : {}),
    },
  });
}

describe("Sulley & Boo - Scare Buddies", () => {
  describe("Combo Shift 4 - You may pay 4 ink to play this on top of Sulley, Boo, or one of each", () => {
    it("can combo shift onto a character named Sulley", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [sulleyBooScareBuddies],
        play: [sulleyBase],
        inkwell: 4,
      });
      const sulleyTarget = testEngine.findCardInstanceId(sulleyBase, "play", PLAYER_ONE);

      expect(playWithComboShift(testEngine, sulleyTarget)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(sulleyBooScareBuddies)).toBe("play");
      expect(testEngine.getCardsUnder(sulleyBooScareBuddies)).toHaveLength(1);
    });

    it("can combo shift onto a character named Boo", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [sulleyBooScareBuddies],
        play: [booBase],
        inkwell: 4,
      });
      const booTarget = testEngine.findCardInstanceId(booBase, "play", PLAYER_ONE);

      expect(playWithComboShift(testEngine, booTarget)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(sulleyBooScareBuddies)).toBe("play");
      expect(testEngine.getCardsUnder(sulleyBooScareBuddies)).toHaveLength(1);
    });

    it("can combo shift onto one Sulley and one Boo", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [sulleyBooScareBuddies],
        play: [sulleyBase, booBase],
        inkwell: 4,
      });
      const sulleyTarget = testEngine.findCardInstanceId(sulleyBase, "play", PLAYER_ONE);
      const booTarget = testEngine.findCardInstanceId(booBase, "play", PLAYER_ONE);

      expect(playWithComboShift(testEngine, sulleyTarget, [booTarget])).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(sulleyBooScareBuddies)).toBe("play");
      expect(testEngine.getCardsUnder(sulleyBooScareBuddies)).toHaveLength(2);
    });
  });

  describe("THE POWER OF FRIENDSHIP - When this character is banished, you may play under-character cards from discard for free", () => {
    it("may play the character cards that were under them from discard for free when banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [sulleyBooScareBuddies, banishChosenCharacter],
        play: [sulleyBase, booBase],
        inkwell: 5,
      });
      const sulleyTarget = testEngine.findCardInstanceId(sulleyBase, "play", PLAYER_ONE);
      const booTarget = testEngine.findCardInstanceId(booBase, "play", PLAYER_ONE);

      expect(playWithComboShift(testEngine, sulleyTarget, [booTarget])).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(sulleyBooScareBuddies)).toHaveLength(2);
      expect(
        testEngine.asPlayerOne().playCard(banishChosenCharacter, {
          targets: [sulleyBooScareBuddies],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(sulleyBooScareBuddies)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(sulleyBase)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(booBase)).toBe("discard");

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sulleyBooScareBuddies, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(sulleyBase)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(booBase)).toBe("play");
    });

    it("may play Morph when it was a shifted-under character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [sulleyBooScareBuddies, banishChosenCharacter],
        play: [morphLittleImitator, booBase],
        inkwell: 5,
      });
      const morphTarget = testEngine.findCardInstanceId(morphLittleImitator, "play", PLAYER_ONE);
      const booTarget = testEngine.findCardInstanceId(booBase, "play", PLAYER_ONE);

      expect(playWithComboShift(testEngine, morphTarget, [booTarget])).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(sulleyBooScareBuddies)).toHaveLength(2);
      expect(
        testEngine.asPlayerOne().playCard(banishChosenCharacter, {
          targets: [sulleyBooScareBuddies],
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sulleyBooScareBuddies, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(morphLittleImitator)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(booBase)).toBe("play");
    });
  });
});
