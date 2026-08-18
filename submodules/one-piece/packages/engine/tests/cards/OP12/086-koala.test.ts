import { describe, expect, test } from "vite-plus/test";
import { op12Karasu085 } from "../../../../cards/src/cards/OP12/characters/085-karasu.ts";
import { op12Koala086 } from "../../../../cards/src/cards/OP12/characters/086-koala.ts";
import { op12NicoRobin087 } from "../../../../cards/src/cards/OP12/characters/087-nico-robin.ts";
import { op12Koala081 } from "../../../../cards/src/cards/OP12/leaders/081-koala.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-086 Koala", () => {
  // A search whose `revealDestination` is "hand" must not require an open Character slot: nothing
  // is being put onto the board. `effectSearchSelection` used to apply
  // `selectedIds.filter(cardType === "character").length > openCharacterSlots` to every search
  // regardless of destination, while the prompt built in effects/actions.ts folds
  // `openCharacterSlots` into `destinationCapacity` only when `revealDestination === "character"`.
  // With a full Character area the two disagreed, and resolution rejected a card the prompt had
  // just reported as legal.
  test("reveals to hand even when the Character area is full", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Koala081,
      hand: [op12Koala086],
      // Four bodies already down; Koala takes the fifth and last slot, so the search resolves with
      // zero open Character slots.
      character: [
        { card: op12Karasu085, playedOnTurn: 0 },
        { card: op12Karasu085, playedOnTurn: 0 },
        { card: op12Karasu085, playedOnTurn: 0 },
        { card: op12Karasu085, playedOnTurn: 0 },
      ],
      deck: [op12Karasu085, op12NicoRobin087, op12Koala086, op12Karasu085],
      activeDon: op12Koala086.cost,
    });
    const robinId = engine.findCardInZone("south", "deck", op12NicoRobin087);

    engine.playCard(op12Koala086, "south");
    expect(
      engine.getState().players.south.characterArea.filter((slot) => slot !== null),
    ).toHaveLength(5);

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Koala's search choice.");
    // The prompt reports Nico Robin as a legal reveal...
    expect(search.candidates.find((candidate) => candidate.ref.id === robinId)?.legal).toBe(true);

    // ...so resolving her must be accepted. This threw MoveFailedError before the fix.
    engine.resolveDecision("effectSearchSelection", { selectedIds: [robinId] }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      robinId,
    );
  });
});
