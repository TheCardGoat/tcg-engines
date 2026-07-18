import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Pell014,
  op09MurderAtTheSteamBath059,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-059 Murder at the Steam Bath", () => {
  test("Counter trashes the same number from deck that the controller chose from hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op09MurderAtTheSteamBath059, eb01Doma005, op05Pell014],
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        life: 2,
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op09MurderAtTheSteamBath059);
    const firstHandId = engine.findCardInZone("north", "hand", eb01Doma005);
    const secondHandId = engine.findCardInZone("north", "hand", op05Pell014);
    const deckIds = engine.getState().players.north.deck.slice(0, 2);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    expect(engine.getView("north").players.north.leader.power).toBe(8000);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstHandId, secondHandId] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstHandId, secondHandId, ...deckIds]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one card without Counter payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op09MurderAtTheSteamBath059] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const handBefore = engine.getView("north").players.north.hand.length;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand).toHaveLength(handBefore + 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
