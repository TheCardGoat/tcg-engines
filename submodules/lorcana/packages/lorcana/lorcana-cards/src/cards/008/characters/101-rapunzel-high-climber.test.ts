import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rapunzelHighClimber } from "./101-rapunzel-high-climber";

const opposingCharacter = createMockCharacter({
  id: "rapunzel-high-climber-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Rapunzel - High Climber", () => {
  it("has Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelHighClimber],
    });

    expect(testEngine.asPlayerOne().getCardByInstance(rapunzelHighClimber).keywords).toEqual(
      expect.arrayContaining(["Evasive"]),
    );
  });

  describe("WRAPPED UP — Whenever this character quests, chosen opposing character can't quest during their next turn.", () => {
    it("applies cant-quest restriction to chosen opposing character when Rapunzel quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rapunzelHighClimber],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(rapunzelHighClimber)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rapunzelHighClimber, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(opposingCharacter, "cant-quest")).toBe(true);
    });

    it("chosen opposing character cannot quest during their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rapunzelHighClimber],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(rapunzelHighClimber)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rapunzelHighClimber, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opposing character cannot quest during their turn
      expect(testEngine.asPlayerTwo().quest(opposingCharacter)).not.toBeSuccessfulCommand();
    });

    it("restriction expires after the opposing player's turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rapunzelHighClimber],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(rapunzelHighClimber)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rapunzelHighClimber, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // After both players have passed, restriction should be gone
      expect(testEngine.hasRestriction(opposingCharacter, "cant-quest")).toBe(false);
    });

    it("Rapunzel herself is not restricted from questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rapunzelHighClimber],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(rapunzelHighClimber)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rapunzelHighClimber, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Rapunzel should not have a cant-quest restriction
      expect(testEngine.hasRestriction(rapunzelHighClimber, "cant-quest")).toBe(false);
    });
  });
});
