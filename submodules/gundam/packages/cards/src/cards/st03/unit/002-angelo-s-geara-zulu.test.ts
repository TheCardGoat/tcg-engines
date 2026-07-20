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
import { st03AngeloSGearaZulu002 } from "./002-angelo-s-geara-zulu.ts";

describe("Angelo's Geara Zulu (ST03-002)", () => {
  describe("【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)", () => {
    it("deploys for its printed Lv.4 and cost 3", () => {
      const engine = GundamTestEngine.create({
        hand: [st03AngeloSGearaZulu002],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st03AngeloSGearaZulu002));

      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    });

    it("cannot deploy below its printed Lv.4", () => {
      const engine = GundamTestEngine.create({
        hand: [st03AngeloSGearaZulu002],
        resourceArea: activeResources(3),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st03AngeloSGearaZulu002),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("cannot deploy without three active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st03AngeloSGearaZulu002],
        resourceArea: activeResources(4).map((entry, index) => ({
          ...entry,
          exhausted: index >= 2,
        })),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st03AngeloSGearaZulu002), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st03AngeloSGearaZulu002)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("rests to give exactly one other friendly Unit AP+2", () => {
      const firstAlly = createMockUnit({ ap: 3, hp: 5 });
      const secondAlly = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create({
        play: [st03AngeloSGearaZulu002, firstAlly, secondAlly],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [supporterId, firstAllyId, secondAllyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.useSupport(supporterId!, firstAllyId!));

      expect(p1.isExhausted(supporterId!)).toBe(true);
      expect(p1.getVisibleCard(firstAllyId!)?.effectiveAp).toBe(5);
      expect(p1.getVisibleCard(secondAllyId!)?.effectiveAp).toBe(4);
    });

    it("cannot target itself with Support", () => {
      const ally = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({ play: [st03AngeloSGearaZulu002, ally] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [supporterId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.useSupport(supporterId!, supporterId!), "ILLEGAL_TARGET");
      expect(p1.isExhausted(supporterId!)).toBe(false);
    });

    it("cannot target an enemy Unit with Support", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [st03AngeloSGearaZulu002] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const supporterId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(p1.useSupport(supporterId, enemyId), "ILLEGAL_TARGET");
      expect(p1.isExhausted(supporterId)).toBe(false);
    });

    it("cannot use Support while already rested", () => {
      const ally = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        play: [{ card: st03AngeloSGearaZulu002, exhausted: true }, ally],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [supporterId, allyId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.useSupport(supporterId!, allyId!), "CARD_EXHAUSTED");
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(3);
    });

    it("cannot use Support twice in the same turn because its rest cost remains paid", () => {
      const firstAlly = createMockUnit({ ap: 3, hp: 5 });
      const secondAlly = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create({
        play: [st03AngeloSGearaZulu002, firstAlly, secondAlly],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [supporterId, firstAllyId, secondAllyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.useSupport(supporterId!, firstAllyId!));
      expectFailure(p1.useSupport(supporterId!, secondAllyId!), "CARD_EXHAUSTED");

      expect(p1.getVisibleCard(firstAllyId!)?.effectiveAp).toBe(5);
      expect(p1.getVisibleCard(secondAllyId!)?.effectiveAp).toBe(4);
    });
  });
});
