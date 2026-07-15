import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { vanellopeVonSchweetzSugarRushPrincess } from "./019-vanellope-von-schweetz-sugar-rush-princess";
import { vanellopeVonSchweetzSugarRushChamp } from "./006-vanellope-von-schweetz-sugar-rush-champ";

const opponentCharacter1 = createMockCharacter({
  id: "vanellope-princess-opponent-1",
  name: "Opponent Character 1",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
});

const opponentCharacter2 = createMockCharacter({
  id: "vanellope-princess-opponent-2",
  name: "Opponent Character 2",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const anotherPrincess = createMockCharacter({
  id: "vanellope-princess-another-princess",
  name: "Another Princess",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Princess"],
});

const nonPrincess = createMockCharacter({
  id: "vanellope-princess-non-princess",
  name: "Non Princess",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Vanellope von Schweetz - Sugar Rush Princess", () => {
  it("has Shift 2 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [vanellopeVonSchweetzSugarRushPrincess],
    });

    expect(testEngine.hasKeyword(vanellopeVonSchweetzSugarRushPrincess, "Shift")).toBe(true);
  });

  it("can be shifted onto another Vanellope character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [vanellopeVonSchweetzSugarRushPrincess],
      play: [vanellopeVonSchweetzSugarRushChamp],
      inkwell: 2,
    });

    const shiftTarget = testEngine.findCardInstanceId(
      vanellopeVonSchweetzSugarRushChamp,
      "play",
      "player_one",
    );

    expect(
      testEngine.asPlayerOne().playCard(vanellopeVonSchweetzSugarRushPrincess, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(vanellopeVonSchweetzSugarRushPrincess)).toBe(
      "play",
    );
  });

  describe("I HEREBY DECREE - Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.", () => {
    it("triggers when another Princess character is played and reduces all opposing characters' strength by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanellopeVonSchweetzSugarRushPrincess],
          hand: [anotherPrincess],
          inkwell: anotherPrincess.cost,
        },
        {
          play: [opponentCharacter1, opponentCharacter2],
        },
      );

      const strengthBefore1 = testEngine.asPlayerTwo().getCardStrength(opponentCharacter1);
      const strengthBefore2 = testEngine.asPlayerTwo().getCardStrength(opponentCharacter2);

      expect(testEngine.asPlayerOne().playCard(anotherPrincess)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter1)).toBe(
        strengthBefore1 - 1,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter2)).toBe(
        strengthBefore2 - 1,
      );
    });

    it("strength reduction expires at the start of the next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanellopeVonSchweetzSugarRushPrincess],
          hand: [anotherPrincess],
          inkwell: anotherPrincess.cost,
        },
        {
          play: [opponentCharacter1],
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opponentCharacter1);

      expect(testEngine.asPlayerOne().playCard(anotherPrincess)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter1)).toBe(strengthBefore - 1);

      // Effect persists during opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter1)).toBe(strengthBefore - 1);

      // Effect expires at start of player one's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter1)).toBe(strengthBefore);
    });

    it("does not trigger when a non-Princess character is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanellopeVonSchweetzSugarRushPrincess],
          hand: [nonPrincess],
          inkwell: nonPrincess.cost,
        },
        {
          play: [opponentCharacter1],
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opponentCharacter1);

      expect(testEngine.asPlayerOne().playCard(nonPrincess)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter1)).toBe(strengthBefore);
    });

    it("does not trigger when Vanellope herself is played (only triggers for another Princess)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [vanellopeVonSchweetzSugarRushPrincess],
          inkwell: vanellopeVonSchweetzSugarRushPrincess.cost,
        },
        {
          play: [opponentCharacter1],
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opponentCharacter1);

      expect(
        testEngine.asPlayerOne().playCard(vanellopeVonSchweetzSugarRushPrincess),
      ).toBeSuccessfulCommand();

      // Vanellope is a Princess but "another" means it shouldn't trigger on itself
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter1)).toBe(strengthBefore);
    });

    it("triggers when another copy of Vanellope Sugar Rush Princess is played while one is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanellopeVonSchweetzSugarRushPrincess],
          hand: [vanellopeVonSchweetzSugarRushChamp],
          inkwell: vanellopeVonSchweetzSugarRushChamp.cost,
        },
        {
          play: [opponentCharacter1],
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opponentCharacter1);

      expect(
        testEngine.asPlayerOne().playCard(vanellopeVonSchweetzSugarRushChamp),
      ).toBeSuccessfulCommand();

      // Champ is a Princess - should trigger the decree
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter1)).toBe(strengthBefore - 1);
    });
  });
});
