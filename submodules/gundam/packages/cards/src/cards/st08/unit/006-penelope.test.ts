import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st08Penelope006 } from "./006-penelope.ts";

describe("Penelope (ST08-006)", () => {
  describe("Printed Lv.7 and cost 6", () => {
    it("cannot deploy below Lv.7", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Penelope006],
        resourceArea: activeResources(6),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st08Penelope006),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("deploys for six active Resources at Lv.7", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Penelope006],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08Penelope006));
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(6);
    });
  });

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
      const deckBefore = p1.getCardsInZone("deck").length;
      expectSuccess(p1.enterBattle(penelopeId, "direct"));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [revealId],
      });
      expectSuccess(p1.resolveEffect({ targets: [revealId] }));

      expect(p1.getHand()).not.toContain(revealId);
      expect(p1.getHand()).toHaveLength(2);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
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
      const deckBefore = p1.getCardsInZone("deck").length;
      expectSuccess(p1.enterBattle(penelopeId, enemyId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getHand()).toEqual([revealId]);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
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
      const deckBefore = p1.getCardsInZone("deck").length;
      expectSuccess(p1.enterBattle(penelopeId, "direct"));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getHand()).toEqual(handBefore);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
    });

    it("does not trigger on a direct attack while Penelope is unpaired", () => {
      const revealUnit = createMockUnit({ traits: ["earth federation"] });
      const engine = GundamTestEngine.create({
        hand: [revealUnit],
        play: [st08Penelope006],
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand();
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getHand()).toEqual(handBefore);
    });
  });

  describe("Link [Lane Aim]", () => {
    it("can attack on its deploy turn after pairing with Lane Aim", () => {
      const lane = createMockPilot({ name: "Lane Aim", cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st08Penelope006, lane], resourceArea: activeResources(7), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08Penelope006));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(lane, unitId));
      expectSuccess(p1.enterBattle(unitId, "direct"));
    });

    it("cannot attack on its deploy turn after pairing with another Pilot", () => {
      const pilot = createMockPilot({ name: "Wrong Pilot", cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st08Penelope006, pilot], resourceArea: activeResources(7), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08Penelope006));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, unitId));
      expectFailure(p1.enterBattle(unitId, "direct"), "CANNOT_ATTACK");
    });
  });
});
