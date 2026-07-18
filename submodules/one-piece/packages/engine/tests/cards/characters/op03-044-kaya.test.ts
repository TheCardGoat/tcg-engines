import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op03Kaya044 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-044 Kaya", () => {
  test("draws two, then lets its controller trash two cards from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Kaya044, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op03Kaya044.cost,
    });
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op03Kaya044, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Kaya's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([retainedId, firstDrawId, secondDrawId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawId, secondDrawId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
