import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09Usopp024,
  op11Aladine024,
  op11VagabondDrill039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-039 Vagabond Drill", () => {
  test("Counter accepts an included Merfolk recipient before resting an opposing cost-3 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        hand: [op11VagabondDrill039],
        character: [{ card: op11Aladine024, rested: true, playedOnTurn: 0 }],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const restId = engine.findCardInZone("south", "character", eb01Doma005);
    const defenderId = engine.findCardInZone("north", "character", op11Aladine024);
    const eventId = engine.findCardInZone("north", "hand", op11VagabondDrill039);

    engine.declareAttack(attackerId, defenderId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [defenderId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === defenderId)).toBe(
      true,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === restId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger rests the opposing cost-4 boundary without Counter payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op09Usopp024, playedOnTurn: 0 },
        ],
      },
      { life: [op11VagabondDrill039] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op09Usopp024);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
