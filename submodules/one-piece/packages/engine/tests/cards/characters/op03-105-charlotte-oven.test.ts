import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op03CharlotteOven105,
  op03CharlottePerospero113,
  op03DonquixoteDoflamingoWantedPoster009,
  op03Napoleon117,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-105 Charlotte Oven", () => {
  test("trashes only a Trigger card to gain +3000 during this battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03CharlotteOven105, attachedDon: 1, playedOnTurn: 0 }],
        hand: [op03Napoleon117, op03CharlottePerospero113, eb01Doma005],
      },
      {
        character: [
          { card: op03DonquixoteDoflamingoWantedPoster009, rested: true, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ovenId = engine.findCardInZone("south", "character", op03CharlotteOven105);
    const triggerId = engine.findCardInZone("south", "hand", op03Napoleon117);
    const otherTriggerId = engine.findCardInZone("south", "hand", op03CharlottePerospero113);
    const nonTriggerId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone(
      "north",
      "character",
      op03DonquixoteDoflamingoWantedPoster009,
    );

    engine.declareAttack(ovenId, targetId, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Oven's Trigger-card cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      triggerId,
      otherTriggerId,
    ]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonTriggerId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [triggerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.characters.find((card) => card?.instanceId === ovenId)?.power).toBe(
      5000,
    );
  });
});
