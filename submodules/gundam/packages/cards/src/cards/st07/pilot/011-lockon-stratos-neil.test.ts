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
import { st07LockonStratosNeil011 } from "./011-lockon-stratos-neil.ts";

describe("Lockon Stratos (Neil) (ST07-011)", () => {
  it("accepts Burst and adds itself to hand", () => {
    const engine = GundamTestEngine.create(
      { play: [createMockUnit()] },
      { shieldArea: [st07LockonStratosNeil011] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected Burst choice");
    expect(burst).toMatchObject({ controllerId: PLAYER_TWO });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
    expect(p2.getCardZone(burst.sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("declines Burst and puts itself in trash", () => {
    const engine = GundamTestEngine.create(
      { play: [createMockUnit()] },
      { shieldArea: [st07LockonStratosNeil011] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected Burst choice");
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));
    expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("pairs for Lv.4/cost1 and grants +1 AP/+2 HP", () => {
    const engine = GundamTestEngine.create({
      hand: [st07LockonStratosNeil011],
      play: [createMockUnit({ ap: 2, hp: 3 })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const id = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07LockonStratosNeil011, id));
    expect(p1.getVisibleCard(id)).toMatchObject({ effectiveAp: 3, effectiveHp: 5 });
  });

  it("requires Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [st07LockonStratosNeil011],
      play: [createMockUnit()],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectFailure(
      p1.assignPilot(st07LockonStratosNeil011, p1.getCardsInZone("battleArea")[0]!),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires one active resource", () => {
    const engine = GundamTestEngine.create({
      hand: [st07LockonStratosNeil011],
      play: [createMockUnit()],
      resourceArea: restedResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectFailure(
      p1.assignPilot(st07LockonStratosNeil011, p1.getCardsInZone("battleArea")[0]!),
      "INSUFFICIENT_RESOURCES",
    );
  });

  it("lets its paired CB Unit attack an active enemy at exactly its own level", () => {
    const host = createMockUnit({ traits: ["cb"], level: 4, hp: 8 });
    const eligible = createMockUnit({ level: 4, hp: 8 });
    const engine = GundamTestEngine.create(
      { hand: [st07LockonStratosNeil011], play: [host], resourceArea: activeResources(4) },
      { play: [eligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07LockonStratosNeil011, hostId));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getLegalAttackTargets(hostId)).toContain(enemyId);
    expectSuccess(p1.enterBattle(hostId, enemyId));
  });

  it("excludes an active enemy above the paired Unit's level", () => {
    const host = createMockUnit({ traits: ["cb"], level: 4, hp: 8 });
    const eligible = createMockUnit({ level: 4, hp: 8 });
    const tooHigh = createMockUnit({ level: 5, hp: 8 });
    const engine = GundamTestEngine.create(
      { hand: [st07LockonStratosNeil011], play: [host], resourceArea: activeResources(4) },
      { play: [eligible, tooHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, highId] = p2.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(st07LockonStratosNeil011, hostId));
    expect(p1.getLegalAttackTargets(hostId)).toContain(eligibleId);
    expect(p1.getLegalAttackTargets(hostId)).not.toContain(highId);
    expectFailure(p1.enterBattle(hostId, highId!), "INVALID_TARGET");
  });

  it("does not grant the permission when paired to a non-CB Unit", () => {
    const host = createMockUnit({ traits: ["zeon"], level: 4, hp: 8 });
    const enemy = createMockUnit({ level: 4, hp: 8 });
    const engine = GundamTestEngine.create(
      { hand: [st07LockonStratosNeil011], play: [host], resourceArea: activeResources(4), deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07LockonStratosNeil011, hostId));
    expect(p1.getLegalAttackTargets(hostId)).not.toContain(enemyId);
  });

  it("grants the permission only to the paired Unit", () => {
    const host = createMockUnit({ traits: ["cb"], level: 4 });
    const other = createMockUnit({ traits: ["cb"], level: 4 });
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [st07LockonStratosNeil011], play: [host, other], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, otherId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07LockonStratosNeil011, hostId!));
    expect(p1.getLegalAttackTargets(hostId!)).toContain(enemyId);
    expect(p1.getLegalAttackTargets(otherId!)).not.toContain(enemyId);
  });

  it("expires the active-target permission at the end of the turn", () => {
    const host = createMockUnit({ traits: ["cb"], level: 4 });
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [st07LockonStratosNeil011], play: [host], resourceArea: activeResources(4), deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st07LockonStratosNeil011, hostId));
    expect(p1.getLegalAttackTargets(hostId)).toContain(enemyId);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());
    expect(p1.getLegalAttackTargets(hostId)).not.toContain(enemyId);
  });
});
