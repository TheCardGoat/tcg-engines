import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st01Guncannon003 } from "./003-guncannon.ts";

describe("Guncannon (ST01-003)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st01Guncannon003] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st01Guncannon003.type).toBe("unit");
    expect(st01Guncannon003.level).toBe(3);
    expect(st01Guncannon003.cost).toBe(2);
    expect(st01Guncannon003.ap).toBe(2);
    expect(st01Guncannon003.hp).toBe(4);
  });
});
