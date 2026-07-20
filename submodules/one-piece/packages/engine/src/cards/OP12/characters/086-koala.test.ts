import { describe, expect, test } from "vite-plus/test";
import { op12Koala081 } from "@tcg/op-cards";
import { op12Karasu085 } from "../../../../../cards/src/cards/OP12/characters/085-karasu.ts";
import { op12Koala086 } from "../../../../../cards/src/cards/OP12/characters/086-koala.ts";
import { op12NicoRobin087 } from "../../../../../cards/src/cards/OP12/characters/087-nico-robin.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-086 Koala", () => {
  test("with a Revolutionary Army Leader searches either an eligible trait card or Nico Robin", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Koala081,
      hand: [op12Koala086],
      deck: [op12Karasu085, op12NicoRobin087, op12Koala086, op12Karasu085],
      activeDon: op12Koala086.cost,
    });
    const karasuId = engine.findCardInZone("south", "deck", op12Karasu085);
    const robinId = engine.findCardInZone("south", "deck", op12NicoRobin087);
    const koalaId = engine.findCardInZone("south", "deck", op12Koala086);

    engine.playCard(op12Koala086, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Koala's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === karasuId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === robinId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === koalaId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [robinId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(robinId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([karasuId, koalaId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
