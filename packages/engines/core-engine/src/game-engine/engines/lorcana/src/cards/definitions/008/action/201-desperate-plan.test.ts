/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  mickeyMouseArtfulRogue,
  mickeyMouseDetective,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { mickeyMouseFriendlyFace } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { mickeyMouseTrumpeter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import {
  desperatePlan,
  mickeyMouseGiantMouse,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Desperate Plan", () => {
  describe("If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.", () => {
    it("No cards in hand", async () => {
      const testEngine = new TestEngine({
        inkwell: desperatePlan.cost,
        hand: [desperatePlan],
        deck: 20,
      });

      await testEngine.playCard(desperatePlan);

      expect(testEngine.stackLayers).toHaveLength(0);
      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 3,
          deck: 17,
        }),
      );
    });

    it("With cards in hand", async () => {
      const toDiscard = [
        mickeyMouseGiantMouse,
        mickeyMouseDetective,
        mickeyMouseArtfulRogue,
      ];
      const toKeep = [mickeyMouseTrumpeter, mickeyMouseFriendlyFace];
      const testEngine = new TestEngine({
        inkwell: desperatePlan.cost,
        hand: [desperatePlan, ...toDiscard, ...toKeep],
        deck: 20,
      });

      await testEngine.playCard(desperatePlan, {
        targets: toDiscard,
      });

      for (const card of toDiscard) {
        expect(testEngine.getCardModel(card).zone).toEqual("discard");
      }

      for (const card of toKeep) {
        expect(testEngine.getCardModel(card).zone).toEqual("hand");
      }

      expect(testEngine.stackLayers).toHaveLength(0);
      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: toDiscard.length + toKeep.length,
          discard: toDiscard.length + 1,
          deck: 20 - toDiscard.length,
        }),
      );
    });
  });
});
