import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01RadicalBeam029 } from "@tcg/op-cards";
import { op12Crocus003 } from "../../../../../cards/src/cards/OP12/characters/003-crocus.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-003 Crocus", () => {
  test("on K.O. reveals two Events and plays an eligible red Character from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [
          op01RadicalBeam029,
          op01RadicalBeam029,
          op01RadicalBeam029,
          eb01Doma005,
          eb01MountainGod018,
        ],
        character: [{ card: op12Crocus003, rested: true }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const crocusId = engine.findCardInZone("south", "character", op12Crocus003);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "hand", eb01Doma005);
    const ineligibleId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.declareAttack(attackerId, crocusId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const reveal = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    expect(reveal).toMatchObject({ kind: "payCost", min: 2, max: 2 });
    if (reveal?.kind !== "payCost") throw new Error("Expected Crocus's reveal cost.");
    const revealIds = reveal.candidates.map((candidate) => candidate.ref.id);
    expect(revealIds).toHaveLength(3);
    engine.resolveDecision(
      "effectCostRevealFromHand",
      { selectedIds: revealIds.slice(0, 2) },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Crocus's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(crocusId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(
      view.players.south.hand.filter((card) => card.cardId === op01RadicalBeam029.id),
    ).toHaveLength(3);
    expect(view.prompts).toHaveLength(0);
  });
});
