import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb03Otama012, op09Izo044, op13Vista046 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-044 Izo", () => {
  test("search accepts either a Land of Wano card or a card including Whitebeard Pirates", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09Izo044, playedOnTurn: 0 }],
        hand: [eb01Doma005],
        deck: [op13Vista046, eb03Otama012, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const izoId = engine.findCardInZone("south", "character", op09Izo044);
    const whitebeardId = engine.findCardInZone("south", "deck", op13Vista046);
    const wanoId = engine.findCardInZone("south", "deck", eb03Otama012);
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(izoId, engine.leader("north"), "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Izo's search selection.");
    expect(search.candidates.find((candidate) => candidate.ref.id === wanoId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === whitebeardId)?.legal).toBe(
      true,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [whitebeardId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Izo's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Izo's hand-trash selection.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(whitebeardId);
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(discardId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(whitebeardId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.prompts).toHaveLength(0);
  });
});
