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
import { gd01Kshatriya044 } from "./044-kshatriya.ts";

describe("Kshatriya (GD01-044)", () => {
  it("offers one or two enemy Units and damages both chosen targets after pairing a Newtype Pilot", () => {
    const marida = createMockPilot({
      name: "Marida Cruz",
      traits: ["newtype"],
      level: 1,
      cost: 1,
    });
    const firstEnemy = createMockUnit({ hp: 6 });
    const secondEnemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Kshatriya044, marida],
        deck: 2,
        resourceArea: activeResources(5),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [firstEnemy, secondEnemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(firstEnemyId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectSuccess(p1.deployUnit(gd01Kshatriya044));
    const kshatriyaId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(marida, kshatriyaId));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstEnemyId, secondEnemyId]),
      minTargets: 1,
      maxTargets: 2,
    });
    expectSuccess(p1.resolveEffect({ targets: [firstEnemyId!, secondEnemyId!] }));

    expect(p2.getDamage(firstEnemyId!)).toBe(1);
    expect(p2.getDamage(secondEnemyId!)).toBe(1);
    expectSuccess(p1.enterBattle(kshatriyaId, firstEnemyId!));
  });

  it("accepts the Cyber-Newtype qualification and lets the player choose only one enemy", () => {
    const cyberNewtype = createMockPilot({ traits: ["cyber-newtype"], level: 1, cost: 1 });
    const firstEnemy = createMockUnit({ hp: 5 });
    const secondEnemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [cyberNewtype],
        play: [gd01Kshatriya044],
        resourceArea: activeResources(1),
      },
      { play: [firstEnemy, secondEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const kshatriyaId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(cyberNewtype, kshatriyaId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      minTargets: 1,
      maxTargets: 2,
    });
    expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

    expect(p2.getDamage(firstEnemyId!)).toBe(0);
    expect(p2.getDamage(secondEnemyId!)).toBe(1);
  });

  it("does not offer damage targets after pairing an unrelated Pilot", () => {
    const unrelatedPilot = createMockPilot({ traits: ["coordinator"], level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [unrelatedPilot],
        play: [gd01Kshatriya044],
        resourceArea: activeResources(1),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const kshatriyaId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(unrelatedPilot, kshatriyaId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });
});
