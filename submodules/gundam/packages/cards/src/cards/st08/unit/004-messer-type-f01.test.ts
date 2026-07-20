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
import { st08MesserTypeF01004 } from "./004-messer-type-f01.ts";

describe("Messer Type-F01 (ST08-004)", () => {
  describe("Printed Lv.2 and cost 2", () => {
    it("deploys for two active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st08MesserTypeF01004],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08MesserTypeF01004));
      expect(p1.getCardsInZone("resourceArea").every((id) => p1.isExhausted(id))).toBe(true);
    });

    it("cannot deploy below Lv.2", () => {
      const engine = GundamTestEngine.create({
        hand: [st08MesserTypeF01004],
        resourceArea: activeResources(1),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st08MesserTypeF01004),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });
  });

  describe("【Attack】If this Unit is attacking an enemy Unit, choose 1 enemy Unit. Deal 1 damage to it.", () => {
    it("deals 1 damage to an enemy Unit when attacking an enemy Unit", () => {
      const defender = createMockUnit({ cardNumber: "TEST-MESSER-DEFENDER", hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [st08MesserTypeF01004] },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [defenderId],
      });
      expectSuccess(p1.resolveEffect({ targets: [defenderId] }));

      expect(p2.getDamage(defenderId)).toBe(1);
    });

    it("does not deal effect damage when attacking the enemy player directly", () => {
      const bystander = createMockUnit({ cardNumber: "TEST-MESSER-BYSTANDER", hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [st08MesserTypeF01004] },
        { play: [bystander] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const bystanderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(bystanderId)).toBe(0);
    });

    it("may deal the damage to a different enemy Unit than the attack target", () => {
      const defender = createMockUnit({ hp: 5 });
      const bystander = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [st08MesserTypeF01004] },
        { play: [{ card: defender, exhausted: true }, bystander] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [defenderId, bystanderId] = p2.getCardsInZone("battleArea");
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, defenderId!));
      expectSuccess(p1.resolveEffect({ targets: [bystanderId!] }));
      expect(p2.getDamage(defenderId!)).toBe(0);
      expect(p2.getDamage(bystanderId!)).toBe(1);
    });
  });

  describe("Link (Mafty) Trait", () => {
    it("can attack on its deploy turn with a Mafty Pilot", () => {
      const pilot = createMockPilot({ traits: ["mafty"], cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st08MesserTypeF01004, pilot], resourceArea: activeResources(2), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08MesserTypeF01004));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, unitId));
      expectSuccess(p1.enterBattle(unitId, "direct"));
    });

    it("cannot attack on its deploy turn with a non-Mafty Pilot", () => {
      const pilot = createMockPilot({ traits: ["earth federation"], cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st08MesserTypeF01004, pilot], resourceArea: activeResources(2), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08MesserTypeF01004));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, unitId));
      expectFailure(p1.enterBattle(unitId, "direct"), "CANNOT_ATTACK");
    });
  });
});
