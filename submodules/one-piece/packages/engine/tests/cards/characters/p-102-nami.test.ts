import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("p-102-nami", () => {
  test("StrawHat Leader readies two paid DON", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-102"], activeDon: 4 });
    e.asSouth().play("P-102");
    e.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(2);
    expect(e.getView("south").players.south.restedDon).toBe(2);
  });
  test("declines optional DON ready", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-102"], activeDon: 4 });
    e.asSouth().play("P-102");
    e.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(4);
  });
  test("wrong Leader cannot ready DON", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST02-001",
      hand: ["P-102"],
      activeDon: 4,
    });
    e.asSouth().play("P-102");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(4);
  });
});
