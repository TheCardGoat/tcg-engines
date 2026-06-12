import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st09ZakuWarrior005 } from "./005-zaku-warrior.ts";

describe("Zaku Warrior (ST09-005)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st09ZakuWarrior005] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st09ZakuWarrior005.type).toBe("unit");
    expect(st09ZakuWarrior005.level).toBe(2);
    expect(st09ZakuWarrior005.cost).toBe(1);
    expect(st09ZakuWarrior005.ap).toBe(2);
    expect(st09ZakuWarrior005.hp).toBe(2);
  });
});
