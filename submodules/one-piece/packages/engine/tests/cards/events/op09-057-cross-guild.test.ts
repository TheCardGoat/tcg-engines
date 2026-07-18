import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Pell014,
  op09CrossGuild057,
  op09Mr1DazBonez055,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-057 Cross Guild", () => {
  test("Life Trigger activates Main and searches an included Cross Guild type without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op09CrossGuild057],
        deck: [op09Mr1DazBonez055, eb01Doma005, op05Pell014, eb01Fourtricks025],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("north", "deck", op09Mr1DazBonez055);
    const revealedIds = engine.getState().players.north.deck.slice(0, 4);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const searchDecision = engine.pendingDecision("effectSearchSelection", "north");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the Trigger-activated Cross Guild search.");
    }
    expect(searchStep.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(
      true,
    );
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
