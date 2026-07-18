import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12Koala081 } from "@tcg/op-cards";
import { op12Karasu085 } from "../../../../../cards/src/cards/OP12/characters/085-karasu.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-085 Karasu", () => {
  test("gains cost with an included Revolutionary Army Leader and makes the opponent discard", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12Koala081,
        character: [{ card: op12Karasu085, playedOnTurn: 0 }],
      },
      { hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const karasuId = engine.findCardInZone("south", "character", op12Karasu085);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === karasuId)
        ?.cost,
    ).toBe(op12Karasu085.cost + 3);

    engine.declareAttack(karasuId, engine.leader("north"), "south");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    if (discard?.kind !== "selectEntity") throw new Error("Expected Karasu's opposing discard.");
    expect(discard).toMatchObject({ min: 1, max: 1 });
    const discardedId = discard.candidates[0]!.ref.id;
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.handCount).toBe(4);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardedId);
  });
});
