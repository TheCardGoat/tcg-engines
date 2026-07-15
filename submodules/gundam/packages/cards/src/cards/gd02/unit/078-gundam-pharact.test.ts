import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd02GundamPharact078 } from "./078-gundam-pharact.ts";

describe("Gundam Pharact (GD02-078)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02GundamPharact078] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd02GundamPharact078.type).toBe("unit");
    expect(gd02GundamPharact078.level).toBe(5);
    expect(gd02GundamPharact078.cost).toBe(3);
    expect(gd02GundamPharact078.ap).toBe(5);
    expect(gd02GundamPharact078.hp).toBe(4);
  });
});
