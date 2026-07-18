import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Rock017, op10Scotch008 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-017 Rock", () => {
  test("plays the selected physical Scotch from hand when none is on the field", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Rock017, op10Scotch008],
      activeDon: op10Rock017.cost,
    });
    const scotchId = engine.findCardInZone("south", "hand", op10Scotch008);

    engine.playCard(op10Rock017, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Rock's Scotch choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([scotchId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [scotchId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(scotchId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer a hand play while Scotch is already on the field", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Rock017, op10Scotch008],
      character: [op10Scotch008],
      deck: [eb01Doma005],
      activeDon: op10Rock017.cost,
    });
    const handScotchId = engine.findCardInZone("south", "hand", op10Scotch008);

    engine.playCard(op10Rock017, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handScotchId);
    expect(view.prompts).toHaveLength(0);
  });
});
