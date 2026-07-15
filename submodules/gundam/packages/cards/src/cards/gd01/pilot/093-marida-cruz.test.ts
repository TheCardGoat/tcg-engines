import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01InterceptOrders099 } from "../command/099-intercept-orders.ts";
import { gd01MaridaCruz093 } from "./093-marida-cruz.ts";

describe("Marida Cruz (GD01-093)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01MaridaCruz093] },
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

    expect(p2.getCardZone(gd01MaridaCruz093)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【During Link】【Attack】 offers only enemy Units at or below the linked Unit's Lv.", () => {
    const host = createMockUnit({ level: 4, ap: 2, hp: 5, linkCondition: "[Marida Cruz]" });
    const lowEnemy = createMockUnit({ name: "Low Enemy", level: 3, ap: 1, hp: 3 });
    const highEnemy = createMockUnit({ name: "High Enemy", level: 5, ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01MaridaCruz093, gd01InterceptOrders099],
        play: [host],
        resourceArea: activeResources(4),
      },
      {
        play: [lowEnemy, highEnemy],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [lowEnemyId, highEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd01MaridaCruz093, hostId));
    expectSuccess(p1.playCommand(gd01InterceptOrders099));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected Intercept Orders to ask which enemy Unit to rest");
    }
    expect(restChoice.legalTargetIds).toEqual([lowEnemyId]);
    expectSuccess(p1.resolveEffect({ targets: [lowEnemyId!] }));
    expectSuccess(p1.enterBattle(hostId, lowEnemyId!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [lowEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [lowEnemyId!] }));

    expect(p2.getDamage(lowEnemyId!)).toBe(1);
    expect(p2.getDamage(highEnemyId!)).toBe(0);
  });

  it("does not publish a damage choice when every enemy Unit is above the linked Unit's Lv.", () => {
    const host = createMockUnit({ level: 4, ap: 2, hp: 5, linkCondition: "[Marida Cruz]" });
    const highEnemy = createMockUnit({ level: 5, ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01MaridaCruz093, gd01InterceptOrders099],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [highEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const highEnemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01MaridaCruz093, hostId));
    expectSuccess(p1.playCommand(gd01InterceptOrders099));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected Intercept Orders to ask which enemy Unit to rest");
    }
    expect(restChoice.legalTargetIds).toEqual([highEnemyId]);
    expectSuccess(p1.resolveEffect({ targets: [highEnemyId] }));
    expectSuccess(p1.enterBattle(hostId, highEnemyId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(highEnemyId)).toBe(0);
  });

  it("does not trigger when Marida is paired without forming a Link Unit", () => {
    const host = createMockUnit({ level: 4, ap: 2, hp: 5, linkCondition: "[Banagher Links]" });
    const enemy = createMockUnit({ level: 3, ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01MaridaCruz093, gd01InterceptOrders099],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01MaridaCruz093, hostId));
    expectSuccess(p1.playCommand(gd01InterceptOrders099));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected Intercept Orders to ask which enemy Unit to rest");
    }
    expect(restChoice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expectSuccess(p1.enterBattle(hostId, enemyId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });
});
