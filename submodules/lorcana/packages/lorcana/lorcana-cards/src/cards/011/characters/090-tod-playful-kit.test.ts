import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { todPlayfulKit } from "./090-tod-playful-kit";

const allyCharacter = createMockCharacter({
  id: "tod-playful-kit-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opponentCharacter = createMockCharacter({
  id: "tod-playful-kit-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Tod - Playful Kit", () => {
  describe("LOOK AT THIS! - Whenever this character quests, choose one: gain 1 lore, or chosen character gains Evasive until next turn", () => {
    it("should trigger when Tod quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [todPlayfulKit],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(todPlayfulKit)).toBeSuccessfulCommand();

      // LOOK AT THIS! should trigger and be on the stack
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
    });

    it("should allow choosing to gain 1 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [todPlayfulKit],
        deck: 5,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(todPlayfulKit)).toBeSuccessfulCommand();

      // Choose lore gain (mode 0 / choiceIndex 0)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(todPlayfulKit, { choiceIndex: 0 }),
        ).toBeSuccessfulCommand();
      }

      // Should gain 1 lore from LOOK AT THIS! + lore from questing
      const loreAfter = testEngine.getLore(PLAYER_ONE);
      expect(loreAfter).toBeGreaterThan(loreBefore + todPlayfulKit.lore);
    });

    it("should allow choosing to give chosen character Evasive until next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [todPlayfulKit, allyCharacter],
        deck: 5,
      });

      // allyCharacter should not have Evasive initially
      expect(testEngine.hasKeyword(allyCharacter, "Evasive")).toBe(false);

      expect(testEngine.asPlayerOne().quest(todPlayfulKit)).toBeSuccessfulCommand();

      // Choose Evasive option (choiceIndex 1)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(todPlayfulKit, { choiceIndex: 1 }),
        ).toBeSuccessfulCommand();

        // Resolve pending to choose target
        const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
        if (pendingEffects.length > 0) {
          expect(
            testEngine.asPlayerOne().resolveNextPending({ targets: [allyCharacter] }),
          ).toBeSuccessfulCommand();
        }
      }

      // allyCharacter should now have Evasive
      expect(testEngine.hasKeyword(allyCharacter, "Evasive")).toBe(true);
    });

    it("should only allow targeting own characters for Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [todPlayfulKit],
          deck: 5,
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(todPlayfulKit)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(todPlayfulKit, { choiceIndex: 1 });

        const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
        if (pendingEffects.length > 0) {
          // Try to target opponent's character - should fail or not apply Evasive
          testEngine.asPlayerOne().resolveNextPending({ targets: [opponentCharacter] });
        }
      }

      // Opponent's character should not gain Evasive
      expect(testEngine.hasKeyword(opponentCharacter, "Evasive")).toBe(false);
    });

    it("should apply Evasive until start of next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [todPlayfulKit, allyCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(todPlayfulKit)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(todPlayfulKit, { choiceIndex: 1 });

        const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
        if (pendingEffects.length > 0) {
          testEngine.asPlayerOne().resolveNextPending({ targets: [allyCharacter] });
        }
      }

      expect(testEngine.hasKeyword(allyCharacter, "Evasive")).toBe(true);

      // Pass turns to remove Evasive
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Evasive should be removed at start of new turn
      expect(testEngine.hasKeyword(allyCharacter, "Evasive")).toBe(false);
    });

    it("should be able to target Tod himself with Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [todPlayfulKit],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(todPlayfulKit)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(todPlayfulKit, { choiceIndex: 1 });

        const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
        if (pendingEffects.length > 0) {
          expect(
            testEngine.asPlayerOne().resolveNextPending({ targets: [todPlayfulKit] }),
          ).toBeSuccessfulCommand();
        }
      }

      // Tod himself should gain Evasive
      expect(testEngine.hasKeyword(todPlayfulKit, "Evasive")).toBe(true);
    });
  });
});
