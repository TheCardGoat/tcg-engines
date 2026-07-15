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
import { gd03PrivilegedPosition102 } from "../../gd03/command/102-privileged-position.ts";
import { gd01InterceptOrders099 } from "../command/099-intercept-orders.ts";
import { gd01YzakJule094 } from "./094-yzak-jule.ts";

describe("Yzak Jule (GD01-094)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd01YzakJule094] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01YzakJule094)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("draws 1 when the attacking paired Unit destroys an enemy Link Unit with battle damage", () => {
    const yzakHost = createMockUnit({ name: "Yzak Host", ap: 4, hp: 6 });
    const enemyPilot = createMockPilot({ name: "Enemy Pilot", level: 1, cost: 1 });
    const enemyHost = createMockUnit({
      name: "Enemy Link Host",
      ap: 1,
      hp: 4,
      linkCondition: "[Enemy Pilot]",
    });
    const shield = createMockUnit({ name: "Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01YzakJule094],
        play: [yzakHost],
        shieldArea: [shield],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {
        hand: [enemyPilot],
        play: [enemyHost],
        resourceArea: activeResources(2),
        deck: 5,
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const yzakHostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyHostId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.assignPilot(enemyPilot, enemyHostId));
    expectSuccess(p2.enterBattle(enemyHostId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.assignPilot(gd01YzakJule094, yzakHostId));
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
    const handBefore = p1.getHand().length;

    expectSuccess(p1.enterBattle(yzakHostId, enemyHostId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(enemyHostId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
    expect(p1.getHand()).toHaveLength(handBefore + 1);
  });

  it("does not draw when the destroyed enemy Unit is not a Link Unit", () => {
    const yzakHost = createMockUnit({ ap: 4, hp: 6 });
    const enemy = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01YzakJule094, gd01InterceptOrders099],
        play: [yzakHost],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const yzakHostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01YzakJule094, yzakHostId));
    expectSuccess(p1.playCommand(gd01InterceptOrders099));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected Intercept Orders to ask which enemy Unit to rest");
    }
    expect(restChoice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
    expectSuccess(p1.enterBattle(yzakHostId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
  });

  it("draws at most once after destroying two enemy Link Units during the same turn", () => {
    const yzakHost = createMockUnit({
      name: "Titans Yzak Host",
      traits: ["titans"],
      ap: 3,
      hp: 6,
      linkCondition: "[Yzak Jule]",
    });
    const firstPilot = createMockPilot({ name: "First Enemy Pilot", level: 1, cost: 1 });
    const secondPilot = createMockPilot({ name: "Second Enemy Pilot", level: 1, cost: 1 });
    const firstEnemy = createMockUnit({
      name: "First Enemy Link Host",
      ap: 1,
      hp: 3,
      linkCondition: "[First Enemy Pilot]",
    });
    const secondEnemy = createMockUnit({
      name: "Second Enemy Link Host",
      ap: 1,
      hp: 3,
      linkCondition: "[Second Enemy Pilot]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01YzakJule094, gd03PrivilegedPosition102],
        play: [yzakHost],
        shieldArea: [createMockUnit({ name: "Shield A" }), createMockUnit({ name: "Shield B" })],
        resourceArea: activeResources(6),
        deck: 5,
      },
      {
        hand: [firstPilot, secondPilot],
        play: [firstEnemy, secondEnemy],
        resourceArea: activeResources(2),
        deck: 5,
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const yzakHostId = p1.getCardsInZone("battleArea")[0]!;
    const [yzakId, readyCommandId] = p1.getHand();
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
    const [firstPilotId, secondPilotId] = p2.getHand();

    expectSuccess(p2.assignPilot(firstPilotId!, firstEnemyId!));
    expectSuccess(p2.assignPilot(secondPilotId!, secondEnemyId!));
    for (const enemyId of [firstEnemyId!, secondEnemyId!]) {
      expectSuccess(p2.enterBattle(enemyId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
    }
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.assignPilot(yzakId!, yzakHostId));
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.enterBattle(yzakHostId, firstEnemyId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.playCommand(readyCommandId!));
    const readyChoice = p1.getBoardView().pendingChoice;
    if (readyChoice?.kind !== "targetSelection") {
      throw new Error(
        "Expected Privileged Position to ask which battling Titans Link Unit to ready",
      );
    }
    expect(readyChoice.legalTargetIds).toEqual([yzakHostId]);
    expectSuccess(p1.resolveEffect({ targets: [yzakHostId] }));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.isExhausted(yzakHostId)).toBe(false);

    expectSuccess(p1.enterBattle(yzakHostId, secondEnemyId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(firstEnemyId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(secondEnemyId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
  });
});
