import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { betaOverflowingAffection118 } from "./118-overflowing-affection.ts";

describe("Overflowing Affection (GD01-118, beta reprint)", () => {
  describe("【Main】Draw 2. Then, discard 1.", () => {
    it("draws 2 then discards 1 (net 0 hand size change after the command)", () => {
      const engine = GundamTestEngine.create({
        hand: [betaOverflowingAffection118],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(betaOverflowingAffection118));

      // Hand: -1 command, +2 drawn, -1 discarded = net 0
      expect(p1.getHand().length).toBe(handBefore);
      expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
