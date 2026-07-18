import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Speed104 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-104 Speed", () => {
  test("plays the physical Life Trigger card when damaged", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op01Speed104] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const speedId = engine.findCardInZone("north", "life", op01Speed104);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === speedId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(speedId);
    expect(view.prompts).toHaveLength(0);
  });
});
