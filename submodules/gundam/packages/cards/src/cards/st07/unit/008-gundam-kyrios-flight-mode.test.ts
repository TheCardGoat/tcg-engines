import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st07GundamKyriosFlightMode008 } from "./008-gundam-kyrios-flight-mode.ts";

describe("Gundam Kyrios (Flight Mode) (ST07-008)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st07GundamKyriosFlightMode008] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st07GundamKyriosFlightMode008.type).toBe("unit");
    expect(st07GundamKyriosFlightMode008.level).toBe(2);
    expect(st07GundamKyriosFlightMode008.cost).toBe(2);
    expect(st07GundamKyriosFlightMode008.ap).toBe(3);
    expect(st07GundamKyriosFlightMode008.hp).toBe(1);
  });
});
