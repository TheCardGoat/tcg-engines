import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04DonquixoteDoflamingo031,
  op04DonquixoteFamily036,
  op04Sugar024,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

const SEARCH_DECK = [
  op04DonquixoteDoflamingo031,
  op04Sugar024,
  op04DonquixoteFamily036,
  eb01Doma005,
  eb01Fourtricks025,
] as const;

describe("OP04-036 Donquixote Family", () => {
  test("Counter privately searches exact and compound Donquixote Pirates cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      {
        hand: [op04DonquixoteFamily036],
        deck: [...SEARCH_DECK],
        activeDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op04DonquixoteFamily036);
    const selectedId = engine.findCardInZone("north", "deck", op04DonquixoteDoflamingo031);
    const exactId = engine.findCardInZone("north", "deck", op04Sugar024);
    const eventSearchId = engine.findCardInZone("north", "deck", op04DonquixoteFamily036);
    const firstUnrelatedId = engine.findCardInZone("north", "deck", eb01Doma005);
    const secondUnrelatedId = engine.findCardInZone("north", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const searchDecision = engine.pendingDecision("effectSearchSelection", "north");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the private Donquixote search choice.");
    }
    expect(
      searchStep.candidates.map((candidate) => ({ id: candidate.ref.id, legal: candidate.legal })),
    ).toEqual([
      { id: selectedId, legal: true },
      { id: exactId, legal: true },
      { id: eventSearchId, legal: true },
      { id: firstUnrelatedId, legal: false },
      { id: secondUnrelatedId, legal: false },
    ]);
    expect(JSON.stringify(engine.getView("south").decisions)).not.toContain(
      op04DonquixoteDoflamingo031.name,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "north");

    const remainderOrder = [secondUnrelatedId, firstUnrelatedId, eventSearchId, exactId];
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 1, deckCount: 4 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Counter search without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op04DonquixoteFamily036],
        deck: [...SEARCH_DECK],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const before = engine.getView("north").players.north;
    const deckIds = [...engine.getState().players.north.deck];

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const searchDecision = engine.pendingDecision("effectSearchSelection", "north");
    expect(searchDecision.actorId).toBe("north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: deckIds }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({
      activeDon: before.activeDon,
      restedDon: before.restedDon,
      deckCount: before.deckCount,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
