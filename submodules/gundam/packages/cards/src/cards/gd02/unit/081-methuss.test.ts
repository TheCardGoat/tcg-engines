import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
  createMockBase,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd02Methuss081 } from "./081-methuss.ts";

describe("Methuss (GD02-081)", () => {
  it("【Deploy】If a friendly white Base is in play, AP-2 this turn to chosen enemy Unit", () => {
    const whiteBase = createMockBase({ color: "white", hp: 5 });
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd02Methuss081], baseSection: [whiteBase], resourceArea: activeResources(2) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02Methuss081, { targets: [enemyId!] }));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(enemyId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(2);
  });

  it("【Deploy】If no friendly white Base is in play, the condition gate skips the debuff", () => {
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd02Methuss081], resourceArea: activeResources(2) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02Methuss081));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(enemyId!, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(4);
  });
});
