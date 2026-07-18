import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op01ParadiseWaterfall057,
  op02PortgasDAce013,
  op02Seaquake021,
  op03PortgasDAce001,
  op07MaskedDeuce013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-013 Masked Deuce", () => {
  test("with Portgas.D.Ace, finds either that name or a red Event and bottoms the rest in order", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03PortgasDAce001,
      hand: [op07MaskedDeuce013],
      deck: [
        op02PortgasDAce013,
        op02Seaquake021,
        op01ParadiseWaterfall057,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op07MaskedDeuce013.cost,
    });
    const aceId = engine.findCardInZone("south", "deck", op02PortgasDAce013);
    const redEventId = engine.findCardInZone("south", "deck", op02Seaquake021);
    const greenEventId = engine.findCardInZone("south", "deck", op01ParadiseWaterfall057);
    const redCharacterId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op07MaskedDeuce013, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Masked Deuce's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === aceId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === redEventId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === greenEventId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === redCharacterId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [redEventId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected a bottom-deck order choice.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(redEventId);
    expect(view.players.south.deckCount).toBe(4);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a Portgas.D.Ace Leader does not look at or move the deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07MaskedDeuce013],
      deck: [op02Seaquake021, eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
      activeDon: op07MaskedDeuce013.cost,
    });
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op07MaskedDeuce013, "south");

    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
