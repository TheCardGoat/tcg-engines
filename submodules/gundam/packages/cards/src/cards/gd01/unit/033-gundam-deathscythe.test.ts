import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, asPlayerId } from "@tcg/gundam-engine";
import { gd01GundamDeathscythe033 } from "./033-gundam-deathscythe.ts";

describe("Gundam Deathscythe (GD01-033)", () => {
  it("<Repair 1> recovers 1 HP at the end of the controller's turn", () => {
    const engine = GundamTestEngine.create({
      play: [{ card: gd01GundamDeathscythe033 }],
    });
    const unitId = engine.getCardsInZone({
      zone: "battleArea",
      playerId: asPlayerId(PLAYER_ONE),
    })[0]!;
    // GundamTestEngine.create does not currently propagate TestCardEntry.damage,
    // so seed G.damage directly for the <Repair> lifecycle hook to heal.
    engine.getG().damage[unitId] = 2;

    engine.endTurn();

    expect(engine.getG().damage[unitId]).toBe(1);
  });
});
