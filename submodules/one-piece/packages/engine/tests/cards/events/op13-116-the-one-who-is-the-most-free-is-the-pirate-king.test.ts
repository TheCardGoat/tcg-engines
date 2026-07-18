import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Caribou007,
  op13TheOneWhoIsTheMostFreeIsThePirateKing116,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-116 The One Who Is the Most Free Is the Pirate King!!!", () => {
  test("Main finds a Supernovas Character and orders the bottom-deck remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13TheOneWhoIsTheMostFreeIsThePirateKing116],
      deck: [op01Caribou007, eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "deck", op01Caribou007);
    const initialDeckIds = [...engine.getState().players.south.deck];

    engine.playCard(op13TheOneWhoIsTheMostFreeIsThePirateKing116);
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a private search choice.");
    expect(step.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: initialDeckIds.filter((id) => id !== selectedId).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(engine.getState().players.south.deck).toEqual(
      initialDeckIds.filter((id) => id !== selectedId).reverse(),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op13TheOneWhoIsTheMostFreeIsThePirateKing116],
        deck: [op01Caribou007, eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lookedIds = [...engine.getState().players.north.deck];

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: lookedIds }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(0);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      op13TheOneWhoIsTheMostFreeIsThePirateKing116.id,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
