import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tinkerBellMostHelpful } from "./093-tinker-bell-most-helpful";

const pixieDustTarget = createMockCharacter({
  id: "pixie-dust-target",
  name: "Pixie Dust Target",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Tinker Bell - Most Helpful", () => {
  it("has the Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [tinkerBellMostHelpful],
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: tinkerBellMostHelpful,
      keyword: "Evasive",
    });
  });

  describe("PIXIE DUST - When you play this character, chosen character gains Evasive this turn", () => {
    it("grants Evasive to a chosen character when Tinker Bell is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tinkerBellMostHelpful],
        inkwell: tinkerBellMostHelpful.cost,
        play: [pixieDustTarget],
      });

      expect(testEngine.asPlayerOne().playCard(tinkerBellMostHelpful)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tinkerBellMostHelpful, {
          targets: [pixieDustTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: pixieDustTarget,
        keyword: "Evasive",
      });
    });

    it("Evasive granted by PIXIE DUST expires at end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellMostHelpful],
          inkwell: tinkerBellMostHelpful.cost,
          play: [pixieDustTarget],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(tinkerBellMostHelpful)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tinkerBellMostHelpful, {
          targets: [pixieDustTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: pixieDustTarget,
        keyword: "Evasive",
      });

      // End player one's turn — the "this turn" effect should expire
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: pixieDustTarget,
        keyword: "Evasive",
      });
    });

    it("can grant Evasive to Tinker Bell herself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tinkerBellMostHelpful],
        inkwell: tinkerBellMostHelpful.cost,
        play: [],
      });

      expect(testEngine.asPlayerOne().playCard(tinkerBellMostHelpful)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      // Target Tinker Bell herself
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tinkerBellMostHelpful, {
          targets: [tinkerBellMostHelpful],
        }),
      ).toBeSuccessfulCommand();

      // She already has Evasive natively, so this is a no-op but should succeed
      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: tinkerBellMostHelpful,
        keyword: "Evasive",
      });
    });
  });
});
