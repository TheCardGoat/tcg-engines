import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd04GarmaSDopp026 } from "./026-garma-s-dopp.ts";

describe("Garma's Dopp (GD04-026)", () => {
  describe("【Deploy】Look at the top card of your deck. Return it to the top of your deck or place it into your trash.", () => {
    it("looks at the top card of deck and places it into trash", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04GarmaSDopp026],
        resourceArea: activeResources(3),
        deck: 4,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = p1.getCardsInZone("deck");
      const topCardBefore = deckBefore[0]!;
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p1.deployUnit(gd04GarmaSDopp026));

      expect(p1.getCardsInZone("deck")).not.toContain(topCardBefore);
      expect(p1.getCardsInZone("trash")).toContain(topCardBefore);
      expect(p1.getCardsInZone("trash").length).toBe(trashBefore + 1);
    });

    it("deploys successfully with an empty deck and leaves trash unchanged", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04GarmaSDopp026],
        resourceArea: activeResources(3),
        deck: [],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd04GarmaSDopp026));

      expect(p1.getCardsInZone("deck")).toEqual([]);
      expect(p1.getCardsInZone("trash")).toEqual([]);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });
});
