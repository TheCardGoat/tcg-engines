import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Hajrudin018, op01UltiMortar118 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP01-118 Ulti-Mortar", () => {
  test("maps DON!! -2 payment and Counter power before the mandatory draw", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Hajrudin018, playedOnTurn: 0 }],
      },
      {
        hand: [op01UltiMortar118],
        deck: [eb01Doma005],
        activeDon: 4,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op01Hajrudin018);
    const eventId = engine.findCardInZone("north", "hand", op01UltiMortar118);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const beforeCounter = engine.getView("north").players.north;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const costDecision = engine.pendingDecision("effectCostReturnDon", "north");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the defender to choose two DON!! cards for DON!! -2.");
    }
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "rested-don:0"] },
      "north",
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(beforeCounter.lifeCount);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.north.donDeckCount).toBe(beforeCounter.donDeckCount + 2);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("draws after paying DON!! -2 even when the optional power target is declined", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op01UltiMortar118],
        deck: [eb01Doma005],
        activeDon: 4,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op01UltiMortar118);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const beforeCounter = engine.getView("north").players.north;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "rested-don:0"] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.north.donDeckCount).toBe(beforeCounter.donDeckCount + 2);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("adds an optional active DON!! from its Life Trigger without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op01UltiMortar118],
        donDeckCount: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const beforeTrigger = engine.getView("north").players.north;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const donDecision = engine.pendingDecision("effectAddDon", "north");
    const donStep = donDecision.steps[0];
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected the damaged player to choose the optional active DON!! count.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(beforeTrigger.activeDon + 1);
    expect(view.players.north.donDeckCount).toBe(0);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(op01UltiMortar118.id);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
