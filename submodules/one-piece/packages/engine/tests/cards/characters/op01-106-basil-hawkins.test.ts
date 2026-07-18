import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01BasilHawkins106 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-106 Basil Hawkins", () => {
  test("plays the physical Life Trigger card, then adds the chosen rested DON!! on play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op01BasilHawkins106],
        donDeckCount: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op01BasilHawkins106);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const addDon = engine.pendingDecision("effectAddDon", "north").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") {
      throw new Error("Expected Basil Hawkins's optional rested DON!! addition.");
    }
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === triggerId)).toBe(true);
    expect(view.players.north).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
