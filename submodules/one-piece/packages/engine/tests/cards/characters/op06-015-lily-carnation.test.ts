import { describe, expect, test } from "vite-plus/test";
import {
  op06Arlong023,
  op06BearKing012,
  op06DouglasBullet010,
  op06LilyCarnation015,
  op06RaiseMax016,
  op06Ratchet014,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-015 Lily Carnation", () => {
  test("once per turn trashes a 6000-power Character to play only a 2000-to-5000 FILM Character rested", () => {
    const engine = OnePieceTestEngine.create({
      character: [op06LilyCarnation015, op06BearKing012, op06Arlong023],
      trash: [op06RaiseMax016, op06Ratchet014, op06DouglasBullet010],
    });
    const lilyId = engine.findCardInZone("south", "character", op06LilyCarnation015);
    const bearKingId = engine.findCardInZone("south", "character", op06BearKing012);
    const arlongId = engine.findCardInZone("south", "character", op06Arlong023);
    const eligibleId = engine.findCardInZone("south", "trash", op06RaiseMax016);
    const tooWeakId = engine.findCardInZone("south", "trash", op06Ratchet014);
    const tooStrongId = engine.findCardInZone("south", "trash", op06DouglasBullet010);

    engine.activateEffect(lilyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashCharacter", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (payment?.kind !== "payCost") throw new Error("Expected Lily Carnation's Character cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([bearKingId, arlongId]),
    );
    expect(payment.candidates.map((candidate) => candidate.ref.id)).not.toContain(lilyId);
    engine.resolveDecision("effectCostTrashCharacter", { selectedIds: [bearKingId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Lily Carnation's trash play.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooWeakId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooStrongId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(bearKingId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(bearKingId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: lilyId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
