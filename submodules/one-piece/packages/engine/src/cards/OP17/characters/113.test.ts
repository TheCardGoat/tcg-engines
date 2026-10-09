import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-113 Streusen", () => {
  test("selects and reveals Big Mom then reverses the physical bottom remainder", () => {
    let e = OnePieceTestEngine.create({
      hand: ["OP17-113"],
      activeDon: 1,
      deck: ["OP17-107", "ST02-002", "OP17-103", "ST02-003"],
    });
    const deck = [...e.getState().players.south.deck];
    e.playCard("OP17-113");
    const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected Big Mom search");
    expect(step.candidates.filter((c) => c.legal).map((c) => c.publicInfo?.cardId)).toEqual([
      "OP17-107",
      "OP17-103",
    ]);
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(deck[3]);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectSearchSelection", { selectedIds: [deck[0]!] }, "south");
    const order = deck.slice(1, 3).reverse();
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([deck[0]]);
    // Saved physical order proves the private deck movement without exposing deck faces in views.
    expect(e.getState().players.south.deck).toEqual([deck[3], ...order]);
    expect(
      e.getView("north").logs.some((l) => l.message.includes("reveals Charlotte Daifuku")),
    ).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines an eligible Big Mom search and orders all looked cards to bottom", () => {
    let e = OnePieceTestEngine.create({
      hand: ["OP17-113"],
      activeDon: 1,
      deck: ["OP17-107", "ST02-002", "OP17-103", "ST02-003"],
    });
    const deck = [...e.getState().players.south.deck];
    e.playCard("OP17-113");
    const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected Big Mom search");
    expect(step.candidates.filter((c) => c.legal).map((c) => c.publicInfo?.cardId)).toEqual([
      "OP17-107",
      "OP17-103",
    ]);
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(deck[3]);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = deck.slice(0, 3).reverse();
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([]);
    // Saved physical order proves the private deck movement without exposing deck faces in views.
    expect(e.getState().players.south.deck).toEqual([deck[3], ...order]);
    expect(
      e.getView("north").logs.some((l) => l.message.includes("reveals Charlotte Daifuku")),
    ).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
