import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op09Crocodile046,
  op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-040 The Weak Do Not Have the Right to Choose How They Die", () => {
  test("Main K.O.s the rested cost-7 boundary and excludes active Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040],
        activeDon: 5,
      },
      {
        character: [{ card: op09Crocodile046, rested: true }, eb01MountainGod018],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", op09Crocodile046);
    const activeId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040);

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the rested cost-7 K.O. choice.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter exposes the same rested cost-7 K.O. interaction during battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op09Crocodile046, rested: true, playedOnTurn: 0 },
        ],
      },
      {
        hand: [op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040],
        activeDon: 5,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", op09Crocodile046);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040,
    );

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
