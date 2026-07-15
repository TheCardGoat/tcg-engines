import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { ladyTremaineWickedStepmother } from "./085-lady-tremaine-wicked-stepmother";

const actionCardInDiscard = createMockAction({
  id: "lady-tremaine-test-action",
  name: "Test Action Card",
  cost: 2,
});

const anotherActionCardInDiscard = createMockAction({
  id: "lady-tremaine-test-action-2",
  name: "Test Action Card 2",
  cost: 1,
});

describe("Lady Tremaine - Wicked Stepmother", () => {
  describe("DO IT AGAIN! - When you play this character, you may return an action card from your discard to your hand.", () => {
    it("triggers when played and can return an action card from discard to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyTremaineWickedStepmother],
        discard: [{ card: actionCardInDiscard }],
        inkwell: ladyTremaineWickedStepmother.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(ladyTremaineWickedStepmother),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ladyTremaineWickedStepmother, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        const actionId = testEngine.findCardInstanceId(actionCardInDiscard, "discard");
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [actionId] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(actionCardInDiscard)).toBe("hand");
    });

    it("is optional — can be declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyTremaineWickedStepmother],
        discard: [{ card: actionCardInDiscard }],
        inkwell: ladyTremaineWickedStepmother.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(ladyTremaineWickedStepmother),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ladyTremaineWickedStepmother, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(actionCardInDiscard)).toBe("discard");
    });

    it("does not trigger when no action cards are in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyTremaineWickedStepmother],
        discard: [],
        inkwell: ladyTremaineWickedStepmother.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(ladyTremaineWickedStepmother),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("only returns action cards — not characters or items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyTremaineWickedStepmother],
        discard: [{ card: actionCardInDiscard }, { card: anotherActionCardInDiscard }],
        inkwell: ladyTremaineWickedStepmother.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(ladyTremaineWickedStepmother),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ladyTremaineWickedStepmother, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Can pick only 1 action card to return
      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        const actionId = testEngine.findCardInstanceId(actionCardInDiscard, "discard");
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [actionId] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(actionCardInDiscard)).toBe("hand");
      // The second action card stays in discard
      expect(testEngine.asPlayerOne().getCardZone(anotherActionCardInDiscard)).toBe("discard");
    });
  });
});
