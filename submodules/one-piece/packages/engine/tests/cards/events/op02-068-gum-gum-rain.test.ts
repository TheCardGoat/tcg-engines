import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02GumGumRain068,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function counterFixture() {
  return OnePieceTestEngine.create(
    {
      character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
    },
    {
      hand: [op02GumGumRain068, eb01Doma005, eb01Fourtricks025],
      life: 2,
    },
    SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
  );
}

describe("OP02-068 Gum-Gum Rain", () => {
  test("maps the optional hand cost and Counter recipient before battle resolution", () => {
    const engine = counterFixture();
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op02GumGumRain068);
    const costId = engine.findCardInZone("north", "hand", eb01Doma005);
    const keptId = engine.findCardInZone("north", "hand", eb01Fourtricks025);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "north");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the defender to choose the optional hand payment.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([costId, keptId]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [costId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, costId]),
    );
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("allows the defender to decline the optional hand cost and receive no power", () => {
    const engine = counterFixture();
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op02GumGumRain068);
    const keptId = engine.findCardInZone("north", "hand", eb01Doma005);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps either field and returns the chosen own cost-2 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      {
        character: [eb01Doma005],
        life: [op02GumGumRain068],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const ownId = engine.findCardInZone("north", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("south", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose a Character from either field.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      tooExpensiveId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(ownId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
