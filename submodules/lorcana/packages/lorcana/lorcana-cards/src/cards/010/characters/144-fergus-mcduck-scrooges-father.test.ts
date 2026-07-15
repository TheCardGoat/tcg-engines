import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fergusMcduckScroogesFather } from "./144-fergus-mcduck-scrooges-father";

const wardTarget = createMockCharacter({
  id: "fergus-test-target",
  name: "Ward Target",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Fergus McDuck - Scrooge's Father", () => {
  describe("TOUGHEN UP - When you play this character, chosen character of yours gains Ward until the start of your next turn.", () => {
    it("grants Ward to the chosen character after playing Fergus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: fergusMcduckScroogesFather.cost,
          hand: [fergusMcduckScroogesFather],
          play: [wardTarget],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(fergusMcduckScroogesFather)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fergusMcduckScroogesFather, {
          resolveOptional: true,
          targets: [wardTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(true);
    });

    it("Ward expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: fergusMcduckScroogesFather.cost,
          hand: [fergusMcduckScroogesFather],
          play: [wardTarget],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(fergusMcduckScroogesFather)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fergusMcduckScroogesFather, {
          resolveOptional: true,
          targets: [wardTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(true);

      // Player one passes turn — Ward should still be active during opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(true);

      // Opponent passes turn — Ward should expire at start of player one's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(false);
    });
  });
});
