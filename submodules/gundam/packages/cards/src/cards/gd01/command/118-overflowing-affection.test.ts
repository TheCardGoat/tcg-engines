/**
 * Overflowing Affection (GD01-118) — card behavior tests
 *
 * Effect: 【Main】Draw 2. Then, discard 1.
 * Level 2, cost 1, white, no burst, no pilot.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  activeResources,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { gd01OverflowingAffection118 } from "./118-overflowing-affection.ts";

describe("Overflowing Affection (GD01-118)", () => {
  describe("【Main】Draw 2. Then, discard 1.", () => {
    it("draws 2 then discards 1 (net 0 overall hand size after playing the command)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01OverflowingAffection118],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.playCommand(gd01OverflowingAffection118));

      const handAfter = p1.getHand().length;
      const deckAfter = p1.getCardsInZone("deck").length;
      // Hand: lost command (-1), drew 2 (+2), discarded 1 (-1) = net 0
      expect(handAfter).toBe(handBefore);
      // Deck decreased by 2 (draw 2)
      expect(deckAfter).toBe(deckBefore - 2);
    });

    it("moves the command card to trash after resolution", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01OverflowingAffection118],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01OverflowingAffection118));

      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot be played during action-phase (timing is main only)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01OverflowingAffection118],
        resourceArea: activeResources(3),
        deck: 5,
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd01OverflowingAffection118), "WRONG_TIMING");
    });

    it("cannot be played without enough active resources", () => {
      // Level 2 requires 2 cards in resourceArea, cost 1 requires 1 active.
      // Provide 2 resources but exhaust both → 0 active < 1 cost.
      const res = activeResources(2);
      res[0]!.exhausted = true;
      res[1]!.exhausted = true;
      const engine = GundamTestEngine.create({
        hand: [gd01OverflowingAffection118],
        resourceArea: res,
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd01OverflowingAffection118), "INSUFFICIENT_RESOURCES");
    });
  });
});
