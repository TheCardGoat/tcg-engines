import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op05BartholomewKuma011,
  op05Hack012,
  op07GalaxyWink016,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function characterPower(engine: OnePieceTestEngine, seat: "south" | "north", instanceId: string) {
  const power = engine
    .getView(seat)
    .players[seat].characters.find((card) => card?.instanceId === instanceId)?.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the Character to expose its current power.");
  }
  return power;
}

describe("OP07-016 Galaxy Wink", () => {
  test("Main includes compound Revolutionary Army traits and applies both power changes", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07GalaxyWink016],
        character: [op05BartholomewKuma011],
        activeDon: 1,
      },
      {
        character: [op05Hack012],
      },
    );
    const allyId = engine.findCardInZone("south", "character", op05BartholomewKuma011);
    const opponentId = engine.findCardInZone("north", "character", op05Hack012);
    const allyPowerBefore = characterPower(engine, "south", allyId);
    const opponentPowerBefore = characterPower(engine, "north", opponentId);

    engine.playCard(op07GalaxyWink016);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [allyId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opponentId] }, "south");

    expect(characterPower(engine, "south", allyId)).toBe(allyPowerBefore + 2000);
    expect(characterPower(engine, "north", opponentId)).toBe(opponentPowerBefore - 1000);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates both Main power choices without DON!! payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05Hack012],
      },
      {
        life: [op07GalaxyWink016],
        character: [op05BartholomewKuma011],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const allyId = engine.findCardInZone("north", "character", op05BartholomewKuma011);
    const opponentId = engine.findCardInZone("south", "character", op05Hack012);
    const allyPowerBefore = characterPower(engine, "north", allyId);
    const opponentPowerBefore = characterPower(engine, "south", opponentId);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [allyId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opponentId] }, "north");

    expect(characterPower(engine, "north", allyId)).toBe(allyPowerBefore + 2000);
    expect(characterPower(engine, "south", opponentId)).toBe(opponentPowerBefore - 1000);
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
