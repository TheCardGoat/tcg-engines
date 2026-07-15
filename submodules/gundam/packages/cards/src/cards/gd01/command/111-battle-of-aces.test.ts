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
import { gd01ZeonRemnantForces115 } from "./115-zeon-remnant-forces.ts";
import { gd01StrategicArms108 } from "./108-strategic-arms.ts";
import { gd01BattleOfAces111 } from "./111-battle-of-aces.ts";

describe("Battle of Aces (GD01-111)", () => {
  it("【Burst】 asks for an enemy Unit and deals 2 damage to the chosen target", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const otherEnemy = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd01BattleOfAces111] },
      { play: [attacker, otherEnemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, otherEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(attackerId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([attackerId, otherEnemyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [otherEnemyId!] }));

    expect(p2.getDamage(attackerId!)).toBe(0);
    expect(p2.getDamage(otherEnemyId!)).toBe(2);
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
  });

  it("【Main】 deals 3 damage to an enemy Unit damaged by a prior legal effect", () => {
    const enemy = createMockUnit({ hp: 7 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ZeonRemnantForces115, gd01BattleOfAces111],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const [setupCommandId, battleOfAcesId] = p1.getHand();

    expectSuccess(p1.playCommand(setupCommandId!));
    const setupChoice = p1.getBoardView().pendingChoice;
    if (setupChoice?.kind !== "targetSelection") {
      throw new Error("Expected Zeon Remnant Forces to ask which enemy Unit receives damage");
    }
    expect(setupChoice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expect(p2.getDamage(enemyId)).toBe(1);
    expectSuccess(p1.playCommand(battleOfAcesId!));
    const damageChoice = p1.getBoardView().pendingChoice;
    if (damageChoice?.kind !== "targetSelection") {
      throw new Error("Expected Battle of Aces to ask which damaged enemy Unit receives damage");
    }
    expect(damageChoice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(4);
    expect(p1.getCardZone(battleOfAcesId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can deal 3 damage during a legally reached Action step", () => {
    const enemy = createMockUnit({ hp: 7 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ZeonRemnantForces115, gd01BattleOfAces111],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const [setupCommandId, battleOfAcesId] = p1.getHand();

    expectSuccess(p1.playCommand(setupCommandId!));
    const setupChoice = p1.getBoardView().pendingChoice;
    if (setupChoice?.kind !== "targetSelection") {
      throw new Error("Expected Zeon Remnant Forces to ask which enemy Unit receives damage");
    }
    expect(setupChoice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(battleOfAcesId!));
    const damageChoice = p1.getBoardView().pendingChoice;
    if (damageChoice?.kind !== "targetSelection") {
      throw new Error("Expected Battle of Aces to ask which damaged enemy Unit receives damage");
    }
    expect(damageChoice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(4);
  });

  it("rejects an undamaged enemy Unit and a damaged friendly Unit", () => {
    const friendly = createMockUnit({ hp: 5, keywordEffects: [{ keyword: "Blocker" }] });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01StrategicArms108, gd01BattleOfAces111],
        play: [friendly],
        resourceArea: activeResources(8),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    const [setupCommandId, battleOfAcesId] = p1.getHand();

    expectSuccess(p1.playCommand(setupCommandId!));
    expect(p1.getDamage(friendlyId)).toBe(2);
    expectFailure(p1.playCommand(battleOfAcesId!, { targets: [enemyId] }), "INVALID_TARGET");
    expectFailure(p1.playCommand(battleOfAcesId!, { targets: [friendlyId] }), "INVALID_TARGET");
  });

  it("cannot be played below its printed Lv.3 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01BattleOfAces111],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01BattleOfAces111), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01BattleOfAces111)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves only 1 active Resource", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 2,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [],
          sourceText: "【Main】Do nothing.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [setup, gd01BattleOfAces111],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
