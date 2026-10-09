import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P010 Kaido", () => {
  test("no OnPlay ramp; own end turn adds one active DON before opponent main", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-010"], activeDon: 8, donDeckCount: 2 });
    e.asSouth().play("P-010");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.donDeckCount).toBe(2);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(8);
    expect(e.getView("south").players.south.donDeckCount).toBe(1);
  });
  test("empty DON deck cannot create DON", () => {
    const e = OnePieceTestEngine.create({
      character: ["P-010"],
      activeDon: 3,
      restedDon: 7,
      donDeckCount: 0,
    });
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.activeDon).toBe(3);
    expect(e.getView("south").players.south.restedDon).toBe(7);
    expect(e.getView("south").players.south.donDeckCount).toBe(0);
  });
});
