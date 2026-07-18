import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01DonquixoteDoflamingo060,
  op04WeaknessIsAnUnforgivableSin076,
  op10Violet062,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-062 Violet", () => {
  test("blocks, then may return DON!! to recover a purple Event with a compound-type Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01DonquixoteDoflamingo060,
        character: [op10Violet062],
        trash: [op04WeaknessIsAnUnforgivableSin076, eb01Doma005],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const violetId = engine.findCardInZone("south", "character", op10Violet062);
    const eventId = engine.findCardInZone("south", "trash", op04WeaknessIsAnUnforgivableSin076);
    const wrongCategoryId = engine.findCardInZone("south", "trash", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Violet's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(violetId);
    engine.resolveDecision("battleBlocker", { selectedIds: [violetId] }, "south");

    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Violet's trash choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eventId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCategoryId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eventId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(violetId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });
});
