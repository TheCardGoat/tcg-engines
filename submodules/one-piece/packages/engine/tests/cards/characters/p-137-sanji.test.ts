import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-137 Sanji", () => {
  test("gives rested DON when attacking and deals two Life damage", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-137", playedOnTurn: 0 }], restedDon: 1 },
      { life: ["EB01-005", "ST02-002", "ST02-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sanji = e.findCardInZone("south", "character", "P-137");
    e.asSouth().attack(sanji, e.leader("north"));
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [sanji] }, "south");
    expect(e.getView("south").players.north.lifeCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    expect(e.getView("south").players.south.restedDon).toBe(0);
  });
  test("choosing zero DON still deals Double Attack damage", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-137", playedOnTurn: 0 }], restedDon: 1 },
      { life: ["EB01-005", "ST02-002", "ST02-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "P-137"), e.leader("north"));
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.north.lifeCount).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(0);
  });
});
