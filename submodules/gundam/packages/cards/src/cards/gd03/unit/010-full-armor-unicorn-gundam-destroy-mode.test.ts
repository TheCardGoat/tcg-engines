import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, expectSuccess } from "@tcg/gundam-engine";
import { gd03FullArmorUnicornGundamDestroyMode010 } from "./010-full-armor-unicorn-gundam-destroy-mode.ts";

describe("Full Armor Unicorn Gundam (Destroy Mode) (GD03-010)", () => {
  it("<Repair 3> recovers 3 HP at the end of its controller's turn", () => {
    const engine = GundamTestEngine.create({
      play: [{ card: gd03FullArmorUnicornGundamDestroyMode010, damage: 4 }],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(unitId)).toBe(1);
  });
});
