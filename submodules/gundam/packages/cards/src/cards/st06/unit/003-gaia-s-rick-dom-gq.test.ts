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
import { st06GaiaSRickDomGq003 } from "./003-gaia-s-rick-dom-gq.ts";

describe("Gaia's Rick Dom (GQ) (ST06-003)", () => {
  it("deploys with printed 2 AP/2 HP for Lv.2 and cost 2", () => {
    const engine = GundamTestEngine.create({
      hand: [st06GaiaSRickDomGq003],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(st06GaiaSRickDomGq003));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 2, effectiveHp: 2 });
    expect(p1.getVisibleCard(unitId)?.keywords).toContain("Support");
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("cannot deploy below Lv.2", () => {
    const engine = GundamTestEngine.create({
      hand: [st06GaiaSRickDomGq003],
      resourceArea: activeResources(1),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st06GaiaSRickDomGq003),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("cannot deploy without two active resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st06GaiaSRickDomGq003],
      resourceArea: restedResources(2),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st06GaiaSRickDomGq003),
      "INSUFFICIENT_RESOURCES",
    );
  });

  describe("【Activate･Main】<Support 1>", () => {
    it("rests itself and gives exactly one other friendly Unit AP+1 this turn", () => {
      const first = createMockUnit({ ap: 3, hp: 5 });
      const second = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create({ play: [st06GaiaSRickDomGq003, first, second] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [supporterId, chosenId, otherId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.useSupport(supporterId!, chosenId!));

      expect(p1.isExhausted(supporterId!)).toBe(true);
      expect(p1.getVisibleCard(chosenId!)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(otherId!)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(supporterId!)).toMatchObject({ effectiveAp: 2 });
    });

    it("cannot target itself", () => {
      const engine = GundamTestEngine.create({
        play: [st06GaiaSRickDomGq003, createMockUnit()],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const supporterId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.useSupport(supporterId, supporterId), "ILLEGAL_TARGET");
      expect(p1.isExhausted(supporterId)).toBe(false);
    });

    it("cannot target an enemy Unit", () => {
      const engine = GundamTestEngine.create(
        { play: [st06GaiaSRickDomGq003] },
        { play: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const supporterId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(p1.useSupport(supporterId, enemyId), "ILLEGAL_TARGET");
      expect(p1.isExhausted(supporterId)).toBe(false);
    });

    it("cannot activate while already rested", () => {
      const engine = GundamTestEngine.create({
        play: [{ card: st06GaiaSRickDomGq003, exhausted: true }, createMockUnit({ ap: 3 })],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [supporterId, targetId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.useSupport(supporterId!, targetId!), "CARD_EXHAUSTED");
      expect(p1.getVisibleCard(targetId!)).toMatchObject({ effectiveAp: 3 });
    });

    it("cannot activate outside the Main phase", () => {
      const engine = GundamTestEngine.create({
        play: [st06GaiaSRickDomGq003, createMockUnit()],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [supporterId, targetId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.useSupport(supporterId!, targetId!), "WRONG_PHASE");
    });

    it("expires the AP bonus at the end of the turn", () => {
      const engine = GundamTestEngine.create({
        play: [st06GaiaSRickDomGq003, createMockUnit({ ap: 3, hp: 5 })],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [supporterId, targetId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.useSupport(supporterId!, targetId!));
      expect(p1.getVisibleCard(targetId!)).toMatchObject({ effectiveAp: 4 });
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(targetId!)).toMatchObject({ effectiveAp: 3 });
    });
  });
});
