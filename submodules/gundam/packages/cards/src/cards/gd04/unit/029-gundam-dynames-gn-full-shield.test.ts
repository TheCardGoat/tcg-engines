import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd04GundamDynamesGnFullShield029 } from "./029-gundam-dynames-gn-full-shield.ts";

describe("Gundam Dynames (GN Full Shield) (GD04-029)", () => {
  it("reduces enemy battle damage by 1 once per turn while you have a CB Pilot in play", () => {
    const lockon = createMockPilot({ name: "Lockon Stratos", traits: ["cb"], level: 1, cost: 1 });
    const firstEnemy = createMockUnit({ name: "First Enemy Attacker", ap: 2, hp: 10 });
    const secondEnemy = createMockUnit({ name: "Second Enemy Attacker", ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [lockon],
        play: [gd04GundamDynamesGnFullShield029],
        resourceArea: activeResources(1),
      },
      { play: [firstEnemy, secondEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const dynamesId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(lockon, dynamesId));
    engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
    engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_TWO);
    expectSuccess(engine.resolveCombat({ attackerId: firstEnemyId!, target: dynamesId }));
    expect(getDamageCounter(engine, dynamesId)).toBe(1);

    expectSuccess(engine.resolveCombat({ attackerId: secondEnemyId!, target: dynamesId }));
    expect(getDamageCounter(engine, dynamesId)).toBe(3);
  });

  it("does not reduce damage without a CB Pilot in play", () => {
    const enemy = createMockUnit({ name: "Enemy Attacker", ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamDynamesGnFullShield029] },
      { play: [enemy] },
    );
    const dynamesId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
    engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_TWO);
    expectSuccess(engine.resolveCombat({ attackerId: enemyId, target: dynamesId }));

    expect(getDamageCounter(engine, dynamesId)).toBe(2);
  });
});
