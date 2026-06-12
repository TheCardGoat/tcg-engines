import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd03ZakuFourSnakeEyesYetiGq032 } from "./032-zaku-four-snake-eyes-yeti-gq.ts";

describe("Zaku (Four Snake Eyes') [YETI] (GQ) (GD03-032)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03ZakuFourSnakeEyesYetiGq032] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd03ZakuFourSnakeEyesYetiGq032.type).toBe("unit");
    expect(gd03ZakuFourSnakeEyesYetiGq032.level).toBe(2);
    expect(gd03ZakuFourSnakeEyesYetiGq032.cost).toBe(1);
    expect(gd03ZakuFourSnakeEyesYetiGq032.ap).toBe(2);
    expect(gd03ZakuFourSnakeEyesYetiGq032.hp).toBe(2);
  });
});
