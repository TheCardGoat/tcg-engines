import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01RadicalBeam029 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP01-029 Radical Beam!!", () => {
  test("at 2 Life, maps one recipient and gives that same card the additional power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op01RadicalBeam029],
        character: [eb01Doma005],
        activeDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op01RadicalBeam029);
    const defenderCharacterId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBeforeAttack = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the Counter recipient choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      defenderCharacterId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBeforeAttack);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("above 2 Life, applies only the initial power increase", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op01RadicalBeam029],
        activeDon: 1,
        life: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op01RadicalBeam029);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
