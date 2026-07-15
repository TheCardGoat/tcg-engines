import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { stitchAlienBuccaneer } from "./072-stitch-alien-buccaneer";
import { stitchLittleTrickster } from "./026-stitch-little-trickster";

const actionInDiscard = createMockAction({
  id: "stitch-ab-action",
  name: "Test Action",
  cost: 2,
  text: "A test action",
});

describe("Stitch - Alien Buccaneer", () => {
  it("should have Shift 3 keyword ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [stitchAlienBuccaneer],
    });

    expect(testEngine.hasKeyword(stitchAlienBuccaneer, "Shift")).toBe(true);
  });

  describe("READY FOR ACTION - When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.", () => {
    it("puts an action card from discard on top of deck when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: stitchAlienBuccaneer.cost,
        hand: [stitchAlienBuccaneer],
        play: [stitchLittleTrickster],
        discard: [{ card: actionInDiscard }],
        deck: 3,
      });

      const shiftTarget = testEngine.findCardInstanceId(
        stitchLittleTrickster,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(stitchAlienBuccaneer, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      // Should have 1 optional ability in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve the optional ability (accept)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(stitchAlienBuccaneer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the action card from discard
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [actionInDiscard] }),
      ).toBeSuccessfulCommand();

      // Action card should now be on top of deck
      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("deck");
    });

    it("can decline the optional ability when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: stitchAlienBuccaneer.cost,
        hand: [stitchAlienBuccaneer],
        play: [stitchLittleTrickster],
        discard: [{ card: actionInDiscard }],
        deck: 3,
      });

      const shiftTarget = testEngine.findCardInstanceId(
        stitchLittleTrickster,
        "play",
        "player_one",
      );

      testEngine.asPlayerOne().playCard(stitchAlienBuccaneer, {
        cost: {
          cost: "shift",
          shiftTarget,
        },
      });

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(stitchAlienBuccaneer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Action card should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("discard");
    });

    it("regression: triggers when shifted onto another Stitch character", () => {
      // Bug: READY FOR ACTION was not triggering when Stitch - Alien Buccaneer was shifted
      // onto another Stitch character.
      // The Stitch - Little Trickster is a valid shift target (same name "Stitch").
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: stitchAlienBuccaneer.cost,
        hand: [stitchAlienBuccaneer],
        play: [stitchLittleTrickster],
        discard: [{ card: actionInDiscard }],
        deck: 3,
      });

      const shiftTarget = testEngine.findCardInstanceId(
        stitchLittleTrickster,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(stitchAlienBuccaneer, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      // READY FOR ACTION should trigger because Shift was used
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("does not trigger when played normally without Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: stitchAlienBuccaneer.cost,
        hand: [stitchAlienBuccaneer],
        discard: [{ card: actionInDiscard }],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(stitchAlienBuccaneer)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Action card should remain in discard (condition was not met - no Shift used)
      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("discard");
    });
  });
});
