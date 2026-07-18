import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01MountainGod018, eb01OffWhite019, op06Denjiro109 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const koEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP06-109-KO",
  canonicalId: "TEST-OP06-109-KO",
  name: "Denjiro K.O. Review",
  cost: 0,
  effect: "[Main] K.O. up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
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

registerCards([koEvent]);

describe("OP06-109 Denjiro", () => {
  test("Life Trigger plays the physical card when the opponent has three Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: 3,
      },
      { life: [op06Denjiro109] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const denjiroId = engine.findCardInZone("north", "life", op06Denjiro109);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(denjiroId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(denjiroId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with DON!! x2 and three opposing Life, cannot be K.O.'d by an effect", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [koEvent], life: 3 },
      { character: [{ card: op06Denjiro109, attachedDon: 2, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const denjiroId = engine.findCardInZone("north", "character", op06Denjiro109);

    engine.playCard(koEvent, "south");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(denjiroId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(denjiroId);
    expect(view.prompts).toHaveLength(0);
  });
});
