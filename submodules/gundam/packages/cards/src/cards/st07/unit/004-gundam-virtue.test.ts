import { describe, expect, it } from "vite-plus/test";
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
import { st07GundamVirtue004 } from "./004-gundam-virtue.ts";

describe("Gundam Virtue (ST07-004)", () => {
  describe("Printed Lv.3 and cost 2", () => {
    it("deploys for two active Resources at Lv.3", () => {
      const engine = GundamTestEngine.create({
        hand: [st07GundamVirtue004],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;
      expectSuccess(p1.deployUnit(cardId));
      expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("cannot deploy below Lv.3", () => {
      const engine = GundamTestEngine.create({
        hand: [st07GundamVirtue004],
        resourceArea: activeResources(2),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st07GundamVirtue004),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });
  });

  describe("While you have a (CB) Pilot in play, this Unit gains <Blocker>.", () => {
    it("gains Blocker while a friendly CB Pilot is paired", () => {
      const pilot = createMockPilot({ name: "CB Pilot", traits: ["cb"], cost: 0, level: 1 });
      const host = createMockUnit();
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st07GundamVirtue004, host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [virtueId, hostId] = p1.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(pilot, hostId!));
      expect(p1.getVisibleCard(virtueId!)?.keywords).toContain("Blocker");
    });

    it("does not gain Blocker from a friendly non-CB Pilot", () => {
      const pilot = createMockPilot({ name: "Other Pilot", traits: ["zeon"], cost: 0, level: 1 });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st07GundamVirtue004],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const virtueId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, virtueId));
      expect(p1.getVisibleCard(virtueId)?.keywords).not.toContain("Blocker");
    });

    it("does not gain Blocker from an opponent's CB Pilot", () => {
      const pilot = createMockPilot({ name: "Enemy CB Pilot", traits: ["cb"], cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { play: [st07GundamVirtue004] },
        { hand: [pilot], play: [createMockUnit()], resourceArea: activeResources(2) },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const virtueId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p2.assignPilot(pilot, p2.getCardsInZone("battleArea")[0]!));
      expect(p1.getVisibleCard(virtueId)?.keywords).not.toContain("Blocker");
    });

    it("can redirect a direct attack while the friendly CB Pilot remains in play", () => {
      const pilot = createMockPilot({ name: "CB Pilot", traits: ["cb"], cost: 0, level: 1 });
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [pilot], play: [st07GundamVirtue004], resourceArea: activeResources(3), deck: 5 },
        { play: [attacker], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const virtueId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, virtueId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));

      expectSuccess(p1.declareBlock(virtueId));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ blockerId: virtueId });
      expect(p1.isExhausted(virtueId)).toBe(true);
    });
  });

  describe("Link [Tieria Erde]", () => {
    it("can attack on its deploy turn when paired with Tieria Erde", () => {
      const tieria = createMockPilot({ name: "Tieria Erde", cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st07GundamVirtue004, tieria], resourceArea: activeResources(3), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st07GundamVirtue004));
      const virtueId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(tieria, virtueId));
      expectSuccess(p1.enterBattle(virtueId, "direct"));
    });

    it("cannot attack on its deploy turn when paired with another Pilot", () => {
      const pilot = createMockPilot({ name: "Wrong Pilot", cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st07GundamVirtue004, pilot], resourceArea: activeResources(3), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st07GundamVirtue004));
      const virtueId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, virtueId));
      expectFailure(p1.enterBattle(virtueId, "direct"), "CANNOT_ATTACK");
    });
  });
});
