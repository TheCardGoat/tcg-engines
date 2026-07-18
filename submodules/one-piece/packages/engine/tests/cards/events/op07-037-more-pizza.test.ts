import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Caribou007,
  op07MorePizza037,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-037 More Pizza!!", () => {
  test("Main searches compound Supernovas, excludes itself, and orders the bottom remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07MorePizza037],
      deck: [op01Caribou007, op07MorePizza037, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "deck", op01Caribou007);
    const excludedEventId = engine.findCardInZone("south", "deck", op07MorePizza037);
    const initialDeckIds = [...engine.getState().players.south.deck];

    engine.playCard(op07MorePizza037);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the private Supernovas search choice.");
    }
    expect(searchStep.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(
      true,
    );
    expect(
      searchStep.candidates.find((candidate) => candidate.ref.id === excludedEventId)?.legal,
    ).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: initialDeckIds.filter((id) => id !== selectedId).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws the top card without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op07MorePizza037],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
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
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
