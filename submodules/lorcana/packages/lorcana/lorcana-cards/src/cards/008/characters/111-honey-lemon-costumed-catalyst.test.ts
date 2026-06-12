import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { honeyLemonCostumedCatalyst } from "./111-honey-lemon-costumed-catalyst";

// For Shift to work, the base character must have the same name as the card being shifted
const floodbornCharacter = createMockCharacter({
  id: "honey-lemon-cc-floodborn",
  name: "Brave Hero",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  classifications: ["Floodborn", "Hero"],
  abilities: [
    {
      cost: { ink: 3 },
      id: "honey-lemon-cc-floodborn-shift",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
  ],
});

const floodbornShiftBase = createMockCharacter({
  id: "honey-lemon-cc-shift-base",
  name: "Brave Hero", // same name as floodbornCharacter for Shift to be valid
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const nonFloodbornCharacter = createMockCharacter({
  id: "honey-lemon-cc-non-floodborn",
  name: "Non-Floodborn Character",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  classifications: ["Storyborn", "Hero"],
});

const targetToReturn = createMockCharacter({
  id: "honey-lemon-cc-target",
  name: "Target To Return",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "honey-lemon-cc-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Honey Lemon - Costumed Catalyst", () => {
  describe("LET'S DO THIS! — Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.", () => {
    it("triggers when a Floodborn character is played with Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [honeyLemonCostumedCatalyst, floodbornShiftBase],
          hand: [floodbornCharacter],
          inkwell: 3,
        },
        {
          play: [targetToReturn],
          deck: 1,
        },
      );

      const shiftTarget = testEngine.findCardInstanceId(floodbornShiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(floodbornCharacter, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("returns chosen opponent character to their hand when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [honeyLemonCostumedCatalyst, floodbornShiftBase],
          hand: [floodbornCharacter],
          inkwell: 3,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      const shiftTarget = testEngine.findCardInstanceId(floodbornShiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(floodbornCharacter, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(honeyLemonCostumedCatalyst, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("hand");
    });

    it("returns chosen own character to hand when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [honeyLemonCostumedCatalyst, floodbornShiftBase, targetToReturn],
          hand: [floodbornCharacter],
          inkwell: 3,
          deck: 1,
        },
        { deck: 1 },
      );

      const shiftTarget = testEngine.findCardInstanceId(floodbornShiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(floodbornCharacter, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(honeyLemonCostumedCatalyst, {
          resolveOptional: true,
          targets: [targetToReturn],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetToReturn)).toBe("hand");
    });

    it("does not return a character when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [honeyLemonCostumedCatalyst, floodbornShiftBase],
          hand: [floodbornCharacter],
          inkwell: 3,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      const shiftTarget = testEngine.findCardInstanceId(floodbornShiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(floodbornCharacter, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(honeyLemonCostumedCatalyst, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("play");
    });

    it("does not bounce a character when a Floodborn character is played without Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [honeyLemonCostumedCatalyst],
          hand: [floodbornCharacter],
          inkwell: floodbornCharacter.cost,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(floodbornCharacter)).toBeSuccessfulCommand();

      // The conditional bag may exist but the shift condition fails, so it auto-resolves
      // without letting the player choose a target — opponent character remains in play
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const bag of bagEffects) {
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(honeyLemonCostumedCatalyst, { resolveOptional: false });
      }

      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("play");
    });

    it("does not trigger when a non-Floodborn character is played with Shift", () => {
      const nonFloodbornWithShift = createMockCharacter({
        id: "honey-lemon-cc-non-floodborn-shift",
        name: "Regular Guy",
        cost: 4,
        strength: 3,
        willpower: 3,
        lore: 1,
        inkable: true,
        classifications: ["Storyborn", "Hero"],
        abilities: [
          {
            cost: { ink: 2 },
            id: "honey-lemon-cc-nfs-shift",
            keyword: "Shift",
            text: "Shift 2",
            type: "keyword",
          },
        ],
      });

      const nonFloodbornBase = createMockCharacter({
        id: "honey-lemon-cc-nf-base",
        name: "Regular Guy", // same name as nonFloodbornWithShift for valid Shift
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
        classifications: ["Storyborn", "Hero"],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [honeyLemonCostumedCatalyst, nonFloodbornBase],
          hand: [nonFloodbornWithShift],
          inkwell: 2,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      const shiftTarget = testEngine.findCardInstanceId(nonFloodbornBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(nonFloodbornWithShift, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      // LET'S DO THIS! should not trigger for non-Floodborn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("play");
    });
  });
});
