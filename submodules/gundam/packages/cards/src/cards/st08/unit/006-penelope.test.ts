import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st08Penelope006 } from "./006-penelope.ts";

describe("Penelope (ST08-006)", () => {
  describe("【During Pair】【Attack】【Once per Turn】If this Unit is attacking the enemy player, reveal 1 (Earth Federation) Unit card from your hand. Return it to the bottom of your deck. If you do, draw 2.", () => {
    it("returns an Earth Federation Unit from hand to the bottom of deck and draws 2 on direct attack", () => {
      const pilot = createMockPilot({ cost: 1, level: 1 });
      const revealUnit = createMockUnit({
        name: "Revealed Earth Federation Unit",
        traits: ["earth federation"],
      });
      const engine = GundamTestEngine.create({
        hand: [pilot, revealUnit],
        play: [st08Penelope006],
        resourceArea: activeResources(7),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const penelopeId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, penelopeId));
      const revealId = p1.getHand()[0]!;
      expectSuccess(p1.enterBattle(penelopeId, "direct"));

      expect(p1.getHand()).not.toContain(revealId);
      expect(p1.getHand()).toHaveLength(2);
      expect(p1.getCardsInZone("deck")).toEqual(expect.arrayContaining([revealId]));
    });

    it("does not pay the reveal cost or draw when attacking an enemy Unit", () => {
      const pilot = createMockPilot({ cost: 1, level: 1 });
      const revealUnit = createMockUnit({
        name: "Revealed Earth Federation Unit",
        traits: ["earth federation"],
      });
      const enemy = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot, revealUnit],
          play: [st08Penelope006],
          resourceArea: activeResources(7),
          deck: 3,
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const penelopeId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, penelopeId));
      const revealId = p1.getHand()[0]!;
      const deckBefore = p1.getCardsInZone("deck");
      expectSuccess(p1.enterBattle(penelopeId, enemyId));

      expect(p1.getHand()).toEqual([revealId]);
      expect(p1.getCardsInZone("deck")).toEqual(deckBefore);
    });

    it("does not draw if there is no Earth Federation Unit card in hand to return", () => {
      const pilot = createMockPilot({ cost: 1, level: 1 });
      const nonMatchingUnit = createMockUnit({ traits: ["mafty"] });
      const engine = GundamTestEngine.create({
        hand: [pilot, nonMatchingUnit],
        play: [st08Penelope006],
        resourceArea: activeResources(7),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const penelopeId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, penelopeId));
      const handBefore = p1.getHand();
      const deckBefore = p1.getCardsInZone("deck");
      expectSuccess(p1.enterBattle(penelopeId, "direct"));

      expect(p1.getHand()).toEqual(handBefore);
      expect(p1.getCardsInZone("deck")).toEqual(deckBefore);
    });
  });
});
