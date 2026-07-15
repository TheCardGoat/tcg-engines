import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01TheStubbornCog103 } from "../command/103-the-stubborn-cog.ts";
import { gd01ChangWufei091 } from "./091-chang-wufei.ts";

function finishBattle(
  p1: ReturnType<GundamTestEngine["asPlayer"]>,
  p2: ReturnType<GundamTestEngine["asPlayer"]>,
) {
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
}

describe("Chang Wufei (GD01-091)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01ChangWufei091] },
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

    expect(p2.getCardZone(gd01ChangWufei091)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("prevents battle damage from an enemy Unit with 3 AP during its controller's turn while it has Breach", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 6,
      keywordEffects: [{ keyword: "Breach", value: 1 }],
    });
    const enemy = createMockUnit({ ap: 3, hp: 8 });
    const restingAlly = createMockUnit({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ChangWufei091, gd01TheStubbornCog103],
        play: [host, restingAlly],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, restingAllyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01ChangWufei091, hostId!));
    expectSuccess(p1.playCommand(gd01TheStubbornCog103));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected The Stubborn Cog to ask for its two target groups");
    }
    expect(restChoice.groups[0]?.legalTargetIds).toEqual([restingAllyId]);
    expect(restChoice.groups[1]?.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [restingAllyId!, enemyId] }));
    expectSuccess(p1.enterBattle(hostId!, enemyId));
    finishBattle(p1, p2);

    expect(p1.getDamage(hostId)).toBe(0);
    expect(p2.getDamage(enemyId)).toBe(4);
  });

  it("receives battle damage from an enemy Unit with 4 AP during its controller's turn while it has Breach", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 6,
      keywordEffects: [{ keyword: "Breach", value: 1 }],
    });
    const enemy = createMockUnit({ ap: 4, hp: 8 });
    const restingAlly = createMockUnit({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ChangWufei091, gd01TheStubbornCog103],
        play: [host, restingAlly],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, restingAllyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01ChangWufei091, hostId!));
    expectSuccess(p1.playCommand(gd01TheStubbornCog103));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected The Stubborn Cog to ask for its two target groups");
    }
    expect(restChoice.groups[0]?.legalTargetIds).toEqual([restingAllyId]);
    expect(restChoice.groups[1]?.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [restingAllyId!, enemyId] }));
    expectSuccess(p1.enterBattle(hostId!, enemyId));
    finishBattle(p1, p2);

    expect(p1.getDamage(hostId)).toBe(4);
    expect(p2.getDamage(enemyId)).toBe(4);
  });

  it("receives battle damage when the paired Unit does not have Breach", () => {
    const host = createMockUnit({ ap: 2, hp: 6 });
    const enemy = createMockUnit({ ap: 3, hp: 8 });
    const restingAlly = createMockUnit({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ChangWufei091, gd01TheStubbornCog103],
        play: [host, restingAlly],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, restingAllyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01ChangWufei091, hostId!));
    expectSuccess(p1.playCommand(gd01TheStubbornCog103));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected The Stubborn Cog to ask for its two target groups");
    }
    expect(restChoice.groups[0]?.legalTargetIds).toEqual([restingAllyId]);
    expect(restChoice.groups[1]?.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [restingAllyId!, enemyId] }));
    expectSuccess(p1.enterBattle(hostId!, enemyId));
    finishBattle(p1, p2);

    expect(p1.getDamage(hostId!)).toBe(3);
  });

  it("receives battle damage during the opponent's turn even while it has Breach", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 6,
      keywordEffects: [{ keyword: "Breach", value: 1 }],
    });
    const attacker = createMockUnit({ ap: 3, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ChangWufei091],
        play: [host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [attacker], shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01ChangWufei091, hostId));
    expectSuccess(p1.enterBattle(hostId, "direct"));
    finishBattle(p1, p2);
    expect(p1.isExhausted(hostId)).toBe(true);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(attackerId, hostId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getDamage(hostId)).toBe(3);
  });
});
