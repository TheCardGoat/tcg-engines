import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st03GearaZulu003 } from "./003-geara-zulu.ts";

describe("Geara Zulu (ST03-003)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st03GearaZulu003] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st03GearaZulu003.type).toBe("unit");
    expect(st03GearaZulu003.level).toBe(3);
    expect(st03GearaZulu003.cost).toBe(2);
    expect(st03GearaZulu003.ap).toBe(3);
    expect(st03GearaZulu003.hp).toBe(2);
  });
});
