import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st02GundamSandrock004 } from "./004-gundam-sandrock.ts";

describe("Gundam Sandrock (ST02-004)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st02GundamSandrock004] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st02GundamSandrock004.type).toBe("unit");
    expect(st02GundamSandrock004.level).toBe(4);
    expect(st02GundamSandrock004.cost).toBe(2);
    expect(st02GundamSandrock004.ap).toBe(4);
    expect(st02GundamSandrock004.hp).toBe(3);
  });
});
