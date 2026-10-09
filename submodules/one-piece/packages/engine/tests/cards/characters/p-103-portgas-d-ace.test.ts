import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("p-103-portgas-d-ace", () => {
  test.each(["top", "bottom"])("draw2 then ordered whole group %s and give rested DON", (end) => {
    const e = OnePieceTestEngine.create({
      hand: ["P-103", "P-015"],
      activeDon: 4,
      deck: ["P-012", "P-016", "P-041", "P-110", "P-119"],
    });
    e.asSouth().play("P-103");
    const a = e.findCardInZone("south", "hand", "P-012"),
      b = e.findCardInZone("south", "hand", "P-016");
    e.asSouth().chooseTargets(a, b);
    e.resolveDecision("effectReturnToDeckOrder", { selectedIds: [b, a] }, "south");
    e.resolveDecision("effectDeckPosition", { optionId: end }, "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(e.getView("south").players.south.handCount).toBe(1);
    // Physical hidden deck order is not exposed by the player view.
    expect(
      end === "top"
        ? e.getState().players.south.deck.slice(0, 2)
        : e.getState().players.south.deck.slice(-2),
    ).toEqual([b, a]);
  });
  test("declines optional DON after mandatory draw and return", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-103"],
      activeDon: 4,
      deck: ["P-012", "P-016", "P-041", "P-110", "P-119"],
    });
    e.asSouth().play("P-103");
    const ids = [
      e.findCardInZone("south", "hand", "P-012"),
      e.findCardInZone("south", "hand", "P-016"),
    ];

    e.resolveDecision("effectReturnToDeckOrder", { selectedIds: ids }, "south");
    e.resolveDecision("effectDeckPosition", { optionId: "top" }, "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
});
