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
import { gd0113thTacticalTestingSector130 } from "./130-13th-tactical-testing-sector.ts";

describe("13th Tactical Testing Sector (GD01-130)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd0113thTacticalTestingSector130] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd0113thTacticalTestingSector130)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds one Shield to hand", () => {
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd0113thTacticalTestingSector130],
      shieldArea: [returnedShield],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd0113thTacticalTestingSector130));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("【Activate･Main】 asks for an enemy Unit, applies AP-1, and rests the Base", () => {
    const academy = createMockUnit({ traits: ["academy"] });
    const firstEnemy = createMockUnit({ ap: 4 });
    const secondEnemy = createMockUnit({ ap: 5 });
    const engine = GundamTestEngine.create(
      { play: [academy], baseSection: [gd0113thTacticalTestingSector130] },
      { play: [firstEnemy, secondEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const academyId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.activateAbility(baseId, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstEnemyId, secondEnemyId]),
    });
    expectFailure(p1.resolveEffect({ targets: [academyId] }), "ILLEGAL_TARGET");
    expectSuccess(p1.resolveEffect({ targets: [firstEnemyId!] }));

    expect(p2.getVisibleCard(firstEnemyId!)?.effectiveAp).toBe(3);
    expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(5);
    expect(p1.isExhausted(baseId)).toBe(true);
  });

  it("cannot activate without a friendly Academy Unit", () => {
    const enemy = createMockUnit({ ap: 4 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd0113thTacticalTestingSector130] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectFailure(p1.activateAbility(baseId, 0), "CONDITIONS_NOT_MET");

    expect(p1.isExhausted(baseId)).toBe(false);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("cannot activate in a legally reached Action step", () => {
    const academy = createMockUnit({ traits: ["academy"] });
    const engine = GundamTestEngine.create({
      play: [academy],
      baseSection: [gd0113thTacticalTestingSector130],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.activateAbility(baseId, 0), "WRONG_PHASE");
  });
});
