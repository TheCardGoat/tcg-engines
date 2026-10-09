import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-032 Limejuice", () => {
  test("selects and reveals an Allies card, then preserves chosen bottom order after restore", () => {
    let e = OnePieceTestEngine.create({
      hand: ["OP17-032"],
      deck: ["OP17-026", "OP17-002", "OP17-027", "OP17-006"],
      activeDon: 1,
    });
    const ally = e.findCardInZone("south", "deck", "OP17-026"),
      wrong = e.findCardInZone("south", "deck", "OP17-002"),
      benn = e.findCardInZone("south", "deck", "OP17-027"),
      unlooked = e.findCardInZone("south", "deck", "OP17-006");
    e.playCard("OP17-032");
    const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected search selection");
    expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([ally, benn]);
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(unlooked);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectSearchSelection", { selectedIds: [ally] }, "south");
    const order = [benn, wrong];
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([ally]);
    // Physical order is intentionally checked through the saved state; deck faces are private.
    expect(e.getState().players.south.deck).toEqual([unlooked, ...order]);
    expect(e.getView("north").logs.some((l) => l.message.includes("reveals Fugar"))).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines optional search selection with eligible cards and orders all three to bottom", () => {
    let e = OnePieceTestEngine.create({
      hand: ["OP17-032"],
      deck: ["OP17-026", "OP17-002", "OP17-027", "OP17-006"],
      activeDon: 1,
    });
    const ally = e.findCardInZone("south", "deck", "OP17-026"),
      wrong = e.findCardInZone("south", "deck", "OP17-002"),
      benn = e.findCardInZone("south", "deck", "OP17-027"),
      unlooked = e.findCardInZone("south", "deck", "OP17-006");
    e.playCard("OP17-032");
    const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected search selection");
    expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([ally, benn]);
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(unlooked);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = [benn, wrong, ally];
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([]);
    // Physical order is intentionally checked through the saved state; deck faces are private.
    expect(e.getState().players.south.deck).toEqual([unlooked, ...order]);
    expect(e.getView("north").logs.some((l) => l.message.includes("reveals Fugar"))).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
