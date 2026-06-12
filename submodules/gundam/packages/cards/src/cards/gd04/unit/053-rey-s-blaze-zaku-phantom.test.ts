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
import { gd04ReySBlazeZakuPhantom053 } from "./053-rey-s-blaze-zaku-phantom.ts";

describe("Rey's Blaze Zaku Phantom (GD04-053)", () => {
  it("during link reduces enemy battle damage by 1 once per turn", () => {
    const minervaPilot = createMockPilot({
      name: "Minerva Squad Pilot",
      traits: ["minerva squad"],
      level: 1,
      cost: 1,
    });
    const firstEnemy = createMockUnit({ name: "First Enemy Attacker", ap: 2, hp: 10 });
    const secondEnemy = createMockUnit({ name: "Second Enemy Attacker", ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [minervaPilot],
        play: [gd04ReySBlazeZakuPhantom053],
        resourceArea: activeResources(1),
      },
      { play: [firstEnemy, secondEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const reyId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(minervaPilot, reyId));
    engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
    engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_TWO);
    expectSuccess(engine.resolveCombat({ attackerId: firstEnemyId!, target: reyId }));
    expect(getDamageCounter(engine, reyId)).toBe(1);

    expectSuccess(engine.resolveCombat({ attackerId: secondEnemyId!, target: reyId }));
    expect(getDamageCounter(engine, reyId)).toBe(3);
  });

  it("does not reduce damage while unlinked", () => {
    const enemy = createMockUnit({ name: "Enemy Attacker", ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [gd04ReySBlazeZakuPhantom053] },
      { play: [enemy] },
    );
    const reyId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
    engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_TWO);
    expectSuccess(engine.resolveCombat({ attackerId: enemyId, target: reyId }));

    expect(getDamageCounter(engine, reyId)).toBe(2);
  });
});
