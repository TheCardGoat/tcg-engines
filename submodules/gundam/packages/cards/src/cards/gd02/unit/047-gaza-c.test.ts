import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { restUnitsByAttackingDirectly } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02GazaC047 } from "./047-gaza-c.ts";

describe("Gaza C (GD02-047)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.1 requirement", () => {
      const engine = GundamTestEngine.create({ hand: [gd02GazaC047], resourceArea: [] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment rests its active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GazaC047],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【Activate･Main】Rest this Unit：Destroy this and choose 1 enemy Unit that is Lv.5 or lower. Deal 1 damage to it.", () => {
    it("pays the rest-and-destroy cost, publishes the legal enemy choice, and deals 1 damage", () => {
      const legalEnemy = createMockUnit({ level: 5, hp: 4 });
      const highLevelEnemy = createMockUnit({ level: 6, hp: 4 });
      const friendly = createMockUnit({ level: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [gd02GazaC047, friendly] },
        { play: [legalEnemy, highLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gazaId = p1.getCardsInZone("battleArea")[0]!;
      const friendlyId = p1.getCardsInZone("battleArea")[1]!;
      const [legalEnemyId, highLevelEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.activateAbility(gazaId, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [legalEnemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [legalEnemyId!] }));

      expect(p1.getCardZone(gazaId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getDamage(legalEnemyId!)).toBe(1);
      expect(p2.getDamage(highLevelEnemyId!)).toBe(0);
      expect(p1.getDamage(friendlyId)).toBe(0);
    });

    it("cannot activate when no enemy Unit is Lv.5 or lower", () => {
      const highLevelEnemy = createMockUnit({ level: 6, hp: 4 });
      const engine = GundamTestEngine.create({ play: [gd02GazaC047] }, { play: [highLevelEnemy] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const gazaId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.activateAbility(gazaId, 0), "NO_LEGAL_TARGETS");

      expect(p1.getCardZone(gazaId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.isExhausted(gazaId)).toBe(false);
    });

    it("cannot pay its rest cost after it has attacked", () => {
      const enemy = createMockUnit({ level: 5, hp: 4 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        { play: [gd02GazaC047] },
        { play: [enemy], shieldArea: [openingShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const gazaId = p1.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [gazaId]);
      expectFailure(p1.activateAbility(gazaId, 0), "CARD_EXHAUSTED");

      expect(p1.getCardZone(gazaId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("cannot activate during a battle Action Step", () => {
      const attacker = createMockUnit({ hp: 5 });
      const enemy = createMockUnit({ level: 5, hp: 5 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        { play: [gd02GazaC047, attacker] },
        { play: [enemy], shieldArea: [openingShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [gazaId, attackerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectFailure(p1.activateAbility(gazaId!, 0), "WRONG_PHASE");

      expect(p1.isExhausted(gazaId!)).toBe(false);
      expect(p1.getCardZone(gazaId!)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });
});
