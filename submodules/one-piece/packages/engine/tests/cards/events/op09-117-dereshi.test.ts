import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09BartholomewKuma108,
  op09Dereshi117,
  op09Pierre110,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-117 Dereshi!", () => {
  test("Main offers only other Trigger cards from the top five and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Dereshi117],
      deck: [
        op09Pierre110,
        op09BartholomewKuma108,
        op09Dereshi117,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: 3,
    });
    const firstId = engine.findCardInZone("south", "deck", op09Pierre110);
    const secondId = engine.findCardInZone("south", "deck", op09BartholomewKuma108);
    const excludedSelfId = engine.findCardInZone("south", "deck", op09Dereshi117);
    const revealedIds = engine.getState().players.south.deck.slice(0, 5);

    engine.playCard(op09Dereshi117);

    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the private Trigger-card search.");
    }
    expect(
      step.candidates.map((candidate) => ({ id: candidate.ref.id, legal: candidate.legal })),
    ).toEqual([
      { id: firstId, legal: true },
      { id: secondId, legal: true },
      { id: excludedSelfId, legal: false },
      { id: revealedIds[3], legal: false },
      { id: revealedIds[4], legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [firstId, secondId] }, "south");
    const remainder = revealedIds.filter(
      (instanceId) => instanceId !== firstId && instanceId !== secondId,
    );
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [...remainder].reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstId, secondId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one card without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op09Dereshi117] },
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
