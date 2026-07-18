import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09DonquixoteDoflamingo031,
  op10IDoNotForgiveThoseWhoLaughAtMyFamily078,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

const searchDeck = [
  op09DonquixoteDoflamingo031,
  op10IDoNotForgiveThoseWhoLaughAtMyFamily078,
  eb01Doma005,
];

describe("OP10-078 I Do Not Forgive Those Who Laugh at My Family!!!", () => {
  test("Main searches an included Donquixote Pirates card and excludes its own name", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10IDoNotForgiveThoseWhoLaughAtMyFamily078],
      deck: searchDeck,
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "deck", op09DonquixoteDoflamingo031);
    const excludedId = engine.findCardInZone(
      "south",
      "deck",
      op10IDoNotForgiveThoseWhoLaughAtMyFamily078,
    );
    const revealedIds = engine.getState().players.south.deck.slice(0, 3);

    engine.playCard(op10IDoNotForgiveThoseWhoLaughAtMyFamily078);

    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the Main Donquixote Pirates search.");
    }
    expect(step.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(true);
    expect(step.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: revealedIds.filter((instanceId) => instanceId !== selectedId).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter exposes the same private search and ordered remainder during battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op10IDoNotForgiveThoseWhoLaughAtMyFamily078],
        deck: searchDeck,
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op10IDoNotForgiveThoseWhoLaughAtMyFamily078,
    );
    const selectedId = engine.findCardInZone("north", "deck", op09DonquixoteDoflamingo031);
    const revealedIds = engine.getState().players.north.deck.slice(0, 3);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "north");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: revealedIds.filter((instanceId) => instanceId !== selectedId).reverse() },
      "north",
    );

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
