import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaChangWufei091 } from "./091-chang-wufei.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Chang Wufei (GD01-091)", () => {
  it("【Burst】 adds Chang to hand when his shield is destroyed", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [betaChangWufei091] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("prevents battle damage from an enemy Unit with 3 AP during its controller's turn while it has Breach", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 8,
      keywordEffects: [{ keyword: "Breach", value: 1 }],
    });
    const enemy = createMockUnit({ ap: 3, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [betaChangWufei091],
        play: [host],
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(betaChangWufei091, hostId));
    resolveUnitBattle(engine, PLAYER_ONE, hostId, enemyId);

    expect(p1.getDamage(hostId)).toBe(0);
    expect(p2.getDamage(enemyId)).toBe(4);
  });

  it("receives battle damage when the paired Unit does not have Breach", () => {
    const host = createMockUnit({ ap: 2, hp: 8 });
    const enemy = createMockUnit({ ap: 3, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [betaChangWufei091],
        play: [host],
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(betaChangWufei091, hostId));
    resolveUnitBattle(engine, PLAYER_ONE, hostId, enemyId);

    expect(p1.getDamage(hostId)).toBe(3);
  });

  it("receives battle damage from a 4-AP enemy even during its controller's turn with Breach", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 8,
      keywordEffects: [{ keyword: "Breach", value: 1 }],
    });
    const enemy = createMockUnit({ ap: 4, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [betaChangWufei091],
        play: [host],
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(betaChangWufei091, hostId));
    resolveUnitBattle(engine, PLAYER_ONE, hostId, enemyId);

    expect(p1.getDamage(hostId)).toBe(4);
  });

  it("receives battle damage during the opponent's turn even while it has Breach", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 8,
      keywordEffects: [{ keyword: "Breach", value: 1 }],
    });
    const enemy = createMockUnit({ ap: 3, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [betaChangWufei091],
        play: [host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {
        play: [enemy],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(betaChangWufei091, hostId));
    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [hostId]);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    resolveUnitBattle(engine, PLAYER_TWO, enemyId, hostId);

    expect(p1.getDamage(hostId)).toBe(3);
  });
});
