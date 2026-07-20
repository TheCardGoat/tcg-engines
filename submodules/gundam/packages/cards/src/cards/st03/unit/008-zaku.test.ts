import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st03Zaku008 } from "./008-zaku.ts";

describe("Zaku Ⅱ (ST03-008)", () => {
  describe("【Attack】This Unit gets AP+2 during this turn.", () => {
    it("gives only the attacking Zaku AP+2 when it declares an attack", () => {
      const ally = createMockUnit({ name: "Friendly Unit", ap: 2, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy Unit", ap: 0, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [st03Zaku008, ally] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [zakuId, allyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expect(p1.getVisibleCard(zakuId!)?.effectiveAp).toBe(1);
      expectSuccess(p1.enterBattle(zakuId!, enemyId));

      expect(p1.getVisibleCard(zakuId!)?.effectiveAp).toBe(3);
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(2);
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(0);
    });

    it("deals battle damage using its increased AP", () => {
      const enemy = createMockUnit({ name: "Durable Enemy", ap: 0, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [st03Zaku008] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(zakuId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(enemyId)).toBe(3);
    });

    it("does not grant AP before the Zaku declares an attack", () => {
      const engine = GundamTestEngine.create({ play: [st03Zaku008] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());

      expect(p1.getVisibleCard(zakuId)?.effectiveAp).toBe(1);
    });

    it("removes the AP increase at the end of the turn", () => {
      const enemy = createMockUnit({ name: "Enemy Unit", ap: 0, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [st03Zaku008], deck: 5 },
        { play: [{ card: enemy, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(zakuId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getVisibleCard(zakuId)?.effectiveAp).toBe(3);
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(zakuId)?.effectiveAp).toBe(1);
    });
  });

  describe("deploying Zaku Ⅱ", () => {
    it("pays its printed cost and deploys it to the battle area", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Zaku008],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const zakuId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(zakuId));

      expect(p1.getCardZone(zakuId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(zakuId)).toMatchObject({ effectiveAp: 1, effectiveHp: 2 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("cannot be deployed below its printed Lv.2 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Zaku008],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st03Zaku008), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st03Zaku008)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Zaku008],
        resourceArea: restedResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st03Zaku008), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st03Zaku008)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Zaku008],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(st03Zaku008), "WRONG_PHASE");

      expect(p1.getCardZone(st03Zaku008)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
