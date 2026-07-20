import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03Kaya044,
  op09Alvida043,
  op09Buggy042,
  op09Crocodile046,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-043 Alvida", () => {
  test("under an included Cross Guild Leader trait, plays the selected Character and resolves its On Play effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Buggy042,
        hand: [op03Kaya044, op09Alvida043, op09Crocodile046],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        character: [{ card: op09Alvida043, rested: true }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const alvidaId = engine.findCardInZone("south", "character", op09Alvida043);
    const kayaId = engine.findCardInZone("south", "hand", op03Kaya044);
    const otherAlvidaId = engine.findCardInZone("south", "hand", op09Alvida043);
    const expensiveId = engine.findCardInZone("south", "hand", op09Crocodile046);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, alvidaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Alvida's play choice.");
    const candidates = play.candidates
      .filter((candidate) => candidate.legal)
      .map((candidate) => candidate.ref.id);
    expect(candidates).toContain(kayaId);
    expect(candidates).not.toContain(otherAlvidaId);
    expect(candidates).not.toContain(expensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [kayaId] }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Kaya's On Play hand trash.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawId, secondDrawId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(kayaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(alvidaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("without a Cross Guild Leader, its K.O. does not offer a Character from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Kaya044],
        character: [{ card: op09Alvida043, rested: true }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const alvidaId = engine.findCardInZone("south", "character", op09Alvida043);
    const kayaId = engine.findCardInZone("south", "hand", op03Kaya044);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, alvidaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(kayaId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(kayaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(alvidaId);
    expect(view.prompts).toHaveLength(0);
  });
});
