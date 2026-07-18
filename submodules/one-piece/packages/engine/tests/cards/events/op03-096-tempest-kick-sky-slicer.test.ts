import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03GalleyLaCompany075,
  op03SoapSheep095,
  op03TempestKickSkySlicer096,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-096 Tempest Kick Sky Slicer", () => {
  test("maps both player-selected K.O. branches to their distinct card types and costs", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03SoapSheep095, op03TempestKickSkySlicer096, op03TempestKickSkySlicer096],
        activeDon: 5,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025],
        stage: op03GalleyLaCompany075,
      },
    );
    const zeroCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const nonzeroCostId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const stageId = engine.findCardInZone("north", "stage", op03GalleyLaCompany075);

    engine.playCard(op03SoapSheep095);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [zeroCostId] }, "south");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === zeroCostId)?.cost,
    ).toBe(0);

    engine.playCard(op03TempestKickSkySlicer096);
    const firstChoice = engine.pendingDecision("effectActionChoice", "south");
    expect(firstChoice.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [
        { id: "0", value: "0" },
        { id: "1", value: "1" },
      ],
    });
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const characterDecision = engine.pendingDecision("effectTargetSelection", "south");
    const characterStep = characterDecision.steps[0];
    expect(characterStep?.kind).toBe("selectEntity");
    if (characterStep?.kind !== "selectEntity") {
      throw new Error("Expected the Character branch to publish its cost-0 choice.");
    }
    expect(characterStep.candidates.map((candidate) => candidate.ref.id)).toEqual([zeroCostId]);
    expect(characterStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      nonzeroCostId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [zeroCostId] }, "south");

    engine.playCard(op03TempestKickSkySlicer096);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    const stageDecision = engine.pendingDecision("effectTargetSelection", "south");
    const stageStep = stageDecision.steps[0];
    expect(stageStep?.kind).toBe("selectEntity");
    if (stageStep?.kind !== "selectEntity") {
      throw new Error("Expected the Stage branch to publish its cost-3 boundary choice.");
    }
    expect(stageStep.candidates.map((candidate) => candidate.ref.id)).toEqual([stageId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [stageId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([zeroCostId, stageId]),
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === nonzeroCostId)).toBe(
      true,
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws the top two cards without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op03TempestKickSkySlicer096],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("north", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual([
      firstDrawId,
      secondDrawId,
    ]);
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 0, deckCount: 2 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
