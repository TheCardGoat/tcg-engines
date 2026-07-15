import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { louisEndearingAlligator } from "./095-louis-endearing-alligator";

const opposingCharacter = createMockCharacter({
  id: "louis-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Louis - Endearing Alligator", () => {
  describe("SENSITIVE SOUL — This character enters play exerted.", () => {
    it("enters play exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [louisEndearingAlligator],
        inkwell: louisEndearingAlligator.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(louisEndearingAlligator)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(louisEndearingAlligator)).toBe(true);
    });
  });

  describe("FRIENDLIER THAN HE LOOKS — When you play this character, chosen opposing character gains Reckless during their next turn.", () => {
    it("chosen opposing character gains Reckless during their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: louisEndearingAlligator.cost,
          hand: [louisEndearingAlligator],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(louisEndearingAlligator)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0];
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(louisEndearingAlligator, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);

      expect(testEngine.asServer().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);
    });

    it("Reckless is removed after the opponent's turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: louisEndearingAlligator.cost,
          hand: [louisEndearingAlligator],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      testEngine.asPlayerOne().playCard(louisEndearingAlligator);
      testEngine.asPlayerOne().resolvePendingByCard(louisEndearingAlligator, {
        targets: [opposingCharacter],
      });

      expect(testEngine.asServer().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);

      expect(
        testEngine.asPlayerTwo().challenge(opposingCharacter, louisEndearingAlligator),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);
    });

    it("ability is optional and can be declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: louisEndearingAlligator.cost,
          hand: [louisEndearingAlligator],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(louisEndearingAlligator)).toBeSuccessfulCommand();

      testEngine
        .asPlayerOne()
        .resolvePendingByCard(louisEndearingAlligator, { resolveOptional: false });

      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);

      expect(testEngine.asServer().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);
    });
  });

  it("regression: Reckless does not persist beyond the opponent's next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: louisEndearingAlligator.cost,
        hand: [louisEndearingAlligator],
        deck: 2,
      },
      {
        play: [opposingCharacter],
        deck: 5,
      },
    );

    testEngine.asPlayerOne().playCard(louisEndearingAlligator);
    testEngine.asPlayerOne().resolvePendingByCard(louisEndearingAlligator, {
      targets: [opposingCharacter],
    });

    // P1 passes -> P2's turn starts, Reckless should be active
    expect(testEngine.asServer().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);

    // P2 challenges (satisfying Reckless) then passes
    expect(
      testEngine.asPlayerTwo().challenge(opposingCharacter, louisEndearingAlligator),
    ).toBeSuccessfulCommand();
    expect(testEngine.asServer().passTurn()).toBeSuccessfulCommand();

    // P1's turn -> P2's turn again: Reckless should be gone
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);
  });
});
