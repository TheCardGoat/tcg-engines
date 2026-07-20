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
import { st06OrtegaSRickDomGq007 } from "./007-ortega-s-rick-dom-gq.ts";

describe("Ortega's Rick Dom (GQ) (ST06-007)", () => {
  it("deploys as its printed Lv.3 cost 2 AP3 HP2 Unit", () => {
    const engine = GundamTestEngine.create({
      hand: [st06OrtegaSRickDomGq007],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(st06OrtegaSRickDomGq007));

    const ortegaId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(ortegaId)).toMatchObject({ effectiveAp: 3, effectiveHp: 2 });
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("cannot deploy below Lv.3 or without two active Resources", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [st06OrtegaSRickDomGq007],
      resourceArea: activeResources(2),
    }).asPlayer(PLAYER_ONE);
    expectFailure(lowLevel.deployUnit(st06OrtegaSRickDomGq007), "INSUFFICIENT_RESOURCE_LEVEL");

    const noPayment = GundamTestEngine.create({
      hand: [st06OrtegaSRickDomGq007],
      resourceArea: restedResources(3),
    }).asPlayer(PLAYER_ONE);
    expectFailure(noPayment.deployUnit(st06OrtegaSRickDomGq007), "INSUFFICIENT_RESOURCES");
  });

  it("offers only another friendly Clan Unit, then grants it the printed active AP3 target", () => {
    const clan = createMockUnit({ name: "Clan Ally", traits: ["clan"] });
    const nonClan = createMockUnit({ name: "Other Ally", traits: ["zeon"] });
    const eligibleEnemy = createMockUnit({ name: "Eligible Enemy", ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st06OrtegaSRickDomGq007],
        play: [clan, nonClan],
        resourceArea: activeResources(3),
      },
      { play: [eligibleEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [clanId, nonClanId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(st06OrtegaSRickDomGq007));
    const ortegaId = p1.getCardsInZone("battleArea")[2]!;
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: ortegaId,
      legalTargetIds: [clanId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [clanId!] }));

    expect(p1.getLegalAttackTargets(clanId!)).toContain(enemyId);
    expect(p1.getLegalAttackTargets(nonClanId!)).not.toContain(enemyId);
    expect(p1.getLegalAttackTargets(ortegaId)).not.toContain(enemyId);
    expectSuccess(p1.enterBattle(clanId!, enemyId));
  });

  it("rejects the source, a non-Clan ally, and an enemy Clan Unit as the chosen attacker", () => {
    const clan = createMockUnit({ traits: ["clan"] });
    const nonClan = createMockUnit({ traits: ["zeon"] });
    const enemyClan = createMockUnit({ traits: ["clan"] });
    const engine = GundamTestEngine.create(
      {
        hand: [st06OrtegaSRickDomGq007],
        play: [clan, nonClan],
        resourceArea: activeResources(3),
      },
      { play: [enemyClan] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, nonClanId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(st06OrtegaSRickDomGq007));
    const sourceId = p1.getCardsInZone("battleArea")[2]!;
    expectFailure(p1.resolveEffect({ targets: [sourceId] }), "ILLEGAL_TARGET");
    expectFailure(p1.resolveEffect({ targets: [nonClanId!] }), "ILLEGAL_TARGET");
    expectFailure(p1.resolveEffect({ targets: [enemyId] }), "ILLEGAL_TARGET");
  });

  it("does not grant an active enemy Unit with more than 3 AP or a rested enemy Unit", () => {
    const clan = createMockUnit({ traits: ["clan"] });
    const tooStrong = createMockUnit({ ap: 4, hp: 5 });
    const alreadyRested = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [st06OrtegaSRickDomGq007], play: [clan], resourceArea: activeResources(3) },
      { play: [tooStrong, { card: alreadyRested, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const clanId = p1.getCardsInZone("battleArea")[0]!;
    const [tooStrongId, restedId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(st06OrtegaSRickDomGq007, { targets: [clanId] }));

    expect(p1.getLegalAttackTargets(clanId)).not.toContain(tooStrongId);
    expect(p1.getLegalAttackTargets(clanId)).toContain(restedId);
    expectFailure(p1.enterBattle(clanId, tooStrongId!), "INVALID_TARGET");
  });

  it("expires the special active-Unit attack option at the end of the turn", () => {
    const clan = createMockUnit({ traits: ["clan"] });
    const enemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st06OrtegaSRickDomGq007],
        play: [clan],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const clanId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(st06OrtegaSRickDomGq007, { targets: [clanId] }));
    expect(p1.getLegalAttackTargets(clanId)).toContain(enemyId);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getLegalAttackTargets(clanId)).not.toContain(enemyId);
  });
});
