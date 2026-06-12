import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd04LunamariaSGunnerZakuWarrior062 } from "./062-lunamaria-s-gunner-zaku-warrior.ts";

describe("Lunamaria's Gunner Zaku Warrior (GD04-062)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04LunamariaSGunnerZakuWarrior062] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04LunamariaSGunnerZakuWarrior062.type).toBe("unit");
    expect(gd04LunamariaSGunnerZakuWarrior062.level).toBe(3);
    expect(gd04LunamariaSGunnerZakuWarrior062.cost).toBe(2);
    expect(gd04LunamariaSGunnerZakuWarrior062.ap).toBe(2);
    expect(gd04LunamariaSGunnerZakuWarrior062.hp).toBe(4);
  });
});
