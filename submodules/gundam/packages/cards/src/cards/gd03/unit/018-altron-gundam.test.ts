import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  getDamageCounter,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03AltronGundam018 } from "./018-altron-gundam.ts";

describe("Altron Gundam (GD03-018)", () => {
  it("has printed Breach 5 in effective stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03AltronGundam018] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.keywords).toContain("Breach");
  });

  it("【Attack】 deals 5 damage to an enemy Unit with Blocker", () => {
    const blocker = {
      card: createMockUnit({ hp: 6, keywordEffects: [{ keyword: "Blocker" }] }),
      exhausted: true,
    };
    const engine = GundamTestEngine.create({ play: [gd03AltronGundam018] }, { play: [blocker] });
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const blockerId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    engine.asPlayer(PLAYER_ONE).enterBattle(attackerId, blockerId);

    expect(getDamageCounter(engine, blockerId)).toBe(5);
  });
});
