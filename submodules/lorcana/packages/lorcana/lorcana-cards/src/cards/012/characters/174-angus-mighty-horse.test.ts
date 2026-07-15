import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { angusMightyHorse } from "./174-angus-mighty-horse";

const dauntlessTarget = createMockCharacter({
  id: "dauntless-target",
  name: "Dauntless Target",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Angus - Mighty Horse", () => {
  describe("DAUNTLESS - When you play this character, chosen character gains Alert this turn", () => {
    it("grants Alert to a chosen character when Angus is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [angusMightyHorse],
        inkwell: angusMightyHorse.cost,
        play: [dauntlessTarget],
      });

      expect(testEngine.asPlayerOne().playCard(angusMightyHorse)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(angusMightyHorse, {
          targets: [dauntlessTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: dauntlessTarget,
        keyword: "Alert",
      });
    });

    it("Alert granted by DAUNTLESS expires at end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [angusMightyHorse],
          inkwell: angusMightyHorse.cost,
          play: [dauntlessTarget],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(angusMightyHorse)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(angusMightyHorse, {
          targets: [dauntlessTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: dauntlessTarget,
        keyword: "Alert",
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: dauntlessTarget,
        keyword: "Alert",
      });
    });
  });
});
