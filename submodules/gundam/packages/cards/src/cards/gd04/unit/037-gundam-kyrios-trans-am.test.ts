import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockPilot,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd04GundamKyriosTransAm037 } from "./037-gundam-kyrios-trans-am.ts";

describe("Gundam Kyrios (Trans-Am) (GD04-037)", () => {
  it("gains <First Strike> while a friendly red (Super Soldier) Pilot is in play", () => {
    const redSuperSoldier = createMockPilot({ color: "red", traits: ["super soldier"] });
    const engine = GundamTestEngine.create({ play: [gd04GundamKyriosTransAm037, redSuperSoldier] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("FirstStrike");
    expect(stats.keywords).not.toContain("Breach");
  });

  it("gains <Breach 3> while a friendly green (Super Soldier) Pilot is in play", () => {
    const greenSuperSoldier = createMockPilot({ color: "green", traits: ["super soldier"] });
    const engine = GundamTestEngine.create({
      play: [gd04GundamKyriosTransAm037, greenSuperSoldier],
    });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("Breach");
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  it("does not gain either keyword without a matching (Super Soldier) Pilot in play", () => {
    const nonSuperSoldier = createMockPilot({ color: "red", traits: ["cb"] });
    const engine = GundamTestEngine.create({ play: [gd04GundamKyriosTransAm037, nonSuperSoldier] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).not.toContain("FirstStrike");
    expect(stats.keywords).not.toContain("Breach");
  });
});
