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
  restedResources,
} from "@tcg/gundam-engine";
import { st06GquuuuuuxOmegaPsycommu001 } from "./001-gquuuuuux-omega-psycommu.ts";

const machu = () => createMockPilot({ name: "Amate Yuzuriha (Machu)", level: 1, cost: 1 });

describe("GQuuuuuuX (Omega Psycommu) (ST06-001)", () => {
  it("deploys with its printed 4 AP/4 HP for Lv.5 and cost 3", () => {
    const engine = GundamTestEngine.create({
      hand: [st06GquuuuuuxOmegaPsycommu001],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(st06GquuuuuuxOmegaPsycommu001));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
  });

  it("cannot deploy below Lv.5", () => {
    const engine = GundamTestEngine.create({
      hand: [st06GquuuuuuxOmegaPsycommu001],
      resourceArea: activeResources(4),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st06GquuuuuuxOmegaPsycommu001),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("cannot deploy without three active resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st06GquuuuuuxOmegaPsycommu001],
      resourceArea: restedResources(5),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st06GquuuuuuxOmegaPsycommu001),
      "INSUFFICIENT_RESOURCES",
    );
  });

  describe("【When Linked】 another friendly Clan Unit grants First Strike this turn", () => {
    it("visibly grants First Strike to itself when legally linked beside another Clan Unit", () => {
      const pilot = machu();
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st06GquuuuuuxOmegaPsycommu001, createMockUnit({ traits: ["clan"] })],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));

      expect(p1.getVisibleCard(unitId)?.keywords).toContain("FirstStrike");
    });

    it("does not count itself as the other Clan Unit", () => {
      const pilot = machu();
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st06GquuuuuuxOmegaPsycommu001],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));

      expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("FirstStrike");
    });

    it("does not count another friendly Unit with an unrelated trait", () => {
      const pilot = machu();
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st06GquuuuuuxOmegaPsycommu001, createMockUnit({ traits: ["zeon"] })],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));

      expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("FirstStrike");
    });

    it("does not trigger when paired with a Pilot outside its Link Condition", () => {
      const wrongPilot = createMockPilot({ name: "Shuji Itō", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [wrongPilot],
        play: [st06GquuuuuuxOmegaPsycommu001, createMockUnit({ traits: ["clan"] })],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(wrongPilot, unitId));

      expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("FirstStrike");
    });

    it("deals First Strike damage before a lethal defender can deal return damage", () => {
      const pilot = machu();
      const defender = createMockUnit({ ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st06GquuuuuuxOmegaPsycommu001, createMockUnit({ traits: ["clan"] })],
          resourceArea: activeResources(5),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));
      expectSuccess(p1.enterBattle(unitId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getDamage(unitId)).toBe(0);
    });

    it("expires the granted First Strike at the end of the turn", () => {
      const pilot = machu();
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st06GquuuuuuxOmegaPsycommu001, createMockUnit({ traits: ["clan"] })],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));
      expect(p1.getVisibleCard(unitId)?.keywords).toContain("FirstStrike");
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("FirstStrike");
    });
  });
});
