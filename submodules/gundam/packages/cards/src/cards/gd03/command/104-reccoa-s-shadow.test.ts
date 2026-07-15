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
} from "@tcg/gundam-engine";
import { gd03ReccoaSShadow104 } from "./104-reccoa-s-shadow.ts";

describe("Reccoa's Shadow (GD03-104)", () => {
  it("【Main】 rests an enemy Unit with 3 or less HP", () => {
    const eligibleEnemy = createMockUnit({ hp: 3 });
    const highHpEnemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03ReccoaSShadow104], resourceArea: activeResources(3) },
      { play: [eligibleEnemy, highHpEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const [eligibleEnemyId, highHpEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(commandId, { targets: [eligibleEnemyId!] }));

    expect(p2.isExhausted(eligibleEnemyId!)).toBe(true);
    expect(p2.isExhausted(highHpEnemyId!)).toBe(false);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("【Action】 rests an eligible enemy Unit during battle", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const actionTarget = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd03ReccoaSShadow104], resourceArea: activeResources(3) },
      { play: [attacker, actionTarget] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, actionTargetId] = p2.getCardsInZone("battleArea");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p2.enterBattle(attackerId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(commandId, { targets: [actionTargetId!] }));

    expect(p2.isExhausted(actionTargetId!)).toBe(true);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("rests 2 eligible enemies when a friendly Jupitris Link Unit is in play", () => {
    const pilot = createMockPilot({ name: "Jupitris Pilot", cost: 1 });
    const jupitrisHost = createMockUnit({
      traits: ["jupitris"],
      linkCondition: "[Jupitris Pilot]",
    });
    const enemyA = createMockUnit({ hp: 3 });
    const enemyB = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, gd03ReccoaSShadow104],
        play: [jupitrisHost],
        resourceArea: activeResources(4),
      },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [enemyAId, enemyBId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, hostId));
    const commandId = p1.getHand()[0]!;
    expectSuccess(p1.playCommand(commandId, { targets: [enemyAId!, enemyBId!] }));

    expect(p2.isExhausted(enemyAId!)).toBe(true);
    expect(p2.isExhausted(enemyBId!)).toBe(true);
  });

  it("rejects an enemy Unit with more than 3 HP", () => {
    const highHpEnemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03ReccoaSShadow104], resourceArea: activeResources(3) },
      { play: [highHpEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INVALID_TARGET");

    expect(p2.isExhausted(enemyId)).toBe(false);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("can be paired as Reccoa Londe instead of activating the Command effect", () => {
    const host = createMockUnit({ ap: 2, hp: 4, linkCondition: "[Reccoa Londe]" });
    const engine = GundamTestEngine.create({
      hand: [gd03ReccoaSShadow104],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });
});
