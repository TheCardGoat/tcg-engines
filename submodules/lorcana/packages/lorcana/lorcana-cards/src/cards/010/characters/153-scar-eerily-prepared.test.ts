import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { scarEerilyPrepared } from "./153-scar-eerily-prepared";

const opponentCharacter = createMockCharacter({
  id: "scar-test-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 5,
  willpower: 10,
});

describe("Scar - Eerily Prepared", () => {
  describe("Boost 2", () => {
    it("has Boost keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scarEerilyPrepared],
      });

      expect(testEngine.hasKeyword(scarEerilyPrepared, "Boost")).toBe(true);
    });

    it("can activate Boost 2 to put top card of deck under Scar", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 2,
        deck: 3,
        play: [scarEerilyPrepared],
      });

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(
        testEngine.asPlayerOne().activateAbility(scarEerilyPrepared, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(deckAfter).toBe(deckBefore - 1);
      expect(testEngine.getCardsUnder(scarEerilyPrepared)).toHaveLength(1);
    });

    it("can only use Boost once per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 4,
        deck: 5,
        play: [scarEerilyPrepared],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(scarEerilyPrepared, { ability: "Boost" }),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(scarEerilyPrepared)).toHaveLength(1);

      const result = testEngine
        .asPlayerOne()
        .activateAbility(scarEerilyPrepared, { ability: "Boost" });
      expect(result.success).toBe(false);
      expect(testEngine.getCardsUnder(scarEerilyPrepared)).toHaveLength(1);
    });
  });

  describe("SURVIVAL OF THE FITTEST - Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn", () => {
    it("gives -5 strength to chosen opposing character when a card is put under Scar via Boost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 2,
          deck: 3,
          play: [scarEerilyPrepared],
        },
        {
          play: [opponentCharacter],
        },
      );

      const opponentStrengthBefore = testEngine.asPlayerTwo().getCard(opponentCharacter).strength;
      expect(opponentStrengthBefore).toBe(5);

      expect(
        testEngine.asPlayerOne().activateAbility(scarEerilyPrepared, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(scarEerilyPrepared)).toHaveLength(1);
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scarEerilyPrepared, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      const opponentStrengthAfter = testEngine.asPlayerTwo().getCard(opponentCharacter).strength;
      expect(opponentStrengthAfter).toBe(0);
    });

    it("can choose a different opposing character", () => {
      const anotherOpponentCharacter = createMockCharacter({
        id: "scar-test-another-opponent",
        name: "Another Opponent Character",
        cost: 3,
        strength: 8,
        willpower: 10,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 2,
          deck: 3,
          play: [scarEerilyPrepared],
        },
        {
          play: [opponentCharacter, anotherOpponentCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(scarEerilyPrepared, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(scarEerilyPrepared)).toHaveLength(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scarEerilyPrepared, { targets: [anotherOpponentCharacter] }),
      ).toBeSuccessfulCommand();

      const targetStrength = testEngine.asPlayerTwo().getCard(anotherOpponentCharacter).strength;
      const otherStrength = testEngine.asPlayerTwo().getCard(opponentCharacter).strength;

      expect(targetStrength).toBe(3);
      expect(otherStrength).toBe(5);
    });

    it("effect lasts only this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 2,
          deck: 3,
          play: [scarEerilyPrepared],
        },
        {
          play: [opponentCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(scarEerilyPrepared, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scarEerilyPrepared, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(opponentCharacter).strength).toBe(0);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(opponentCharacter).strength).toBe(5);
    });

    it("reduces strength to negative if opponent is weak enough", () => {
      const weakOpponentCharacter = createMockCharacter({
        id: "scar-test-weak-opponent",
        name: "Weak Opponent Character",
        cost: 1,
        strength: 2,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 2,
          deck: 3,
          play: [scarEerilyPrepared],
        },
        {
          play: [weakOpponentCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(scarEerilyPrepared, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scarEerilyPrepared, { targets: [weakOpponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(weakOpponentCharacter).strength).toBe(-3);
    });
  });
});
