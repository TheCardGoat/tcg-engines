import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd04Gundam067 } from "./067-gundam.ts";

describe("∀ Gundam (GD04-067)", () => {
  it("gets AP+1 and copies printed keywords from the chosen trash Unit", () => {
    const keywordUnit = createMockUnit({
      keywordEffects: [{ keyword: "Repair" }, { keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create({
      play: [gd04Gundam067],
      trash: [keywordUnit],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const turnAId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(turnAId, 0));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(turnAId, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(5);
    expect(stats.keywords).toEqual(expect.arrayContaining(["Repair", "Blocker"]));
  });
});
