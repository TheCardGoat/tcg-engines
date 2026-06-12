import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, canAttack, createMockUnit } from "@tcg/gundam-engine";
import { gd04GFalcon061 } from "./061-g-falcon.ts";

describe("G-Falcon (GD04-061)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04GFalcon061.keywordEffects.map((effect) => effect.keyword)).toEqual(["Blocker"]);
  });

  it("cannot attack while there are 6 or less cards in your trash", () => {
    const engine = GundamTestEngine.create({
      play: [gd04GFalcon061],
      trash: Array.from({ length: 6 }, (_, index) => createMockUnit({ name: `Trash ${index}` })),
    });
    const gFalconId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(canAttack(gFalconId, engine.getG(), framework.cards, framework)).toBe(false);
  });

  it("can attack once there are 7 or more cards in your trash", () => {
    const engine = GundamTestEngine.create({
      play: [gd04GFalcon061],
      trash: Array.from({ length: 7 }, (_, index) => createMockUnit({ name: `Trash ${index}` })),
    });
    const gFalconId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(canAttack(gFalconId, engine.getG(), framework.cards, framework)).toBe(true);
  });
});
