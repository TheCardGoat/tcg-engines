import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op10GumGumRhinoSchneider097,
  op10Issho023,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-097 Gum-Gum Rhino Schneider", () => {
  test("Main gives the same included Dressrosa Character +2000 and Banish at 10 trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10GumGumRhinoSchneider097],
        character: [{ card: op10Issho023, playedOnTurn: 0 }],
        trash: Array.from({ length: 10 }, () => eb01Doma005),
        activeDon: 1,
      },
      { life: [eb01Doma005] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const targetId = engine.findCardInZone("south", "character", op10Issho023);
    const lifeId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.playCard(op10GumGumRhinoSchneider097);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(8000);

    engine.declareAttack(targetId, engine.leader("north"), "south");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(lifeId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws two before requiring one card to be trashed", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op10GumGumRhinoSchneider097],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const trashId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const hand = engine.getView("north").players.north.hand;
    expect(hand).toHaveLength(2);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [trashId] }, "north");

    expect(engine.getView("north").players.north.hand).toHaveLength(1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
