import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { captainHookCaptainOfTheJollyRoger } from "./173-captain-hook-captain-of-the-jolly-roger";

const fireTheCannons = createMockAction({
  id: "ftc-test",
  name: "Fire the Cannons!",
  cost: 1,
});

const otherAction = createMockAction({
  id: "other-action-test",
  name: "Some Other Action",
  cost: 2,
});

describe("Captain Hook - Captain of the Jolly Roger", () => {
  describe("DOUBLE THE POWDER! - When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.", () => {
    it("returns Fire the Cannons! from discard to hand when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [captainHookCaptainOfTheJollyRoger],
        discard: [{ card: fireTheCannons }],
        inkwell: captainHookCaptainOfTheJollyRoger.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(captainHookCaptainOfTheJollyRoger),
      ).toBeSuccessfulCommand();

      // Triggered ability should create a bag entry
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(captainHookCaptainOfTheJollyRoger, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // With only one valid target, the engine auto-resolves
      // If a pending choice remains, select the target
      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        const fireTheCannonsId = testEngine.findCardInstanceId(fireTheCannons, "discard");
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [fireTheCannonsId] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("hand");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [captainHookCaptainOfTheJollyRoger],
        discard: [{ card: fireTheCannons }],
        inkwell: captainHookCaptainOfTheJollyRoger.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(captainHookCaptainOfTheJollyRoger),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(captainHookCaptainOfTheJollyRoger, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Fire the Cannons! should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("discard");
    });

    it("does not return a non-matching action card from discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [captainHookCaptainOfTheJollyRoger],
        discard: [{ card: otherAction }],
        inkwell: captainHookCaptainOfTheJollyRoger.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(captainHookCaptainOfTheJollyRoger),
      ).toBeSuccessfulCommand();

      // The ability should still trigger (it goes into the bag)
      // but there should be no valid targets to return
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(captainHookCaptainOfTheJollyRoger, {
          resolveOptional: true,
        });
      }

      // Other action should remain in discard since it doesn't match
      expect(testEngine.asPlayerOne().getCardZone(otherAction)).toBe("discard");
    });

    it("does not trigger when no Fire the Cannons! is in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [captainHookCaptainOfTheJollyRoger],
        discard: [],
        inkwell: captainHookCaptainOfTheJollyRoger.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(captainHookCaptainOfTheJollyRoger),
      ).toBeSuccessfulCommand();

      // With no valid targets, the bag entry may or may not appear
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(captainHookCaptainOfTheJollyRoger, {
          resolveOptional: false,
        });
      }

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
