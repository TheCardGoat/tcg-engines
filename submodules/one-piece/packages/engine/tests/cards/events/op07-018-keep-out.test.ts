import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op05BartholomewKuma011, op07KeepOut018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function characterPower(engine: OnePieceTestEngine, instanceId: string) {
  const power = engine
    .getView("north")
    .players.north.characters.find((card) => card?.instanceId === instanceId)?.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the Character to expose its current power.");
  }
  return power;
}

describe("OP07-018 Keep Out", () => {
  test("Counter includes a compound Revolutionary Army Character through the end of the next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op07KeepOut018],
        character: [op05BartholomewKuma011],
        life: 2,
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op07KeepOut018);
    const recipientId = engine.findCardInZone("north", "character", op05BartholomewKuma011);
    const powerBefore = characterPower(engine, recipientId);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "north");

    expect(characterPower(engine, recipientId)).toBe(powerBefore + 2000);
    engine.endTurn("south");
    expect(characterPower(engine, recipientId)).toBe(powerBefore + 2000);
    engine.endTurn("north");
    expect(characterPower(engine, recipientId)).toBe(powerBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates the Counter recipient choice without DON!! payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op07KeepOut018],
        character: [op05BartholomewKuma011],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const recipientId = engine.findCardInZone("north", "character", op05BartholomewKuma011);
    const powerBefore = characterPower(engine, recipientId);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "north");

    expect(characterPower(engine, recipientId)).toBe(powerBefore + 2000);
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
