import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op03SoapSheep095,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-095 Soap Sheep", () => {
  test("maps up to two opposing Characters to receive -2 cost until turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03SoapSheep095],
        activeDon: 1,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025, op01Hajrudin018],
      },
    );
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const unselectedId = engine.findCardInZone("north", "character", op01Hajrudin018);

    engine.playCard(op03SoapSheep095);

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose up to two opposing Characters.");
    }
    expect(targetStep.min).toBe(0);
    expect(targetStep.max).toBe(2);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstId,
      secondId,
      unselectedId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === firstId)?.cost).toBe(
      0,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === secondId)?.cost).toBe(
      1,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === unselectedId)?.cost,
    ).toBe(4);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === firstId)?.cost).toBe(
      1,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === secondId)?.cost).toBe(
      3,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger gives the opponent ownership of the mandatory hand-trash choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op03SoapSheep095],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const otherId = engine.findCardInZone("south", "hand", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const trashDecision = engine.pendingDecision("effectTrashFromHandSelection", "south");
    const trashStep = trashDecision.steps[0];
    expect(trashStep?.kind).toBe("selectEntity");
    if (trashStep?.kind !== "selectEntity") {
      throw new Error("Expected the Event controller's opponent to choose their discarded card.");
    }
    expect(trashStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedId,
      otherId,
    ]);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([otherId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
