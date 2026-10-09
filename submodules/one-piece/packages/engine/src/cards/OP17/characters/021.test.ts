import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-021 Crone Oli", () => {
  test("FAQ: rests itself once to save two simultaneously removed Red-Haired Characters including itself", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-016"], activeDon: 3 },
      { character: ["OP17-021", "OP17-026"] },
    );
    const oli = e.findCardInZone("north", "character", "OP17-021"),
      fugar = e.findCardInZone("north", "character", "OP17-026");
    e.playCard("OP17-016");
    e.resolveDecision("effectTargetSelection", { selectedIds: [oli, fugar] }, "south");
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.resolveDecision("effectMixedRestSelection", { selectedIds: [oli] }, "north");
    const v = e.getView("north");
    expect(v.players.north.characters.filter(Boolean).map((c) => c?.instanceId)).toEqual([
      oli,
      fugar,
    ]);
    expect(v.players.north.characters.find((c) => c?.instanceId === oli)?.rested).toBe(true);
    expect(v.players.north.characters.find((c) => c?.instanceId === fugar)?.rested).toBe(false);
    expect(v.players.north.trash).toHaveLength(0);
    expect(v.prompts).toHaveLength(0);
  });
  test("declining optional replacement removes its own physical card", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-014"], activeDon: 1 },
      { character: ["OP17-021"] },
    );
    const oli = e.findCardInZone("north", "character", "OP17-021");
    e.playCard("OP17-014");
    e.resolveDecision("effectTargetSelection", { selectedIds: [oli] }, "south");
    e.resolveDecision("effectKoReplacement", { optionId: "no" }, "north");
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toEqual([oli]);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
});
