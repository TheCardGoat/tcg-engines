import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, asPlayerId } from "@tcg/gundam-engine";
import { gd02PsychoGundamMaMode007 } from "./007-psycho-gundam-ma-mode.ts";

describe("Psycho Gundam (MA Mode) (GD02-007)", () => {
  it("<Repair 2> recovers 2 HP at the end of the controller's turn", () => {
    const engine = GundamTestEngine.create({
      play: [{ card: gd02PsychoGundamMaMode007 }],
    });
    const unitId = engine.getCardsInZone({
      zone: "battleArea",
      playerId: asPlayerId(PLAYER_ONE),
    })[0]!;
    // GundamTestEngine.create does not currently propagate TestCardEntry.damage,
    // so seed G.damage directly for the <Repair> lifecycle hook to heal.
    engine.getG().damage[unitId] = 3;

    engine.endTurn();

    expect(engine.getG().damage[unitId]).toBe(1);
  });
});
