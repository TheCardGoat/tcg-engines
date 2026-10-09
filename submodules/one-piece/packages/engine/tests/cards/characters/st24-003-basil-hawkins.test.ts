import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st24-003-basil-hawkins", () => {
  test("own end turn readies one DON before the opponent acts", () => {
    const e = OnePieceTestEngine.create({ character: ["ST24-003"], restedDon: 2 }, {});
    e.asSouth().endTurn();
    e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").activeSeat).toBe("north");
  });
  test("declines optional end-turn DON ready", () => {
    const e = OnePieceTestEngine.create({ character: ["ST24-003"], restedDon: 1 }, {});
    e.asSouth().endTurn();
    e.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
});
