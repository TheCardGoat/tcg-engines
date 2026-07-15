import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
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
        play: [{ card: gd04ReySBlazeZakuPhantom053, exhausted: true }],
        resourceArea: activeResources(1),
        deck: 5,
      },
      { play: [firstEnemy, secondEnemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const reyId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(minervaPilot, reyId));
    expectSuccess(p1.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(engine.asPlayer(PLAYER_TWO).enterBattle(firstEnemyId!, reyId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBattleAction());
    expect(p1.getDamage(reyId)).toBe(1);

    expectSuccess(engine.asPlayer(PLAYER_TWO).enterBattle(secondEnemyId!, reyId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBattleAction());
    expect(p1.getDamage(reyId)).toBe(3);
  });

  it("does not reduce damage while unlinked", () => {
    const enemy = createMockUnit({ name: "Enemy Attacker", ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [{ card: gd04ReySBlazeZakuPhantom053, exhausted: true }], deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const reyId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(engine.asPlayer(PLAYER_ONE).passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(engine.asPlayer(PLAYER_ONE).passActionStep());
    expectSuccess(engine.asPlayer(PLAYER_TWO).enterBattle(enemyId, reyId));
    expectSuccess(engine.asPlayer(PLAYER_ONE).passBlock());
    expectSuccess(engine.asPlayer(PLAYER_ONE).passBattleAction());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBattleAction());

    expect(engine.asPlayer(PLAYER_ONE).getDamage(reyId)).toBe(2);
  });
});
