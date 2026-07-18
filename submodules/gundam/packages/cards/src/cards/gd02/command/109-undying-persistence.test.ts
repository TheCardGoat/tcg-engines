import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02UndyingPersistence109 } from "./109-undying-persistence.ts";

describe("Undying Persistence (GD02-109)", () => {
  it("【Main】 deals 1 damage to the chosen enemy Unit", () => {
    const friendly = createMockUnit({ hp: 5 });
    const firstEnemy = createMockUnit({ hp: 5 });
    const secondEnemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02UndyingPersistence109],
        play: [friendly],
        resourceArea: activeResources(4),
      },
      { play: [firstEnemy, secondEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible enemy Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([firstEnemyId, secondEnemyId]);
    expect(choice.legalTargetIds).not.toContain(friendlyId);
    expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

    expect(p2.getDamage(firstEnemyId!)).toBe(0);
    expect(p2.getDamage(secondEnemyId!)).toBe(1);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can deal damage during a legally reached Action step", () => {
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd02UndyingPersistence109], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd02UndyingPersistence109));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected an enemy Unit choice");
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(1);
  });

  it("can be paired as Shiiko Sugai instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02UndyingPersistence109],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 5 });
  });

  it("enforces its printed Lv.4 and active Resource cost 1", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02UndyingPersistence109],
      resourceArea: activeResources(3),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02UndyingPersistence109),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02UndyingPersistence109)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 4,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create(
      { hand: [setup, gd02UndyingPersistence109], resourceArea: activeResources(4) },
      { play: [createMockUnit()] },
    );
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02UndyingPersistence109), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02UndyingPersistence109)).toBe(`hand:${PLAYER_ONE}`);
  });
});
