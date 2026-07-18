import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02YasakaniSacredJewel118,
  op03GalleyLaCompany075,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-118 Yasakani Sacred Jewel", () => {
  test("maps the optional hand cost and protects the selected Character from battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op02YasakaniSacredJewel118, eb01Doma005],
        character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const defenderId = engine.findCardInZone("north", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op02YasakaniSacredJewel118);
    const costId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, defenderId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [defenderId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === defenderId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, costId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger K.O.s an opposing Stage at the cost-3 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        stage: op03GalleyLaCompany075,
      },
      {
        life: [op02YasakaniSacredJewel118],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const stageId = engine.findCardInZone("south", "stage", op03GalleyLaCompany075);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [stageId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.stage).toBeNull();
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(stageId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
