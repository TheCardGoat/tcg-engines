import { describe, expect, test } from "vite-plus/test";
import {
  op06Arlong023,
  op06LilyCarnation015,
  op06RaiseMax016,
  op06Ratchet014,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-014 Ratchet", () => {
  test("on an opponent's attack trashes any chosen FILM cards to scale one battle target", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06LilyCarnation015, op06RaiseMax016, op06Arlong023],
        character: [op06Ratchet014],
        life: [op06Ratchet014],
      },
      { character: [{ card: op06Arlong023, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", op06Arlong023);
    const firstFilmId = engine.findCardInZone("south", "hand", op06LilyCarnation015);
    const secondFilmId = engine.findCardInZone("south", "hand", op06RaiseMax016);
    const excludedId = engine.findCardInZone("south", "hand", op06Arlong023);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (trash?.kind !== "selectEntity") throw new Error("Expected Ratchet's FILM discard choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstFilmId,
      secondFilmId,
    ]);
    expect(trash.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstFilmId, secondFilmId] },
      "south",
    );

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Ratchet's battle target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([
        engine.leader("south"),
        engine.findCardInZone("south", "character", op06Ratchet014),
      ]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([
      firstFilmId,
      secondFilmId,
    ]);
    expect(view.players.south.leader.power).toBe(5000);
  });
});
