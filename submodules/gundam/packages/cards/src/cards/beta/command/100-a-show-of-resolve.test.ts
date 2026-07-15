import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { betaAShowOfResolve100 } from "./100-a-show-of-resolve.ts";

describe("A Show of Resolve (GD01-100, beta reprint)", () => {
  describe("【Main】Draw 2.", () => {
    it("draws 2 cards from deck to hand", () => {
      const engine = GundamTestEngine.create({
        hand: [betaAShowOfResolve100],
        resourceArea: activeResources(5),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(betaAShowOfResolve100));

      // Hand: -1 command, +2 drawn = +1 net
      expect(p1.getHand().length).toBe(handBefore + 1);
      expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
