import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op07SlowSlowBeam075,
  op10Sugar003,
  op10Violet062,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-062 Violet", () => {
  test("after blocking and K.O., returns DON!! before recovering a purple Event", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Sugar003,
        character: [{ card: op10Violet062, playedOnTurn: 0 }],
        trash: [op07SlowSlowBeam075],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const violetId = engine.findCardInZone("south", "character", op10Violet062);
    const eventId = engine.findCardInZone("south", "trash", op07SlowSlowBeam075);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(violetId, 1, "south");
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [violetId] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Violet's Event target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eventId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eventId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
