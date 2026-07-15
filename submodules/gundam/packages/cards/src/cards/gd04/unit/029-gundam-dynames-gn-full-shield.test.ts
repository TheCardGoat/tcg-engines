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
import { gd04GundamDynamesGnFullShield029 } from "./029-gundam-dynames-gn-full-shield.ts";

describe("Gundam Dynames (GN Full Shield) (GD04-029)", () => {
  it("reduces enemy battle damage by 1 once per turn while you have a CB Pilot in play", () => {
    const lockon = createMockPilot({ name: "Lockon Stratos", traits: ["cb"], level: 1, cost: 1 });
    const firstEnemy = createMockUnit({ name: "First Enemy Attacker", ap: 2, hp: 10 });
    const secondEnemy = createMockUnit({ name: "Second Enemy Attacker", ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [lockon],
        play: [{ card: gd04GundamDynamesGnFullShield029, exhausted: true }],
        resourceArea: activeResources(1),
        deck: 5,
      },
      { play: [firstEnemy, secondEnemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const dynamesId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(lockon, dynamesId));
    expectSuccess(p1.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(engine.asPlayer(PLAYER_TWO).enterBattle(firstEnemyId!, dynamesId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBattleAction());
    expect(p1.getDamage(dynamesId)).toBe(1);

    expectSuccess(engine.asPlayer(PLAYER_TWO).enterBattle(secondEnemyId!, dynamesId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBattleAction());
    expect(p1.getDamage(dynamesId)).toBe(3);
  });

  it("does not reduce damage without a CB Pilot in play", () => {
    const enemy = createMockUnit({ name: "Enemy Attacker", ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [{ card: gd04GundamDynamesGnFullShield029, exhausted: true }], deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const dynamesId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(engine.asPlayer(PLAYER_ONE).passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(engine.asPlayer(PLAYER_ONE).passActionStep());
    expectSuccess(engine.asPlayer(PLAYER_TWO).enterBattle(enemyId, dynamesId));
    expectSuccess(engine.asPlayer(PLAYER_ONE).passBlock());
    expectSuccess(engine.asPlayer(PLAYER_ONE).passBattleAction());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBattleAction());

    expect(engine.asPlayer(PLAYER_ONE).getDamage(dynamesId)).toBe(2);
  });
});
