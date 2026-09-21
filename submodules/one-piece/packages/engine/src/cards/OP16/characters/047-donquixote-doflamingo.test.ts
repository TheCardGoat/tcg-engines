import { describe, expect, test } from "vite-plus/test";
import { op16DonquixoteDoflamingo047 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

function createEngine(handSize: number) {
  return OnePieceTestEngine.create(
    { character: [{ card: op16DonquixoteDoflamingo047 }], activeDon: 2 },
    {
      hand: Array.from({ length: handSize }, () => "OP16-095"),
      deck: ["OP16-096", "OP16-039", "OP16-038", "OP16-037"],
      activeDon: 2,
    },
  );
}

describe("OP16-047 Donquixote Doflamingo", () => {
  test("against an 8-card hand it rests itself and the opponent bottoms 2 cards in their chosen order", () => {
    const engine = createEngine(8);
    const doflamingoId = engine.findCardInZone("south", "character", op16DonquixoteDoflamingo047);
    const handBefore = engine.getView("south").players.north.hand.length;

    engine.activateEffect(doflamingoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    // The opponent chooses which of their cards leave the hand...
    const selection = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected the discard choice.");
    expect(selection.candidates).toHaveLength(8);
    const chosen = selection.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectTargetSelection", { selectedIds: chosen }, "north");

    const north = engine.getView("south").players.north;
    expect(north.hand).toHaveLength(handBefore - 2);
    expect(north.deckCount).toBe(6);
    // Supplementary invariant: the chosen cards sit at the bottom of the
    // owner's deck in the order they were selected (hidden to the opponent).
    const deck = engine.getState().players.north.deck;
    expect(deck.at(-2)).toBe(chosen[0]);
    expect(deck.at(-1)).toBe(chosen[1]);
    expect(north.restedDon).toBe(0);
    expect(
      engine
        .getView("south")
        .players.south.characters.find((c) => c?.cardId === op16DonquixoteDoflamingo047.id)?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("has no window against a 7-card hand", () => {
    const engine = createEngine(7);
    const doflamingoId = engine.findCardInZone("south", "character", op16DonquixoteDoflamingo047);

    expect(() => engine.activateEffect(doflamingoId, "activateMain", "south")).toThrow();
    expect(engine.getView("south").players.north.hand).toHaveLength(7);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining rests Doflamingo without touching the opponent's hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-047" }], activeDon: 2 },
      { hand: Array.from({ length: 8 }, () => "OP16-095") },
    );
    const handBefore = engine.getView("south").players.north.hand.length;

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP16-047"),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const north = engine.getView("south").players.north;
    expect(north.hand.length).toBe(handBefore);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.cardId === "OP16-047")
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
