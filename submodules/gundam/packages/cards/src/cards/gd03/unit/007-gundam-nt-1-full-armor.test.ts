import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, createMockUnit } from "@tcg/gundam-engine";
import { gd03GundamNt1FullArmor007 } from "./007-gundam-nt-1-full-armor.ts";

describe("Gundam NT-1 Full Armor (GD03-007)", () => {
  it("【Destroyed】 rests an enemy Unit with 3 or less HP", () => {
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd03GundamNt1FullArmor007] },
      { play: [enemy] },
    );
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    engine.destroyUnit(unitId);

    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });
});
