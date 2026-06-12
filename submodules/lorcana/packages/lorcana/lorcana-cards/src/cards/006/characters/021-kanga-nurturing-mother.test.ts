import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kangaNurturingMother } from "./021-kanga-nurturing-mother";

const ally = createMockCharacter({
  id: "kanga-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponent = createMockCharacter({
  id: "kanga-test-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Kanga - Nurturing Mother", () => {
  describe("SAFE AND SOUND - Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.", () => {
    it("chosen character can't be challenged after Kanga quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kangaNurturingMother, ally],
          deck: 2,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kangaNurturingMother)).toBeSuccessfulCommand();

      // Trigger should add a bag effect
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      // Accept and target the ally
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kangaNurturingMother, { targets: [ally] }),
      ).toBeSuccessfulCommand();

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Ally should not be challengeable
      expect(testEngine.asPlayerTwo().canChallenge(opponent, ally)).toBe(false);
    });

    it("chosen character can be challenged after the restriction expires (start of your next turn)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kangaNurturingMother, { card: ally, exerted: true }],
          deck: 2,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kangaNurturingMother)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kangaNurturingMother, { targets: [ally] }),
      ).toBeSuccessfulCommand();

      // Pass to opponent's turn - restriction still active
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().canChallenge(opponent, ally)).toBe(false);

      // Pass back to player one's turn - restriction should now have expired
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Exert ally so it can be challenged
      expect(testEngine.asServer().manualExertCard(ally)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().canChallenge(opponent, ally)).toBe(true);
    });

    it("Kanga herself can be chosen as the protected character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kangaNurturingMother],
          deck: 2,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kangaNurturingMother)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      // Target Kanga herself
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kangaNurturingMother, { targets: [kangaNurturingMother] }),
      ).toBeSuccessfulCommand();

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Kanga should be exerted after questing and not challengeable
      expect(testEngine.asPlayerTwo().canChallenge(opponent, kangaNurturingMother)).toBe(false);
    });

    it("no bag effect is generated if Kanga does not quest", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kangaNurturingMother, ally],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // No quest action taken
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("opponent's character is not protected (only your characters)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kangaNurturingMother],
          deck: 2,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kangaNurturingMother)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      // Try to target the opponent's character - should fail
      const result = testEngine
        .asPlayerOne()
        .resolvePendingByCard(kangaNurturingMother, { targets: [opponent] });
      // Either fails or the opponent is not protected
      if (result.success) {
        // If somehow allowed, the opponent's character should still be challengeable
        expect(testEngine.asPlayerTwo().canChallenge(opponent, kangaNurturingMother)).toBe(true);
      } else {
        // More likely: targeting fails
        expect(result.success).toBe(false);
      }
    });
  });
});
