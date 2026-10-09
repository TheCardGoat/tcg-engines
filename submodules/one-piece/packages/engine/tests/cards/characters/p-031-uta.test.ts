import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P031 Uta", () => {
  test("OnPlay adds one DON rested", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-031"], activeDon: 5, donDeckCount: 5 });
    e.asSouth().play("P-031");
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(6);
    expect(e.getView("south").players.south.donDeckCount).toBe(4);
  });
  test("declines optional add DON with available deck card", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-031"], activeDon: 5, donDeckCount: 5 });
    e.asSouth().play("P-031");
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(5);
    expect(e.getView("south").players.south.donDeckCount).toBe(5);
  });
  test("empty DON deck cannot create DON", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-031"],
      activeDon: 5,
      restedDon: 5,
      donDeckCount: 0,
    });
    e.asSouth().play("P-031");
    expect(e.getView("south").players.south.restedDon).toBe(10);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
