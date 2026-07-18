import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op07Caribou023, op07Coribou025, op10Caribou104 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-025 Coribou", () => {
  test("plays up to one cost-4 Caribou from hand rested", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Coribou025, op07Caribou023, op10Caribou104, eb01Doma005],
      activeDon: op07Coribou025.cost,
    });
    const selectedId = engine.findCardInZone("south", "hand", op07Caribou023);
    const otherCaribouId = engine.findCardInZone("south", "hand", op10Caribou104);
    const wrongNameId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op07Coribou025, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Coribou's Caribou choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([selectedId, otherCaribouId]),
    );
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongNameId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(otherCaribouId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(wrongNameId);
    expect(view.prompts).toHaveLength(0);
  });
});
