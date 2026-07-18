import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01MountainGod018, eb01OffWhite019, op08Thatch045 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const returnThatch: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP08-045-RETURN",
  canonicalId: "TEST-OP08-045-RETURN",
  name: "Thatch Removal Review",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

registerCards([returnThatch]);

describe("OP08-045 Thatch", () => {
  test("automatically replaces opponent-effect removal by trashing itself and drawing", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08Thatch045], deck: [eb01Doma005, eb01Doma005] },
      { hand: [returnThatch] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const thatchId = engine.findCardInZone("south", "character", op08Thatch045);
    const handBefore = engine.getView("south").players.south.handCount;

    engine.playCard(returnThatch, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [thatchId] }, "north");

    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(thatchId);
    expect(view.players.south.handCount).toBe(handBefore + 1);
  });

  test("automatically replaces battle K.O. by trashing itself and drawing", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08Thatch045, rested: true }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const thatchId = engine.findCardInZone("south", "character", op08Thatch045);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const handBefore = engine.getView("south").players.south.handCount;

    engine.declareAttack(attackerId, thatchId, "north");

    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(thatchId);
    expect(view.players.south.handCount).toBe(handBefore + 1);
  });
});
