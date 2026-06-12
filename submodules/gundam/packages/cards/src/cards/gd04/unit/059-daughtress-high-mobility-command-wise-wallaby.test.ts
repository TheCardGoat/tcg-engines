import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04DaughtressHighMobilityCommandWiseWallaby059 } from "./059-daughtress-high-mobility-command-wise-wallaby.ts";

describe("Daughtress High Mobility Command Wise Wallaby (GD04-059)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({
      play: [gd04DaughtressHighMobilityCommandWiseWallaby059],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04DaughtressHighMobilityCommandWiseWallaby059.type).toBe("unit");
    expect(gd04DaughtressHighMobilityCommandWiseWallaby059.level).toBe(2);
    expect(gd04DaughtressHighMobilityCommandWiseWallaby059.cost).toBe(2);
    expect(gd04DaughtressHighMobilityCommandWiseWallaby059.ap).toBe(2);
    expect(gd04DaughtressHighMobilityCommandWiseWallaby059.hp).toBe(2);
  });
});
