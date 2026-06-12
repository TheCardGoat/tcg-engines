import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { tinkerBellTemperamentalFairy } from "./115-tinker-bell-temperamental-fairy";

const weakOpponent = createMockCharacter({
  id: "tbtf-weak-opponent",
  name: "Weak Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const strongOpponent = createMockCharacter({
  id: "tbtf-strong-opponent",
  name: "Strong Opponent",
  cost: 4,
  strength: 4,
  willpower: 4,
});

describe("Tinker Bell - Temperamental Fairy", () => {
  it("has the Shift 3 keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tinkerBellTemperamentalFairy],
    });

    const cardModel = testEngine.getCardModel(tinkerBellTemperamentalFairy);
    expect(cardModel.hasShift()).toBe(true);
    expect(cardModel.shiftInkCost).toBe(3);
  });

  describe("HARMLESS DIVERSION — When you play this character, exert chosen opposing character with 2 {S} or less.", () => {
    it("triggers when played and exerts the chosen opposing character with 2 strength or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellTemperamentalFairy],
          inkwell: tinkerBellTemperamentalFairy.cost,
          deck: 2,
        },
        {
          play: [weakOpponent],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(tinkerBellTemperamentalFairy),
      ).toBeSuccessfulCommand();

      // HARMLESS DIVERSION should have triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve the bag effect, targeting the weak opponent
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tinkerBellTemperamentalFairy, { targets: [weakOpponent] }),
      ).toBeSuccessfulCommand();

      // The weak opponent should now be exerted
      expect(testEngine.asPlayerTwo().isExerted(weakOpponent)).toBe(true);
    });

    it("auto-resolves and does not exert when the only opposing character has more than 2 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellTemperamentalFairy],
          inkwell: tinkerBellTemperamentalFairy.cost,
          deck: 2,
        },
        {
          play: [strongOpponent],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(tinkerBellTemperamentalFairy),
      ).toBeSuccessfulCommand();

      // Tinker Bell is now in play
      expect(testEngine.asPlayerOne().getCardZone(tinkerBellTemperamentalFairy)).toBe("play");

      // Strong opponent should remain unexerted (no valid targets, trigger auto-resolves)
      expect(testEngine.asPlayerTwo().isExerted(strongOpponent)).toBe(false);
    });

    it("selects the weak opponent when both weak and strong opponents are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellTemperamentalFairy],
          inkwell: tinkerBellTemperamentalFairy.cost,
          deck: 2,
        },
        {
          play: [weakOpponent, strongOpponent],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(tinkerBellTemperamentalFairy),
      ).toBeSuccessfulCommand();

      // HARMLESS DIVERSION should have triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Target only the weak opponent (2 strength)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tinkerBellTemperamentalFairy, { targets: [weakOpponent] }),
      ).toBeSuccessfulCommand();

      // Weak opponent is exerted, strong opponent is not
      expect(testEngine.asPlayerTwo().isExerted(weakOpponent)).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(strongOpponent)).toBe(false);
    });

    it("cannot target the strong opponent when both are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellTemperamentalFairy],
          inkwell: tinkerBellTemperamentalFairy.cost,
          deck: 2,
        },
        {
          play: [weakOpponent, strongOpponent],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(tinkerBellTemperamentalFairy),
      ).toBeSuccessfulCommand();

      // HARMLESS DIVERSION triggers
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Attempting to target the strong opponent (4 strength) should fail
      const resolveResult = testEngine
        .asPlayerOne()
        .resolvePendingByCard(tinkerBellTemperamentalFairy, { targets: [strongOpponent] });
      expect(resolveResult.success).toBe(false);

      // Neither opponent should be exerted
      expect(testEngine.asPlayerTwo().isExerted(weakOpponent)).toBe(false);
      expect(testEngine.asPlayerTwo().isExerted(strongOpponent)).toBe(false);
    });
  });

  it("regression: cannot exert opposing character with more than 2 strength", () => {
    const threeStrengthOpponent = createMockCharacter({
      id: "tbtf-three-strength",
      name: "Three Strength Opponent",
      cost: 3,
      strength: 3,
      willpower: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [tinkerBellTemperamentalFairy],
        inkwell: tinkerBellTemperamentalFairy.cost,
        deck: 2,
      },
      {
        play: [threeStrengthOpponent],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(tinkerBellTemperamentalFairy)).toBeSuccessfulCommand();

    // No valid targets (3 strength > 2), trigger auto-resolves
    expect(testEngine.asPlayerTwo().isExerted(threeStrengthOpponent)).toBe(false);
  });
});
