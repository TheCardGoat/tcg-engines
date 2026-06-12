import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd03FullArmorUnicornGundamUnicornMode016 } from "./016-full-armor-unicorn-gundam-unicorn-mode.ts";

describe("Full Armor Unicorn Gundam (Unicorn Mode) (GD03-016)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03FullArmorUnicornGundamUnicornMode016] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd03FullArmorUnicornGundamUnicornMode016.type).toBe("unit");
    expect(gd03FullArmorUnicornGundamUnicornMode016.level).toBe(5);
    expect(gd03FullArmorUnicornGundamUnicornMode016.cost).toBe(3);
    expect(gd03FullArmorUnicornGundamUnicornMode016.ap).toBe(5);
    expect(gd03FullArmorUnicornGundamUnicornMode016.hp).toBe(4);
  });
});
