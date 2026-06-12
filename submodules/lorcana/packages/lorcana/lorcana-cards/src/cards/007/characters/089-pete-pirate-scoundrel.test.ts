import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { petePirateScoundrel } from "./089-pete-pirate-scoundrel";
import { gatheringKnowledgeAndWisdom } from "../../005/actions/062-gathering-knowledge-and-wisdom";
import { hiddenInkcaster } from "../../004/items/098-hidden-inkcaster";
import { aPiratesLife } from "../../004/actions/128-a-pirates-life";

describe("Pete - Pirate Scoundrel", () => {
  describe("PILFER AND PLUNDER - Whenever you play an action that isn't a song, you may banish chosen item.", () => {
    it("should banish chosen item when playing an action that is not a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [petePirateScoundrel, hiddenInkcaster],
          hand: [gatheringKnowledgeAndWisdom],
          inkwell: gatheringKnowledgeAndWisdom.cost,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      // Play a non-song action
      expect(
        testEngine.asPlayerOne().playCard(gatheringKnowledgeAndWisdom),
      ).toBeSuccessfulCommand();

      // Triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // Accept the optional trigger
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(petePirateScoundrel, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the item to banish
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [hiddenInkcaster] }),
      ).toBeSuccessfulCommand();

      // Item should be banished (moved to discard)
      expect(testEngine.asPlayerOne().getCardZone(hiddenInkcaster)).toBe("discard");
    });

    it("should NOT trigger when playing a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [petePirateScoundrel, hiddenInkcaster],
          hand: [aPiratesLife],
          inkwell: aPiratesLife.cost,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      // Play a song action
      expect(testEngine.asPlayerOne().playCard(aPiratesLife)).toBeSuccessfulCommand();

      // No triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Item should still be in play
      expect(testEngine.asPlayerOne().getCardZone(hiddenInkcaster)).toBe("play");
    });

    it("can be declined (optional trigger)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [petePirateScoundrel, hiddenInkcaster],
          hand: [gatheringKnowledgeAndWisdom],
          inkwell: gatheringKnowledgeAndWisdom.cost,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      // Play a non-song action
      expect(
        testEngine.asPlayerOne().playCard(gatheringKnowledgeAndWisdom),
      ).toBeSuccessfulCommand();

      // Decline the optional trigger
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(petePirateScoundrel, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Item should still be in play
      expect(testEngine.asPlayerOne().getCardZone(hiddenInkcaster)).toBe("play");
    });
  });
});
