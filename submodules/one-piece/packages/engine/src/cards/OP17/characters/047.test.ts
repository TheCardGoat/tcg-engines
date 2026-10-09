import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-047 Shiki", () => {
  test("FAQ: at two hand cards, opponent chooses their card to bottom", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-047"], hand: ["EB01-005", "OP17-006"] },
      { hand: ["OP17-002", "OP17-006"], deck: ["OP17-005"] },
    );
    const selected = e.findCardInZone("north", "hand", "OP17-006"),
      kept = e.findCardInZone("north", "hand", "OP17-002");
    e.endTurn("south");
    const step = e.pendingDecision("effectTargetSelection", "north").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected opponent's hand choice");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([kept, selected]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [selected] }, "north");
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(kept);
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).not.toContain(selected);
    // Exact hidden deck position is not present in the projection.
    expect(e.getState().players.north.deck.at(-1)).toBe(selected);
  });
  test("three own hand cards disable the end-of-turn effect", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-047"], hand: ["EB01-005", "OP17-006", "OP17-002"] },
      { hand: ["OP17-006"] },
    );
    const kept = e.findCardInZone("north", "hand", "OP17-006");
    e.endTurn("south");
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(kept);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
});
