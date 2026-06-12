import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd04Gadeel044 } from "./044-gadeel.ts";

describe("Gadeel (GD04-044)", () => {
  it("【Attack】 gains Breach 3 during this battle when attacking a damaged enemy Unit", () => {
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04Gadeel044] },
      { play: [{ card: enemy, exhausted: true, damage: 1 }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().damage[enemyId] = 1;

    expectSuccess(p1.enterBattle(attackerId, enemyId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(
      getEffectiveStats(attackerId, engine.getG(), framework.cards, framework).keywords,
    ).toContain("Breach");
  });

  it("does not gain Breach when attacking an undamaged enemy Unit", () => {
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04Gadeel044] },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, enemyId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(
      getEffectiveStats(attackerId, engine.getG(), framework.cards, framework).keywords,
    ).not.toContain("Breach");
  });
});
