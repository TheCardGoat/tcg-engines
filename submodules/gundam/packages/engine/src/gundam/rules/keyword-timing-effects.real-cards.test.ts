/**
 * Rules 13-2 keyword conformance using published cards as engine fixtures.
 * Card-local fixtures cover one printed result; this suite owns timing,
 * qualification, ownership, and turn-limit boundaries around the keywords.
 */

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
} from "../index.ts";
import { gd01Gamow127 } from "../../../../cards/src/cards/gd01/base/127-gamow.ts";
import { gd03GundamFlightForm036 } from "../../../../cards/src/cards/gd03/unit/036-gundam-flight-form.ts";
import { gd03GundamKyrios022 } from "../../../../cards/src/cards/gd03/unit/022-gundam-kyrios.ts";
import { st01KaiSResolve013 } from "../../../../cards/src/cards/st01/command/013-kai-s-resolve.ts";
import { st01UnforeseenIncident014 } from "../../../../cards/src/cards/st01/command/014-unforeseen-incident.ts";
import { st01SulettaMercury011 } from "../../../../cards/src/cards/st01/pilot/011-suletta-mercury.ts";
import { st01WhiteBase015 } from "../../../../cards/src/cards/st01/base/015-white-base.ts";
import { st02Tallgeese006 } from "../../../../cards/src/cards/st02/unit/006-tallgeese.ts";
import { st03Sinanju001 } from "../../../../cards/src/cards/st03/unit/001-sinanju.ts";
import { st05CgsMobileWorker003 } from "../../../../cards/src/cards/st05/unit/003-cgs-mobile-worker.ts";
import { st05MikazukiAugus010 } from "../../../../cards/src/cards/st05/pilot/010-mikazuki-augus.ts";
import { st07AllelujahHaptism012 } from "../../../../cards/src/cards/st07/pilot/012-allelujah-haptism.ts";
import { st09ForceImpulseGundam002 } from "../../../../cards/src/cards/st09/unit/002-force-impulse-gundam.ts";

function resolveBattle(engine: GundamTestEngine, attackerId: string, targetId: string): void {
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  expectSuccess(p1.enterBattle(attackerId, targetId));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
}

