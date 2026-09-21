import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Alvida003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("OP15-003 Alvida", () => {
  test("replaces its own K.O. by trashing a Character card with 6000 or less power from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op15Alvida003, rested: true }],
        hand: [eb01Doma005, "OP16-039", "OP16-096"],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-096", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const alvidaId = engine.findCardInZone("south", "character", op15Alvida003);
    const fodderId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eventId = engine.findCardInZone("south", "hand", "OP16-039");
    const tooStrongId = engine.findCardInZone("south", "hand", "OP16-096");
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    engine.declareAttack(attackerId, alvidaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const replacement = engine.pendingDecision("battleKoReplacement", "south").steps[0];
    if (replacement?.kind !== "selectEntity") throw new Error("Expected the replacement trash.");
    const candidates = replacement.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(fodderId);
    expect(candidates).not.toContain(eventId);
    expect(candidates).not.toContain(tooStrongId);
    engine.resolveDecision("battleKoReplacement", { selectedIds: [fodderId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(alvidaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(fodderId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([eventId, tooStrongId]);
    expect(view.prompts).toHaveLength(0);
  });

  test("declining the replacement lets the K.O. through", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op15Alvida003, rested: true }],
        hand: [eb01Doma005],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-096", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const alvidaId = engine.findCardInZone("south", "character", op15Alvida003);
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    engine.declareAttack(attackerId, alvidaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("battleKoReplacement", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(alvidaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(alvidaId);
    expect(view.prompts).toHaveLength(0);
  });
});
