import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Carrot009 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-009 Carrot", () => {
  test("plays the damaged Life card itself when its Trigger is activated", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op01Carrot009] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const carrotId = engine.findCardInZone("north", "life", op01Carrot009);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(carrotId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(carrotId);
    expect(view.prompts).toHaveLength(0);
  });
});
