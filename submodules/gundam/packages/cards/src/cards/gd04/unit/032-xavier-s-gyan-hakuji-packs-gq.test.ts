import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04XavierSGyanHakujiPacksGq032 } from "./032-xavier-s-gyan-hakuji-packs-gq.ts";

describe("Xavier's Gyan Hakuji-Packs (GQ) (GD04-032)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04XavierSGyanHakujiPacksGq032] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04XavierSGyanHakujiPacksGq032.type).toBe("unit");
    expect(gd04XavierSGyanHakujiPacksGq032.level).toBe(5);
    expect(gd04XavierSGyanHakujiPacksGq032.cost).toBe(3);
    expect(gd04XavierSGyanHakujiPacksGq032.ap).toBe(4);
    expect(gd04XavierSGyanHakujiPacksGq032.hp).toBe(5);
  });
});
