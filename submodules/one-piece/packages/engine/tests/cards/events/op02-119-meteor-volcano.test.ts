import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  op02MeteorVolcano119,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-119 Meteor Volcano", () => {
  test("K.O.s only an opposing Character at the cost-1 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02MeteorVolcano119],
        activeDon: 2,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op02MeteorVolcano119);

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose an opposing cost-1 Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws 2 before the damaged player chooses a card to trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01Sanji014, eb01MountainGod018],
        life: [op02MeteorVolcano119],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const existingHandId = engine.findCardInZone("north", "hand", eb01Doma005);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Fourtricks025);
    const selectedDrawId = engine.findCardInZone("north", "deck", eb01Sanji014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const trashDecision = engine.pendingDecision("effectTrashFromHandSelection", "north");
    const trashStep = trashDecision.steps[0];
    expect(trashStep?.kind).toBe("selectEntity");
    if (trashStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose from the post-draw hand.");
    }
    expect(trashStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      existingHandId,
      firstDrawId,
      selectedDrawId,
    ]);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [selectedDrawId] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual([
      existingHandId,
      firstDrawId,
    ]);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selectedDrawId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
