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
import { st06RedGundam005 } from "./005-red-gundam.ts";

describe("Red Gundam (ST06-005)", () => {
  it("deploys with printed 4 AP/3 HP for Lv.4 and cost 3", () => {
    const engine = GundamTestEngine.create({
      hand: [st06RedGundam005],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(st06RedGundam005));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4, effectiveHp: 3 });
    expect(p1.getVisibleCard(unitId)?.keywords).toContain("Breach");
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
  });

  it("cannot deploy below Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [st06RedGundam005],
      resourceArea: activeResources(3),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st06RedGundam005),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("cannot deploy without three active resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st06RedGundam005],
      resourceArea: restedResources(4),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st06RedGundam005),
      "INSUFFICIENT_RESOURCES",
    );
  });

  describe("【Attack】Choose 1 to 2 friendly Clan Units; they get AP+2 this turn", () => {
    it("publishes the exact Clan-only one-to-two target choice", () => {
      const clanAlly = createMockUnit({ traits: ["clan"], ap: 2 });
      const otherClan = createMockUnit({ traits: ["clan"], ap: 3 });
      const nonClan = createMockUnit({ traits: ["zeon"], ap: 4 });
      const enemy = createMockUnit({ traits: ["clan"], hp: 10 });
      const engine = GundamTestEngine.create(
        { play: [st06RedGundam005, clanAlly, otherClan, nonClan] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [redId, clanId, otherClanId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(redId!, enemyId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: redId,
        minTargets: 1,
        maxTargets: 2,
        legalTargetIds: [redId, clanId, otherClanId],
      });
    });

    it("buffs exactly one chosen Clan Unit by AP+2", () => {
      const ally = createMockUnit({ traits: ["clan"], ap: 2 });
      const enemy = createMockUnit({ hp: 10 });
      const engine = GundamTestEngine.create(
        { play: [st06RedGundam005, ally] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [redId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(redId!, p2.getCardsInZone("battleArea")[0]!));
      expectSuccess(p1.resolveEffect({ targets: [allyId!] }));

      expect(p1.getVisibleCard(redId!)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(allyId!)).toMatchObject({ effectiveAp: 4 });
    });

    it("buffs two chosen Clan Units and no others", () => {
      const first = createMockUnit({ traits: ["clan"], ap: 2 });
      const second = createMockUnit({ traits: ["clan"], ap: 3 });
      const enemy = createMockUnit({ hp: 10 });
      const engine = GundamTestEngine.create(
        { play: [st06RedGundam005, first, second] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [redId, firstId, secondId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(redId!, p2.getCardsInZone("battleArea")[0]!));
      expectSuccess(p1.resolveEffect({ targets: [firstId!, secondId!] }));

      expect(p1.getVisibleCard(redId!)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(firstId!)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(secondId!)).toMatchObject({ effectiveAp: 5 });
    });

    it("requires at least one target", () => {
      const engine = GundamTestEngine.create(
        { play: [st06RedGundam005] },
        { play: [{ card: createMockUnit({ hp: 10 }), exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const redId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(redId, p2.getCardsInZone("battleArea")[0]!));
      expectFailure(p1.resolveEffect({ targets: [] }), "WRONG_TARGET_COUNT");
    });

    it("rejects a friendly Unit without Clan", () => {
      const nonClan = createMockUnit({ traits: ["zeon"] });
      const engine = GundamTestEngine.create(
        { play: [st06RedGundam005, nonClan] },
        { play: [{ card: createMockUnit({ hp: 10 }), exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [redId, nonClanId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(redId!, p2.getCardsInZone("battleArea")[0]!));
      expectFailure(p1.resolveEffect({ targets: [nonClanId!] }), "ILLEGAL_TARGET");
    });

    it("expires the AP bonus at the end of the turn", () => {
      const ally = createMockUnit({ traits: ["clan"], ap: 2 });
      const enemy = createMockUnit({ ap: 0, hp: 10 });
      const engine = GundamTestEngine.create(
        { play: [st06RedGundam005, ally] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [redId, allyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(redId!, enemyId));
      expectSuccess(p1.resolveEffect({ targets: [allyId!] }));
      expect(p1.getVisibleCard(allyId!)).toMatchObject({ effectiveAp: 4 });
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(allyId!)).toMatchObject({ effectiveAp: 2 });
    });
  });

  describe("<Breach 1>", () => {
    it("destroys one Shield after its attack destroys an enemy Unit", () => {
      const defender = createMockUnit({ ap: 0, hp: 3 });
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create(
        { play: [st06RedGundam005] },
        { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const redId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(redId, defenderId));
      expectSuccess(p1.resolveEffect({ targets: [redId] }));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
      expect(p2.getCardsInZone("trash")).toHaveLength(2);
    });

    it("does not damage a Shield when the enemy Unit survives", () => {
      const defender = createMockUnit({ ap: 0, hp: 10 });
      const engine = GundamTestEngine.create(
        { play: [st06RedGundam005] },
        { play: [{ card: defender, exhausted: true }], shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const redId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(redId, p2.getCardsInZone("battleArea")[0]!));
      expectSuccess(p1.resolveEffect({ targets: [redId] }));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
    });
  });
});
