import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-157", () => {
  test("pays hand trash and plays a cost-four-or-less Elbaph Character from trash", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-157", "EB01-005"],
      trash: ["OP17-080", "EB01-025", "OP17-119"],
      activeDon: 7,
    });
    e.playCard("P-157");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const id = e.findCardInZone("south", "trash", "OP17-080");
    const s = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (s.kind !== "selectEntity") throw Error("play");
    expect(s.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.resolveDecision("effectPlaySelection", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === id)).toBe(
      true,
    );
  });
  test("declining preserves hand payment and trash", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-157", "EB01-005"],
      trash: ["OP17-080"],
      activeDon: 7,
    });
    e.playCard("P-157");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("EB01-005");
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("OP17-080");
  });
});
