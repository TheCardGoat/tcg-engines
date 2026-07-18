import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op02IceAge117,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-117 Ice Age", () => {
  test("maps -5 cost to an opposing Character and expires it at turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02IceAge117],
        activeDon: 1,
      },
      {
        character: [eb01MountainGod018],
      },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op02IceAge117);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(5);
  });

  test("Life Trigger K.O.s only an opposing Character at the cost-3 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: op01Hajrudin018, playedOnTurn: 0 },
        ],
      },
      {
        life: [op02IceAge117],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const boundaryId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const excludedId = engine.findCardInZone("south", "character", op01Hajrudin018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing low-cost Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([boundaryId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(boundaryId);
    expect(view.players.south.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
