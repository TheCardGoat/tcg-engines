import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op04Rabiyan113 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-113 Rabiyan", () => {
  test("plays the physical resolving Life card through its Trigger", () => {
    expect(op04Rabiyan113.traits).toEqual(["Big Mom Pirates", "Homies"]);
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04Rabiyan113] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op04Rabiyan113);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(triggerId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
