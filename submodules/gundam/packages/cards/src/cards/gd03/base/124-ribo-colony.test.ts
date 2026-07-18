import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03RiboColony124 } from "./124-ribo-colony.ts";

describe("Ribo Colony (GD03-124)", () => {
  it("lets its owner deploy it when its Burst is revealed by a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03RiboColony124] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstChoice = p2.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional" || burstChoice.controllerId !== PLAYER_TWO) {
      throw new Error("Expected Ribo Colony's public optional Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd03RiboColony124)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds one shield to its owner's hand when deployed", () => {
    const returnedShield = createMockUnit({
      cardNumber: "TEST-RETURNED-SHIELD",
      name: "Returned Shield",
    });
    const engine = GundamTestEngine.create({
      hand: [gd03RiboColony124],
      resourceArea: activeResources(3),
      shieldArea: [returnedShield],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03RiboColony124));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd03RiboColony124)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("offers only enemy Units with 3 or less HP after pairing a Lv.3 Pilot", () => {
    const pilot = createMockPilot({ level: 3 });
    const unit = createMockUnit();
    const eligibleEnemy = createMockUnit({ hp: 3 });
    const ineligibleEnemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [unit],
        baseSection: [gd03RiboColony124],
        resourceArea: activeResources(3),
      },
      { play: [eligibleEnemy, ineligibleEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleEnemyId, ineligibleEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, unitId));

    const prompt = p1.getBoardView().pendingChoice;
    if (prompt?.kind !== "targetSelection" || prompt.controllerId !== PLAYER_ONE) {
      throw new Error("Expected Ribo Colony's public enemy Unit choice");
    }
    expect(prompt.legalTargetIds).toEqual([eligibleEnemyId]);
    expect(prompt.legalTargetIds).not.toContain(ineligibleEnemyId);
    expectSuccess(p1.resolveEffect({ targets: [eligibleEnemyId!] }));
    expect(p2.isExhausted(eligibleEnemyId!)).toBe(true);
    expect(p2.isExhausted(ineligibleEnemyId!)).toBe(false);
  });

  it("does not trigger after pairing a Lv.4 Pilot", () => {
    const pilot = createMockPilot({ level: 4 });
    const unit = createMockUnit();
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [unit],
        baseSection: [gd03RiboColony124],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });

  it("does not trigger when the opponent pairs an eligible Pilot", () => {
    const pilot = createMockPilot({ level: 3 });
    const unit = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd03RiboColony124] },
      {
        hand: [pilot],
        play: [unit],
        resourceArea: activeResources(3),
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.assignPilot(pilot, unitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(unitId)).toBe(false);
  });

  it("triggers only once when two eligible Pilots are paired in the same turn", () => {
    const firstPilot = createMockPilot({ cardNumber: "TEST-PILOT-A", level: 3 });
    const secondPilot = createMockPilot({ cardNumber: "TEST-PILOT-B", level: 3 });
    const firstUnit = createMockUnit({ cardNumber: "TEST-UNIT-A" });
    const secondUnit = createMockUnit({ cardNumber: "TEST-UNIT-B" });
    const firstEnemy = createMockUnit({ cardNumber: "TEST-ENEMY-A", hp: 3 });
    const secondEnemy = createMockUnit({ cardNumber: "TEST-ENEMY-B", hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [firstPilot, secondPilot],
        play: [firstUnit, secondUnit],
        baseSection: [gd03RiboColony124],
        resourceArea: activeResources(6),
      },
      { play: [firstEnemy, secondEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstUnitId, secondUnitId] = p1.getCardsInZone("battleArea");
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(firstPilot, firstUnitId!));
    const firstChoice = p1.getBoardView().pendingChoice;
    if (firstChoice?.kind !== "targetSelection") {
      throw new Error("Expected Ribo Colony's first enemy Unit choice");
    }
    expect(firstChoice.legalTargetIds).toEqual(
      expect.arrayContaining([firstEnemyId, secondEnemyId]),
    );
    expectSuccess(p1.resolveEffect({ targets: [firstEnemyId!] }));
    expectSuccess(p1.assignPilot(secondPilot, secondUnitId!));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(firstEnemyId!)).toBe(true);
    expect(p2.isExhausted(secondEnemyId!)).toBe(false);
  });
});
