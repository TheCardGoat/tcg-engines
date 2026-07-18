import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  op03UsoppSRubberBandOfDoom054,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-054 Usopp's Rubber Band of Doom!!!", () => {
  test("maps Counter power and allows the defender to decline the optional top-deck trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }],
      },
      {
        hand: [op03UsoppSRubberBandOfDoom054],
        deck: [eb01Doma005, eb01Sanji014],
        activeDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const eventId = engine.findCardInZone("north", "hand", op03UsoppSRubberBandOfDoom054);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    const deckBefore = engine.getView("north").players.north.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const optionalTrash = engine.pendingDecision("effectActionOptional", "north").steps[0];
    expect(optionalTrash?.kind).toBe("confirm");
    if (optionalTrash?.kind !== "confirm") {
      throw new Error("Expected the defender to confirm the optional top-deck trash.");
    }
    engine.resolveDecision("effectActionOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws 1 before the optional next top card is trashed", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        deck: [eb01Doma005, eb01Fourtricks025, eb01Sanji014, eb01MountainGod018],
        life: [op03UsoppSRubberBandOfDoom054],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const trashId = engine.findCardInZone("north", "deck", eb01Fourtricks025);
    const remainingId = engine.findCardInZone("north", "deck", eb01Sanji014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const optionalTrash = engine.pendingDecision("effectActionOptional", "north").steps[0];
    expect(optionalTrash?.kind).toBe("confirm");
    if (optionalTrash?.kind !== "confirm") {
      throw new Error("Expected the damaged player to confirm the optional deck trash.");
    }
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    engine.resolveDecision("effectActionOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(trashId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(remainingId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
