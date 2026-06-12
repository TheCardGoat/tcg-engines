import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { prestonWhitmoreExpeditionFinancier } from "./110-preston-whitmore-expedition-financier";

describe("Preston Whitmore - Expedition Financier", () => {
  describe("PRICE OF PROGRESS - When you play this character, you may put the top 2 cards of your deck into your discard.", () => {
    it("mills the top 2 cards of the controller's deck when the optional is resolved", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [prestonWhitmoreExpeditionFinancier],
        inkwell: prestonWhitmoreExpeditionFinancier.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(prestonWhitmoreExpeditionFinancier),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(prestonWhitmoreExpeditionFinancier, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardsInZone("discard", PLAYER_ONE).count).toBe(2);
    });

    it("does not mill any cards when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [prestonWhitmoreExpeditionFinancier],
        inkwell: prestonWhitmoreExpeditionFinancier.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(prestonWhitmoreExpeditionFinancier),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(prestonWhitmoreExpeditionFinancier, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardsInZone("discard", PLAYER_ONE).count).toBe(0);
    });
  });
});
