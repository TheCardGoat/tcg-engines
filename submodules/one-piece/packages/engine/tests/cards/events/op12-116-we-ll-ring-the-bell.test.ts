import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op06Braham111,
  op08MontBlancNoland109,
  op12WeLlRingTheBellWaitingForYou116,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP12-116 We'll Ring the Bell Waiting for You!!", () => {
  test("Main adds one included Shandian Warrior and Mont Blanc Noland, then orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12WeLlRingTheBellWaitingForYou116],
      deck: [op06Braham111, op08MontBlancNoland109, eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: 3,
    });
    const warriorId = engine.findCardInZone("south", "deck", op06Braham111);
    const nolandId = engine.findCardInZone("south", "deck", op08MontBlancNoland109);
    const lookedIds = engine.getState().players.south.deck.slice(0, 5);

    engine.playCard(op12WeLlRingTheBellWaitingForYou116);
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected the top-five search choice.");
    expect(step.candidates.find((candidate) => candidate.ref.id === warriorId)?.legal).toBe(true);
    expect(step.candidates.find((candidate) => candidate.ref.id === nolandId)?.legal).toBe(true);
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [warriorId, nolandId] },
      "south",
    );
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: lookedIds.filter((id) => id !== warriorId && id !== nolandId).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([warriorId, nolandId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one without entering the Main search", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op12WeLlRingTheBellWaitingForYou116],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