describe("keyword timing effects with published cards (rules 13-2)", () => {
  it("【Activate･Main】 resolves in Main and is unavailable in an Action Step", () => {
    const ally = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({ play: [st05CgsMobileWorker003, ally] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [workerId, allyId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.activateAbility(workerId!, 0, { targets: [allyId!] }));
    expect(p1.isExhausted(workerId!)).toBe(true);
    expect(p1.getDamage(allyId!)).toBe(1);

    const outsideMain = GundamTestEngine.create({ play: [st05CgsMobileWorker003] });
    const actionP1 = outsideMain.asPlayer(PLAYER_ONE);
    const actionP2 = outsideMain.asPlayer(PLAYER_TWO);
    const actionWorkerId = actionP1.getCardsInZone("battleArea")[0]!;
    expectSuccess(actionP1.passPhase());
    expectSuccess(actionP2.passActionStep());
    expectFailure(
      actionP1.activateAbility(actionWorkerId, 0, { targets: [actionWorkerId] }),
      "WRONG_PHASE",
    );
  });

  it("【Activate･Action】 rejects Main, then resolves its legal target during the Action Step", () => {
    const attacker = createMockUnit({ ap: 5, hp: 6, traits: ["zaft"] });
    const defender = createMockUnit({ ap: 0, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker], baseSection: [gd01Gamow127] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    expectFailure(p1.activateAbility(baseId, 0, { targets: [attackerId] }), "WRONG_PHASE");
    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.activateAbility(baseId, 0, { targets: [attackerId] }));
    expect(p1.isExhausted(baseId)).toBe(true);
    expect(p1.getVisibleCard(attackerId)?.keywords).toContain("Breach");
  });

  it("【Main】 is exclusive, while a real 【Main】/【Action】 Command is legal in Action", () => {
    const damaged = createMockUnit({ hp: 5 });
    const mainEngine = GundamTestEngine.create({
      hand: [st01KaiSResolve013],
      play: [{ card: damaged, damage: 3 }],
      resourceArea: activeResources(3),
    });
    const mainP1 = mainEngine.asPlayer(PLAYER_ONE);
    const damagedId = mainP1.getCardsInZone("battleArea")[0]!;
    expectSuccess(mainP1.playCommand(st01KaiSResolve013, { targets: [damagedId] }));
    expect(mainP1.getDamage(damagedId)).toBe(0);

    const mainOnlyInAction = GundamTestEngine.create({
      hand: [st01KaiSResolve013],
      play: [createMockUnit()],
      resourceArea: activeResources(3),
    });
    const actionP1 = mainOnlyInAction.asPlayer(PLAYER_ONE);
    const actionP2 = mainOnlyInAction.asPlayer(PLAYER_TWO);
    expectSuccess(actionP1.passPhase());
    expectSuccess(actionP2.passActionStep());
    expectFailure(actionP1.playCommand(st01KaiSResolve013), "WRONG_TIMING");

    const enemy = createMockUnit({ ap: 4, hp: 4 });
    const dual = GundamTestEngine.create(
      { hand: [st01UnforeseenIncident014], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const dualP1 = dual.asPlayer(PLAYER_ONE);
    const dualP2 = dual.asPlayer(PLAYER_TWO);
    const enemyId = dualP2.getCardsInZone("battleArea")[0]!;
    expectSuccess(dualP1.passPhase());
    expectSuccess(dualP2.passActionStep());
    expectSuccess(dualP1.playCommand(st01UnforeseenIncident014, { targets: [enemyId] }));
    expect(dualP2.getVisibleCard(enemyId)?.effectiveAp).toBe(1);
  });

  it("【Burst】 is optional and a chosen Burst Base resolves its 【Deploy】 effect after entering play", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const shield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st01WhiteBase015, shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected a Burst choice");
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
    expect(p2.getCardZone(st01WhiteBase015)).toBe(`baseSection:${PLAYER_TWO}`);
    expect(p2.getCardZone(shield)).toBe(`hand:${PLAYER_TWO}`);

    const declined = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st01WhiteBase015] },
    );
    const declineP1 = declined.asPlayer(PLAYER_ONE);
    const declineP2 = declined.asPlayer(PLAYER_TWO);
    expectSuccess(declineP1.enterBattle(declineP1.getCardsInZone("battleArea")[0]!, "direct"));
    expectSuccess(declineP2.passBlock());
    expectSuccess(declineP2.passBattleAction());
    expectSuccess(declineP1.passBattleAction());
    expectSuccess(declineP2.resolveEffect({ optionalAnswers: { [-1]: false } }));
    expect(declineP2.getCardZone(st01WhiteBase015)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("【Attack】 fires on declaration, and 【Once per Turn】 does not fire on the second attack", () => {
    const firstEnemy = createMockUnit({ ap: 0, hp: 20 });
    const secondEnemy = createMockUnit({ ap: 0, hp: 20 });
    const engine = GundamTestEngine.create(
      { hand: [st01SulettaMercury011], play: [st02Tallgeese006], resourceArea: activeResources(8) },
      {
        play: [
          { card: firstEnemy, exhausted: true },
          { card: secondEnemy, exhausted: true },
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const tallgeeseId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(st01SulettaMercury011, tallgeeseId));
    const paidResourceId = p1.getCardsInZone("resourceArea").find((id) => p1.isExhausted(id));
    if (!paidResourceId) throw new Error("Expected the Pair cost to rest a Resource");
    expectSuccess(p1.enterBattle(tallgeeseId, firstEnemyId!));
    expectSuccess(p1.resolveEffect({ targets: [paidResourceId] }));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.activateAbility(tallgeeseId, 0));
    expectSuccess(p1.enterBattle(tallgeeseId, secondEnemyId!));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("【Destroyed】 triggers from the trash and applies the real card's last-state target filter", () => {
    const eligible = createMockUnit({ name: "Sword Impulse Gundam", traits: ["minerva squad"] });
    const excluded = createMockUnit({
      name: "Force Impulse Gundam Spec II",
      traits: ["minerva squad"],
    });
    const attacker = createMockUnit({ ap: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [{ card: st09ForceImpulseGundam002, exhausted: true }], trash: [eligible, excluded] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const forceId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId] = p1.getCardsInZone("trash");
    expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, forceId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ legalTargetIds: [eligibleId] });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));
    expect(p1.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("【When Paired】 requires both controller groups, while 【During Pair】 needs no Link qualification", () => {
    const host = createMockUnit({ hp: 5 });
    const ally = createMockUnit({ hp: 5 });
    const enemy = createMockUnit({ hp: 5 });
    const pairEngine = GundamTestEngine.create(
      { hand: [st05MikazukiAugus010], play: [host, ally], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = pairEngine.asPlayer(PLAYER_ONE);
    const p2 = pairEngine.asPlayer(PLAYER_TWO);
    const [hostId, allyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(st05MikazukiAugus010, hostId!));
    expectFailure(p1.resolveEffect({ targets: [hostId!, allyId!] }), "WRONG_TARGET_COUNT");
    expectSuccess(p1.resolveEffect({ targets: [allyId!, enemyId] }));
    expect(p1.getDamage(allyId!)).toBe(1);
    expect(p2.getDamage(enemyId)).toBe(1);

    const ordinaryPilot = createMockPilot({ name: "Ordinary Pilot", level: 6, cost: 0 });
    const duringPair = GundamTestEngine.create({
      hand: [ordinaryPilot],
      play: [st03Sinanju001],
      resourceArea: activeResources(6),
    });
    const pairP1 = duringPair.asPlayer(PLAYER_ONE);
    const sinanjuId = pairP1.getCardsInZone("battleArea")[0]!;
    expect(pairP1.getVisibleCard(sinanjuId)?.keywords).not.toContain("HighManeuver");
    expectSuccess(pairP1.assignPilot(ordinaryPilot, sinanjuId));
    expect(pairP1.getVisibleCard(sinanjuId)?.keywords).toContain("HighManeuver");
  });

  it("【When Linked】 fires only on a matching Pilot, while 【During Link】 gates its later trigger", () => {
    const whenLinkedEnemy = createMockUnit({ hp: 4 });
    const matchingPilot = createMockPilot({ name: "Hathaway Noa", level: 5, cost: 0 });
    const linked = GundamTestEngine.create(
      { hand: [matchingPilot], play: [gd03GundamFlightForm036], resourceArea: activeResources(5) },
      { play: [whenLinkedEnemy] },
    );
    const linkedP1 = linked.asPlayer(PLAYER_ONE);
    const linkedP2 = linked.asPlayer(PLAYER_TWO);
    expectSuccess(linkedP1.assignPilot(matchingPilot, linkedP1.getCardsInZone("battleArea")[0]!));
    expect(linkedP2.getDamage(linkedP2.getCardsInZone("battleArea")[0]!)).toBe(1);

    const wrongPilot = createMockPilot({ name: "Lane Aim", level: 5, cost: 0 });
    const notLinked = GundamTestEngine.create(
      { hand: [wrongPilot], play: [gd03GundamFlightForm036], resourceArea: activeResources(5) },
      { play: [createMockUnit({ hp: 4 })] },
    );
    const notLinkedP1 = notLinked.asPlayer(PLAYER_ONE);
    const notLinkedP2 = notLinked.asPlayer(PLAYER_TWO);
    expectSuccess(
      notLinkedP1.assignPilot(wrongPilot, notLinkedP1.getCardsInZone("battleArea")[0]!),
    );
    expect(notLinkedP2.getDamage(notLinkedP2.getCardsInZone("battleArea")[0]!)).toBe(0);

    const defender = createMockUnit({ ap: 1, hp: 1, level: 2 });
    const lowLevelEnemy = createMockUnit({ ap: 2, hp: 5, level: 3 });
    const highLevelEnemy = createMockUnit({ ap: 2, hp: 5, level: 5 });
    const duringLink = GundamTestEngine.create(
      {
        hand: [st07AllelujahHaptism012],
        play: [gd03GundamKyrios022],
        resourceArea: activeResources(3),
      },
      { play: [{ card: defender, exhausted: true }, lowLevelEnemy, highLevelEnemy] },
    );
    const duringP1 = duringLink.asPlayer(PLAYER_ONE);
    const duringP2 = duringLink.asPlayer(PLAYER_TWO);
    const kyriosId = duringP1.getCardsInZone("battleArea")[0]!;
    const [defenderId, lowLevelId, highLevelId] = duringP2.getCardsInZone("battleArea");
    expectSuccess(duringP1.assignPilot(st07AllelujahHaptism012, kyriosId));
    resolveBattle(duringLink, kyriosId, defenderId!);
    expect(duringP2.getDamage(lowLevelId!)).toBe(1);
    expect(duringP2.getDamage(highLevelId!)).toBe(0);

    const unlinkedDefender = createMockUnit({ ap: 1, hp: 1, level: 2 });
    const unlinkedTarget = createMockUnit({ ap: 2, hp: 5, level: 3 });
    const ordinaryPilot = createMockPilot({ name: "Ordinary Pilot", level: 3, cost: 0 });
    const unlinked = GundamTestEngine.create(
      { hand: [ordinaryPilot], play: [gd03GundamKyrios022], resourceArea: activeResources(3) },
      { play: [{ card: unlinkedDefender, exhausted: true }, unlinkedTarget] },
    );
    const unlinkedP1 = unlinked.asPlayer(PLAYER_ONE);
    const unlinkedP2 = unlinked.asPlayer(PLAYER_TWO);
    const unlinkedKyriosId = unlinkedP1.getCardsInZone("battleArea")[0]!;
    const [unlinkedDefenderId, unlinkedTargetId] = unlinkedP2.getCardsInZone("battleArea");
    expectSuccess(unlinkedP1.assignPilot(ordinaryPilot, unlinkedKyriosId));
    resolveBattle(unlinked, unlinkedKyriosId, unlinkedDefenderId!);
    expect(unlinkedP2.getDamage(unlinkedTargetId!)).toBe(0);
  });

  it("【Once per Turn】 is per copy: another White Base can still activate this turn", () => {
    const engine = GundamTestEngine.create({
      baseSection: [st01WhiteBase015, st01WhiteBase015],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [firstBaseId, secondBaseId] = p1.getCardsInZone("baseSection");
    expectSuccess(p1.activateBaseAbility(firstBaseId!));
    expectFailure(p1.activateBaseAbility(firstBaseId!), "ABILITY_LIMIT_REACHED");
    expectSuccess(p1.activateBaseAbility(secondBaseId!));
    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
  });
});
