import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  op01DesertSpada088,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP01-088 Desert Spada", () => {
  test("maps Counter power, private top-3 ordering, and the shared top-or-bottom choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op01DesertSpada088],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Sanji014, eb01MountainGod018],
        activeDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op01DesertSpada088);
    const firstId = engine.findCardInZone("north", "deck", eb01Doma005);
    const secondId = engine.findCardInZone("north", "deck", eb01Fourtricks025);
    const selectedTopId = engine.findCardInZone("north", "deck", eb01Sanji014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const orderDecision = engine.pendingDecision("effectRearrangeDeckOrder", "north");
    const orderStep = orderDecision.steps[0];
    expect(orderStep?.kind).toBe("orderItems");
    if (orderStep?.kind !== "orderItems") {
      throw new Error("Expected the defender to privately order the looked-at cards.");
    }
    expect(orderStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstId,
      secondId,
      selectedTopId,
    ]);
    engine.resolveDecision(
      "effectRearrangeDeckOrder",
      { selectedIds: [selectedTopId, firstId, secondId] },
      "north",
    );

    const positionDecision = engine.pendingDecision("effectRearrangeDeckPosition", "north");
    const positionStep = positionDecision.steps[0];
    expect(positionStep?.kind).toBe("chooseOption");
    if (positionStep?.kind !== "chooseOption") {
      throw new Error("Expected the defender to choose top or bottom for all looked-at cards.");
    }
    expect(positionStep.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "top" }, "north");
    engine.endTurn("south");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(selectedTopId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("draws 2 from the Life Trigger before the controller chooses 1 card to trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        deck: [eb01Doma005, eb01Fourtricks025, eb01Sanji014, eb01MountainGod018, eb01Doma005],
        life: [op01DesertSpada088],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const selectedTrashId = engine.findCardInZone("north", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const trashDecision = engine.pendingDecision("effectTrashFromHandSelection", "north");
    const trashStep = trashDecision.steps[0];
    expect(trashStep?.kind).toBe("selectEntity");
    if (trashStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose one of the two drawn cards.");
    }
    expect(trashStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstDrawId,
      selectedTrashId,
    ]);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [selectedTrashId] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual([firstDrawId]);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selectedTrashId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
