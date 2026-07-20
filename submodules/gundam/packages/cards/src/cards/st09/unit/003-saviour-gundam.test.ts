import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09SaviourGundam003 } from "./003-saviour-gundam.ts";

const athrun = () => createMockPilot({ name: "Athrun Zala", level: 4, cost: 1 });
const purpleTrash = (count: number) =>
  Array.from({ length: count }, () => createMockUnit({ color: "purple" }));

describe("Saviour Gundam (ST09-003)", () => {
  describe("Printed Lv.6 and cost 5", () => {
    it("deploys for five active Resources at Lv.6", () => {
      const engine = GundamTestEngine.create({
        hand: [st09SaviourGundam003],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st09SaviourGundam003));
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(5);
    });

    it("cannot deploy below Lv.6", () => {
      const engine = GundamTestEngine.create({
        hand: [st09SaviourGundam003],
        resourceArea: activeResources(5),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st09SaviourGundam003),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });
  });

  describe("<Breach 3>", () => {
    it("deals 3 damage to the defender's top shield after destroying an enemy Unit", () => {
      const defender = createMockUnit({ ap: 1, hp: 1 });
      const shieldSeed = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [st09SaviourGundam003] },
        { play: [{ card: defender, exhausted: true }], shieldArea: [shieldSeed] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
    });

    it("deals exactly 3 damage to the enemy Base after destroying a Unit in battle", () => {
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const base = createMockBase({ hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [st09SaviourGundam003] },
        { play: [{ card: defender, exhausted: true }], baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getDamage(baseId)).toBe(3);
    });

    it("does not apply Breach when its attack does not destroy the enemy Unit", () => {
      const defender = createMockUnit({ ap: 0, hp: 6 });
      const base = createMockBase({ hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [st09SaviourGundam003] },
        { play: [{ card: defender, exhausted: true }], baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getDamage(baseId)).toBe(0);
    });
  });

  describe("【When Linked】If there are 5 or more purple cards in your trash, deal 2 damage to all Units with 5 or less AP.", () => {
    it("on link, deals 2 damage to every Unit with AP 5 or less when trash has 5 purple cards", () => {
      const pilot = athrun();
      const friendlyLow = createMockUnit({ ap: 4, hp: 5 });
      const enemyLow = createMockUnit({ ap: 5, hp: 5 });
      const enemyHigh = createMockUnit({ ap: 6, hp: 7 });
      const engine = GundamTestEngine.create(
        {
          play: [st09SaviourGundam003, friendlyLow],
          hand: [pilot],
          resourceArea: activeResources(4),
          trash: purpleTrash(5),
        },
        { play: [enemyLow, enemyHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [saviourId, friendlyLowId] = p1.getCardsInZone("battleArea");
      const [enemyLowId, enemyHighId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, saviourId!));

      // Athrun's pilot bonus pushes Saviour above the AP<=5 filter.
      expect(p1.getDamage(saviourId!)).toBe(0);
      expect(p1.getDamage(friendlyLowId!)).toBe(2);
      expect(p2.getDamage(enemyLowId!)).toBe(2);
      expect(p2.getDamage(enemyHighId!)).toBe(0);
    });

    it("does not fire with only four purple cards in trash", () => {
      const pilot = athrun();
      const enemyLow = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [st09SaviourGundam003],
          hand: [pilot],
          resourceArea: activeResources(4),
          trash: purpleTrash(4),
        },
        { play: [enemyLow] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [saviourId] = p1.getCardsInZone("battleArea");
      const [enemyLowId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, saviourId!));

      expect(p1.getDamage(saviourId!)).toBe(0);
      expect(p2.getDamage(enemyLowId!)).toBe(0);
    });

    it("counts only purple cards in its controller's trash", () => {
      const pilot = athrun();
      const target = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [st09SaviourGundam003],
          hand: [pilot],
          resourceArea: activeResources(4),
          trash: purpleTrash(4),
        },
        { play: [target], trash: purpleTrash(5) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const targetId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, p1.getCardsInZone("battleArea")[0]!));
      expect(p1.getDamage(targetId)).toBe(0);
    });

    it("destroys all AP5-or-less Units with exactly 2 HP simultaneously", () => {
      const pilot = athrun();
      const friendly = createMockUnit({ ap: 5, hp: 2 });
      const enemy = createMockUnit({ ap: 5, hp: 2 });
      const engine = GundamTestEngine.create(
        {
          play: [st09SaviourGundam003, friendly],
          hand: [pilot],
          resourceArea: activeResources(4),
          trash: purpleTrash(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [saviourId, friendlyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, saviourId!));
      expect(p1.getCardZone(friendlyId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("does not trigger when paired with a Pilot that does not satisfy the Link condition", () => {
      const wrongPilot = createMockPilot({ name: "Wrong Pilot", cost: 0, level: 1 });
      const enemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [st09SaviourGundam003],
          hand: [wrongPilot],
          resourceArea: activeResources(4),
          trash: purpleTrash(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(wrongPilot, unitId));
      expect(p1.getDamage(enemyId)).toBe(0);
    });
  });

  describe("Link [Athrun Zala]", () => {
    it("can attack on its deploy turn after pairing with Athrun Zala", () => {
      const pilot = athrun();
      const engine = GundamTestEngine.create(
        { hand: [st09SaviourGundam003, pilot], resourceArea: activeResources(6), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st09SaviourGundam003));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, unitId));
      expectSuccess(p1.enterBattle(unitId, "direct"));
    });

    it("cannot attack on its deploy turn after pairing with another Pilot", () => {
      const pilot = createMockPilot({ name: "Wrong Pilot", cost: 0, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [st09SaviourGundam003, pilot], resourceArea: activeResources(6), deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st09SaviourGundam003));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, unitId));
      expectFailure(p1.enterBattle(unitId, "direct"), "CANNOT_ATTACK");
    });
  });
});
