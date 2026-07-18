import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op06Nekomamushi110 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-110 Nekomamushi", () => {
  test("Life Trigger plays the physical card when the opponent has three Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: 3,
      },
      { life: [op06Nekomamushi110] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const nekomamushiId = engine.findCardInZone("north", "life", op06Nekomamushi110);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(nekomamushiId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(nekomamushiId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with DON!! x2 attacks and K.O.s an active opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op06Nekomamushi110, attachedDon: 2, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const nekomamushiId = engine.findCardInZone("south", "character", op06Nekomamushi110);
    const activeTargetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(nekomamushiId, activeTargetId, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      activeTargetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
