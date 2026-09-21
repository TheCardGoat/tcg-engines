import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-043", () => {
  test("[On Play] trashes 2 cards from the top of the deck", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-043"], activeDon: 5, deck: ["OP12-013", "OP12-017", "OP13-013", "OP13-013"] },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard("EB04-043");

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 2);
    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP12-013");
    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP12-017");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Once Per Turn] replacement keeps a black Character on the field at the cost of 3 trash cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "EB04-043", rested: true }],
        trash: ["OP12-013", "OP12-017", "OP12-018"],
        activeDon: 5,
      },
      { hand: ["OP17-028"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-043");

    engine.endTurn("south");
    engine.playCard("OP17-028", "north");
    const ko = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    expect(ko.candidates.map((c) => c.ref.id)).toContain(selfId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selfId] }, "north");

    // The replacement confirm: accept it.
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    // The replacement places the 3 trash cards at the bottom in any order.
    const order = engine.pendingDecision("effectReturnToDeckOwnerOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the trash placement order.");
    const bottomOrder = order.candidates.map((c) => c.ref.id).reverse();
    engine.resolveDecision("effectReturnToDeckOwnerOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      selfId,
    );
    expect(engine.getView("south").players.south.trash).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
