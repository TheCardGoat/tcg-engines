import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Pell014,
  op10FoLlowMeAndIWillGuiDeYou059,
  op10Issho023,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-059 Fo...llow...Me...and...I...Will...Gui...de...You", () => {
  test("Life Trigger activates Main and searches an included Dressrosa Character without payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op10FoLlowMeAndIWillGuiDeYou059],
        deck: [
          op10Issho023,
          eb01Doma005,
          op10FoLlowMeAndIWillGuiDeYou059,
          op05Pell014,
          eb01MountainGod018,
        ],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("north", "deck", op10Issho023);
    const revealedIds = engine.getState().players.north.deck.slice(0, 5);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const decision = engine.pendingDecision("effectSearchSelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the Trigger-activated Dressrosa search.");
    }
    expect(step.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "north");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: revealedIds.filter((instanceId) => instanceId !== selectedId).reverse() },
      "north",
    );

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
