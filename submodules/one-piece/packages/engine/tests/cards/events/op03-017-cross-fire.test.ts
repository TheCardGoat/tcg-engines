import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02EdwardNewgate001, op03CrossFire017 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function characterPower(engine: OnePieceTestEngine, seat: "south" | "north", instanceId: string) {
  const power = engine
    .getView(seat)
    .players[seat === "south" ? "north" : "south"].characters.find(
      (card) => card?.instanceId === instanceId,
    )?.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the opposing Character to expose its current power.");
  }
  return power;
}

describe("OP03-017 Cross Fire", () => {
  test("Main accepts a compound Whitebeard Pirates Leader and expires -4000 at turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EdwardNewgate001,
        hand: [op03CrossFire017],
        activeDon: 2,
      },
      {
        character: [eb01MountainGod018],
      },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const powerBefore = characterPower(engine, "south", targetId);

    engine.playCard(op03CrossFire017);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(characterPower(engine, "south", targetId)).toBe(powerBefore - 4000);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(characterPower(engine, "south", targetId)).toBe(powerBefore);
  });

  test("Counter maps the attacking Character as the opponent-owned power target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op02EdwardNewgate001,
        hand: [op03CrossFire017],
        activeDon: 2,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op03CrossFire017);
    const powerBefore = characterPower(engine, "north", attackerId);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    const view = engine.getView("north");
    expect(characterPower(engine, "north", attackerId)).toBe(powerBefore - 4000);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op02EdwardNewgate001,
        life: [op03CrossFire017],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const powerBefore = characterPower(engine, "north", attackerId);
    const activeDonBefore = engine.getView("north").players.north.activeDon;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    const view = engine.getView("north");
    expect(characterPower(engine, "north", attackerId)).toBe(powerBefore - 4000);
    expect(view.players.north.activeDon).toBe(activeDonBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
