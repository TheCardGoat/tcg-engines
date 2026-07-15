import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { st02GundamHeavyarms003 } from "./003-gundam-heavyarms.ts";

describe("Gundam Heavyarms (ST02-003)", () => {
  it("damages lower-level enemy Units when the paired Heavyarms destroys a Unit in battle", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const defender = createMockUnit({ ap: 1, hp: 1, level: 1 });
    const lowLevelEnemy = createMockUnit({ ap: 1, hp: 4, level: 3 });
    const highLevelEnemy = createMockUnit({ ap: 1, hp: 4, level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [st02GundamHeavyarms003],
        resourceArea: activeResources(1),
      },
      {
        play: [{ card: defender, exhausted: true }, lowLevelEnemy, highLevelEnemy],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const heavyarmsId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, lowLevelEnemyId, highLevelEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, heavyarmsId));
    expectSuccess(p1.enterBattle(heavyarmsId, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("trash")).toContain(defenderId);
    expect(p2.getDamage(lowLevelEnemyId!)).toBe(1);
    expect(p2.getDamage(highLevelEnemyId!)).toBe(0);
  });

  it("does not activate when Heavyarms is not paired", () => {
    const defender = createMockUnit({ ap: 1, hp: 1, level: 1 });
    const lowLevelEnemy = createMockUnit({ ap: 1, hp: 4, level: 3 });
    const engine = GundamTestEngine.create(
      { play: [st02GundamHeavyarms003] },
      { play: [{ card: defender, exhausted: true }, lowLevelEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const heavyarmsId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, lowLevelEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(heavyarmsId, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("trash")).toContain(defenderId);
    expect(p2.getDamage(lowLevelEnemyId!)).toBe(0);
  });
});
