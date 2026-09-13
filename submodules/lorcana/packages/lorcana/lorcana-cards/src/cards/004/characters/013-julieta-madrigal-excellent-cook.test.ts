import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { julietaMadrigalExcellentCook } from "./013-julieta-madrigal-excellent-cook";

const woundedAlly = createMockCharacter({
  id: "julieta-004-wounded-ally",
  name: "Wounded Ally",
  cost: 2,
  willpower: 5,
});

describe("Julieta Madrigal - Excellent Cook [Set 004]", () => {
  describe("SIGNATURE RECIPE - When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.", () => {
    it("triggers when played and creates an optional bag effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [julietaMadrigalExcellentCook],
        inkwell: julietaMadrigalExcellentCook.cost,
        play: [{ card: woundedAlly, damage: 2 }],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(julietaMadrigalExcellentCook),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("removes up to 2 damage from chosen character when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [julietaMadrigalExcellentCook],
        inkwell: julietaMadrigalExcellentCook.cost,
        play: [{ card: woundedAlly, damage: 2 }],
        deck: 2,
      });

      const woundedAllyId = testEngine.findCardInstanceId(woundedAlly, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(julietaMadrigalExcellentCook),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(julietaMadrigalExcellentCook, {
          resolveOptional: true,
          targets: [woundedAllyId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getCard(woundedAllyId)?.damage).toBe(0);
    });

    it("draws a card when damage was removed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [julietaMadrigalExcellentCook],
        inkwell: julietaMadrigalExcellentCook.cost,
        play: [{ card: woundedAlly, damage: 2 }],
        deck: 2,
      });

      const woundedAllyId = testEngine.findCardInstanceId(woundedAlly, "play", PLAYER_ONE);
      const handCountBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().playCard(julietaMadrigalExcellentCook),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(julietaMadrigalExcellentCook, {
          resolveOptional: true,
          targets: [woundedAllyId],
        }),
      ).toBeSuccessfulCommand();

      // Second "you may draw" is an independent surface after remove-damage.
      expect(
        testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Played Julieta (hand -1) + drew a card (hand +1) = net 0 change
      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(handCountBefore);
    });

    it("does not draw a card when the optional remove-damage is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [julietaMadrigalExcellentCook],
        inkwell: julietaMadrigalExcellentCook.cost,
        play: [{ card: woundedAlly, damage: 2 }],
        deck: 2,
      });

      const woundedAllyId = testEngine.findCardInstanceId(woundedAlly, "play", PLAYER_ONE);
      const handCountBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().playCard(julietaMadrigalExcellentCook),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(julietaMadrigalExcellentCook, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage unchanged
      expect(testEngine.asServer().getCard(woundedAllyId)?.damage).toBe(2);
      // Played Julieta (hand -1), no draw = net -1
      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(
        handCountBefore - 1,
      );
    });

    it("does not draw a card when target has no damage (0 removed)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [julietaMadrigalExcellentCook],
        inkwell: julietaMadrigalExcellentCook.cost,
        play: [woundedAlly],
        deck: 2,
      });

      const woundedAllyId = testEngine.findCardInstanceId(woundedAlly, "play", PLAYER_ONE);
      const handCountBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().playCard(julietaMadrigalExcellentCook),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(julietaMadrigalExcellentCook, {
          resolveOptional: true,
          targets: [woundedAllyId],
        }),
      ).toBeSuccessfulCommand();

      // No draw since no damage was removed
      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(
        handCountBefore - 1,
      );
    });

    it("bot drains nested SIGNATURE RECIPE mays without conceding", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [julietaMadrigalExcellentCook],
        inkwell: julietaMadrigalExcellentCook.cost,
        play: [{ card: woundedAlly, damage: 2 }],
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().playCard(julietaMadrigalExcellentCook),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      let sawResolutionWindow = false;
      for (let step = 0; step < 8 && !testEngine.asServer().isGameOver(); step += 1) {
        const before = testEngine.asServer().getState();
        const hadWindow =
          (before.G.triggeredAbilities?.bag.items.length ?? 0) > 0 ||
          before.G.pendingEffects.length > 0;
        const result = testEngine.asServer().takeAutomatedActionForCurrentActor();
        if (hadWindow) {
          sawResolutionWindow = true;
          expect(result.fallbackTaken).not.toBe("concede");
          expect(result.finalResult.success).toBe(true);
        }
        const after = testEngine.asServer().getState();
        const hasWindow =
          (after.G.triggeredAbilities?.bag.items.length ?? 0) > 0 ||
          after.G.pendingEffects.length > 0;
        if (sawResolutionWindow && !hasWindow) {
          break;
        }
      }

      expect(sawResolutionWindow).toBe(true);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(0);
      expect(testEngine.asServer().isGameOver()).toBe(false);
    });
  });
});
