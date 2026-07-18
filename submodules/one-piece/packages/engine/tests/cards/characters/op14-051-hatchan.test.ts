import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op14eb04Hatchan051 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-051 Hatchan", () => {
  test("uses its trigger-time attached DON!! after battle K.O. returns those DON!! rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [{ card: op14eb04Hatchan051, attachedDon: 2, rested: true }],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const hatchanId = engine.findCardInZone("north", "character", op14eb04Hatchan051);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, hatchanId, "south");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.north.restedDon).toBe(2);
    expect(engine.getState().cards[hatchanId]?.attachedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
