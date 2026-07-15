import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { gadgetsGoggles } from "../items/168-gadgets-goggles";
import { safetyRope } from "../items/033-safety-rope";
import { gadgetHackwrenchFinderOfLostParts } from "./147-gadget-hackwrench-finder-of-lost-parts";

const banishAction = createMockAction({
  id: "gadget-finder-test-banish-action",
  name: "Test Banish Action",
  cost: 1,
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

describe("Gadget Hackwrench - Finder of Lost Parts", () => {
  describe("USEFUL BITS - When this character leaves play, you may return an item card from your discard to your hand.", () => {
    it("returns an item from discard to hand when Gadget leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: banishAction.cost,
        play: [gadgetHackwrenchFinderOfLostParts],
        hand: [banishAction],
        discard: [gadgetsGoggles],
        deck: 3,
      });

      // Banish Gadget with the action
      expect(
        testEngine
          .asPlayerOne()
          .playCard(banishAction, { targets: [gadgetHackwrenchFinderOfLostParts] }),
      ).toBeSuccessfulCommand();

      // Gadget should be in discard
      expect(testEngine.asPlayerOne().getCardZone(gadgetHackwrenchFinderOfLostParts)).toBe(
        "discard",
      );

      // USEFUL BITS should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional and return the item to hand
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(gadgetHackwrenchFinderOfLostParts, {
          resolveOptional: true,
          targets: [gadgetsGoggles],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(gadgetsGoggles)).toBe("hand");
    });

    it("is optional - declining leaves the item in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: banishAction.cost,
        play: [gadgetHackwrenchFinderOfLostParts],
        hand: [banishAction],
        discard: [gadgetsGoggles],
        deck: 3,
      });

      expect(
        testEngine
          .asPlayerOne()
          .playCard(banishAction, { targets: [gadgetHackwrenchFinderOfLostParts] }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(gadgetHackwrenchFinderOfLostParts, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(gadgetsGoggles)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(gadgetHackwrenchFinderOfLostParts)).toBe(
        "discard",
      );
    });

    it("lets the controller choose which item to return when multiple are in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: banishAction.cost,
        play: [gadgetHackwrenchFinderOfLostParts],
        hand: [banishAction],
        discard: [gadgetsGoggles, safetyRope],
        deck: 3,
      });

      expect(
        testEngine
          .asPlayerOne()
          .playCard(banishAction, { targets: [gadgetHackwrenchFinderOfLostParts] }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(gadgetHackwrenchFinderOfLostParts, {
          resolveOptional: true,
          targets: [safetyRope],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(safetyRope)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(gadgetsGoggles)).toBe("discard");
    });
  });
});
