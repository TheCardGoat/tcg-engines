import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockCommand,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { betaMichaelis076 } from "./076-michaelis.ts";

describe("Michaelis (GD01-076)", () => {
  it("gets AP+1 / HP+1 when 4+ Command cards are in your trash", () => {
    const cmd1 = createMockCommand();
    const cmd2 = createMockCommand();
    const cmd3 = createMockCommand();
    const cmd4 = createMockCommand();
    const engine = GundamTestEngine.create({
      play: [betaMichaelis076],
      trash: [cmd1, cmd2, cmd3, cmd4],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const michaelisId = p1.getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(michaelisId, engine.getG(), framework.cards, framework);
    // Base AP 3 / HP 3 + (+1/+1) from the constant while-condition.
    expect(stats.ap).toBe(betaMichaelis076.ap + 1);
    expect(stats.hp).toBe(betaMichaelis076.hp + 1);
  });

  it("keeps base stats when fewer than 4 Command cards are in trash", () => {
    const cmd1 = createMockCommand();
    const cmd2 = createMockCommand();
    const engine = GundamTestEngine.create({
      play: [betaMichaelis076],
      trash: [cmd1, cmd2],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const michaelisId = p1.getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(michaelisId, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(betaMichaelis076.ap);
    expect(stats.hp).toBe(betaMichaelis076.hp);
  });
});
