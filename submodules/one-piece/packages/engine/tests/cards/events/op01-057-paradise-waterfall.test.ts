import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  op01ParadiseWaterfall057,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP01-057 Paradise Waterfall", () => {
  test("maps the ordered Counter power and Character reactivation choices", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Sanji014, playedOnTurn: 0 }],
      },
      {
        hand: [op01ParadiseWaterfall057],
        character: [{ card: eb01Doma005, rested: true }, eb01Fourtricks025],
        activeDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Sanji014);
    const eventId = engine.findCardInZone("north", "hand", op01ParadiseWaterfall057);
    const selectedRestedId = engine.findCardInZone("north", "character", eb01Doma005);
    const otherCharacterId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const lifeBeforeAttack = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "north");
    const powerStep = powerDecision.steps[0];
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the Counter power choice.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      selectedRestedId,
      otherCharacterId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const activeDecision = engine.pendingDecision("effectTargetSelection", "north");
    const activeStep = activeDecision.steps[0];
    expect(activeStep?.kind).toBe("selectEntity");
    if (activeStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the Character reactivation choice.");
    }
    expect(activeStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedRestedId,
      otherCharacterId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedRestedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBeforeAttack);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedRestedId)?.rested,
    ).toBe(false);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the Life Trigger K.O. only a rested opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: false },
        ],
      },
      {
        life: [op01ParadiseWaterfall057],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", eb01Doma005);
    const activeExcludedId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to receive the opposing K.O. choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      activeExcludedId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
