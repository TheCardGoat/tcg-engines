import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01EdwardWeevil023,
  op07Buckin049,
  op07EdwardWeevil039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-049 Buckin", () => {
  test("on play optionally plays only a cost-4-or-less Edward Weevil from hand rested", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Buckin049, op07EdwardWeevil039, eb01EdwardWeevil023, eb01Doma005],
      activeDon: op07Buckin049.cost,
    });
    const weevilIds = [
      engine.findCardInZone("south", "hand", op07EdwardWeevil039),
      engine.findCardInZone("south", "hand", eb01EdwardWeevil023),
    ];
    const unrelatedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op07Buckin049, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Buckin's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(weevilIds);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [weevilIds[0]!] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === weevilIds[0]),
    ).toMatchObject({ rested: true });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(weevilIds[1]);
    expect(view.prompts).toHaveLength(0);
  });
});
