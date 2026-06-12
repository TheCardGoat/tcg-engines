/**
 * A Show of Resolve (GD01-100) — card behavior tests
 *
 * Effect: 【Main】Draw 2.
 * Level 4, cost 3, blue, no burst, no pilot.
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
import { gd01AShowOfResolve100 } from "./100-a-show-of-resolve.ts";

describe("A Show of Resolve (GD01-100)", () => {
  describe("【Main】Draw 2.", () => {
    it("draws 2 cards from deck to hand", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01AShowOfResolve100],
        resourceArea: activeResources(5),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.playCommand(gd01AShowOfResolve100));

      const handAfter = p1.getHand().length;
      const deckAfter = p1.getCardsInZone("deck").length;
      // Hand: lost command card (-1), drew 2 (+2) = net +1
      expect(handAfter).toBe(handBefore + 1);
      expect(deckAfter).toBe(deckBefore - 2);
    });

    it("moves the command card to trash after resolution", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01AShowOfResolve100],
        resourceArea: activeResources(5),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01AShowOfResolve100));

      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot be played during action-phase (timing is main only)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01AShowOfResolve100],
        resourceArea: activeResources(5),
        deck: 5,
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd01AShowOfResolve100), "WRONG_TIMING");
    });

    it("cannot be played without enough active resources", () => {
      // Level 4 requires 4 cards in resourceArea, cost 3 requires 3 active.
      // Provide 4 resources but exhaust 2 → only 2 active < 3 cost.
      const res = activeResources(4);
      res[0]!.exhausted = true;
      res[1]!.exhausted = true;
      const engine = GundamTestEngine.create({
        hand: [gd01AShowOfResolve100],
        resourceArea: res,
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd01AShowOfResolve100), "INSUFFICIENT_RESOURCES");
    });
  });
});
