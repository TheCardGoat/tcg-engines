import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, expectSuccess } from "@tcg/gundam-engine";
import { gd03MessalaMaMode012 } from "./012-messala-ma-mode.ts";

describe("Messala (MA Mode) (GD03-012)", () => {
  it("<Repair 1> recovers 1 HP at the end of its controller's turn", () => {
    const engine = GundamTestEngine.create({
      play: [{ card: gd03MessalaMaMode012, damage: 2 }],
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
