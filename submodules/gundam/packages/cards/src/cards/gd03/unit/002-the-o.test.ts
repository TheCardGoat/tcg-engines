import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03TheO002 } from "./002-the-o.ts";
import { gd03Messala003 } from "./003-messala.ts";

describe("The-O (GD03-002)", () => {
  it("<Repair 3> recovers 3 HP at the end of its controller's turn", () => {
    const engine = GundamTestEngine.create({ play: [{ card: gd03TheO002, damage: 4 }] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(unitId)).toBe(1);
  });

  it("rests an enemy Unit whose level is not higher when another friendly Repair Unit attacks", () => {
    const repairAttacker = gd03Messala003;
    const legalEnemy = createMockUnit({ name: "Lv.3 Enemy", level: 3, ap: 1, hp: 5 });
    const battleTarget = createMockUnit({ name: "Lv.7 Defender", level: 7, ap: 1, hp: 5 });
    const pilot = createMockPilot({ name: "Test Pilot", cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03TheO002, repairAttacker],
        resourceArea: activeResources(7),
      },
      { play: [legalEnemy, { card: battleTarget, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.assignPilot(pilot, gd03TheO002));

    const [legalEnemyId, battleTargetId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    expectSuccess(p1.enterBattle(repairAttacker, battleTargetId!));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [legalEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [legalEnemyId!] }));

    expect(engine.asPlayer(PLAYER_TWO).isExhausted(legalEnemyId!)).toBe(true);
  });

  it("does not rest an enemy Unit when The-O itself attacks", () => {
    const legalEnemy = createMockUnit({ name: "Lv.7 Enemy", level: 7, ap: 1, hp: 8 });
    const battleTarget = createMockUnit({ name: "Battle Target", level: 7, ap: 1, hp: 8 });
    const pilot = createMockPilot({ name: "Test Pilot", cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03TheO002],
        resourceArea: activeResources(7),
      },
      { play: [legalEnemy, { card: battleTarget, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.assignPilot(pilot, gd03TheO002));
    const [theOId] = p1.getCardsInZone("battleArea");
    const [legalEnemyId, battleTargetId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(theOId!, battleTargetId!));

    expect(p2.isExhausted(legalEnemyId!)).toBe(false);
  });

  it("does not trigger for another Repair Unit while The-O is not paired", () => {
    const legalEnemy = createMockUnit({ level: 3, hp: 5 });
    const battleTarget = createMockUnit({ level: 7, ap: 1, hp: 8 });
    const engine = GundamTestEngine.create(
      { play: [gd03TheO002, gd03Messala003] },
      { play: [legalEnemy, { card: battleTarget, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const repairAttackerId = p1.getCardsInZone("battleArea")[1]!;
    const [legalEnemyId, battleTargetId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(repairAttackerId, battleTargetId!));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(legalEnemyId!)).toBe(false);
  });
});
