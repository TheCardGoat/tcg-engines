import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Dalmatian046,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-046 Dalmatian", () => {
  test("on battle K.O. draws before choosing one hand card for the bottom of its deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Fourtricks025],
        character: [{ card: op05Dalmatian046, rested: true }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const dalmatianId = engine.findCardInZone("south", "character", op05Dalmatian046);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const existingHandId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.declareAttack(attackerId, dalmatianId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const bottom = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(bottom).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (bottom?.kind !== "selectEntity") throw new Error("Expected Dalmatian's hand choice.");
    expect(bottom.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([existingHandId, drawnId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [drawnId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(dalmatianId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([existingHandId]);
    // Exact deck-bottom identity is a narrow hidden-zone boundary.
    expect(engine.getState().players.south.deck.at(-1)).toBe(drawnId);
    expect(view.prompts).toHaveLength(0);
  });
});
