import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Hajrudin018,
  op05Charlestone038,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP05-038 Charlestone", () => {
  test("Counter protects first, then optionally trashes from hand to activate up to 3 DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op05Charlestone038, eb01Doma005],
        activeDon: 2,
        restedDon: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op05Charlestone038);
    const costId = engine.findCardInZone("north", "hand", eb01Doma005);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const donDecision = engine.pendingDecision("effectSetActiveDon", "north");
    const donStep = donDecision.steps[0];
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected an up-to-3 rested DON!! count choice.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1", "2", "3"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "3" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.activeDon).toBe(3);
    expect(view.players.north.restedDon).toBe(2);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, costId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("declining the optional hand trash keeps the card and does not activate DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op05Charlestone038, eb01Doma005],
        activeDon: 2,
        restedDon: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op05Charlestone038);
    const retainedId = engine.findCardInZone("north", "hand", eb01Doma005);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.activeDon).toBe(0);
    expect(view.players.north.restedDon).toBe(5);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(retainedId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps Leader-or-Character and effective cost-3 filtering", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op01Hajrudin018, playedOnTurn: 0 },
        ],
      },
      {
        life: [op05Charlestone038],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("south", "character", op01Hajrudin018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const restDecision = engine.pendingDecision("effectTargetSelection", "north");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing low-cost recipient.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toContain(
      engine.leader("south"),
    );
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toContain(selectedId);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(
      engine
        .getView("north")
        .players.south.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
