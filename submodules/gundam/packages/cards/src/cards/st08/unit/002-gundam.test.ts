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
import { st08Gundam002 } from "./002-gundam.ts";

describe("Ξ Gundam (ST08-002)", () => {
  describe("Printed Lv.5 and cost 4", () => {
    it("cannot deploy with only four total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Gundam002],
        resourceArea: activeResources(4),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st08Gundam002),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("deploys for four active Resources at Lv.5", () => {
      const engine = GundamTestEngine.create({
        hand: [st08Gundam002],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;
      expectSuccess(p1.deployUnit(cardId));
      expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
    });
  });

  describe("【Deploy】Choose 1 enemy Unit. Deal 1 damage to it.", () => {
    it("deals 1 damage to the chosen enemy Unit when deployed", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam002], resourceArea: activeResources(5) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(st08Gundam002));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

      expect(p2.getDamage(enemyId!)).toBe(1);
    });

    it("rejects deploy when the only chosen target is friendly", () => {
      const friendly = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st08Gundam002],
        play: [friendly],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.deployUnit(st08Gundam002, { targets: [friendlyId!] }), "INVALID_TARGET");
    });

    it("destroys an enemy Unit with exactly 1 HP", () => {
      const enemy = createMockUnit({ hp: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam002], resourceArea: activeResources(5) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.deployUnit(st08Gundam002, { targets: [enemyId] }));
      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("Link [Hathaway Noa]", () => {
    it("can attack on its deploy turn after pairing with Hathaway Noa", () => {
      const hathaway = createMockPilot({ name: "Hathaway Noa", cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam002, hathaway], resourceArea: activeResources(5), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08Gundam002));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(hathaway, unitId));
      expectSuccess(p1.enterBattle(unitId, "direct"));
    });

    it("cannot attack on its deploy turn with a different Pilot", () => {
      const pilot = createMockPilot({ name: "Wrong Pilot", cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam002, pilot], resourceArea: activeResources(5), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08Gundam002));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, unitId));
      expectFailure(p1.enterBattle(unitId, "direct"), "CANNOT_ATTACK");
    });
  });
});
