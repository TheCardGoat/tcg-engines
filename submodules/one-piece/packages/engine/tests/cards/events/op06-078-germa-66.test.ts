import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06Germa66078,
  op06VinsmokeIchiji060,
  op06VinsmokeSora063,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

const SEARCH_DECK = [
  op06VinsmokeIchiji060,
  op06VinsmokeSora063,
  op06Germa66078,
  eb01Doma005,
  eb01Fourtricks025,
] as const;

describe("OP06-078 GERMA 66", () => {
  test("Main privately searches included GERMA traits while excluding the named Event", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Germa66078],
      deck: [...SEARCH_DECK],
      activeDon: 1,
    });
    const firstEligibleId = engine.findCardInZone("south", "deck", op06VinsmokeIchiji060);
    const selectedId = engine.findCardInZone("south", "deck", op06VinsmokeSora063);
    const excludedEventId = engine.findCardInZone("south", "deck", op06Germa66078);
    const unrelatedIds = [
      engine.findCardInZone("south", "deck", eb01Doma005),
      engine.findCardInZone("south", "deck", eb01Fourtricks025),
    ];

    engine.playCard(op06Germa66078);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    expect(
      engine.getView("north").decisions.some((decision) => decision.id === searchDecision.id),
    ).toBe(false);
    expect(
      engine.getView("spectator").decisions.some((decision) => decision.id === searchDecision.id),
    ).toBe(false);
    expect(
      engine.getView("judge").decisions.some((decision) => decision.id === searchDecision.id),
    ).toBe(true);
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the private included-GERMA search choice.");
    }
    expect(
      searchStep.candidates.map((candidate) => ({ id: candidate.ref.id, legal: candidate.legal })),
    ).toEqual([
      { id: firstEligibleId, legal: true },
      { id: selectedId, legal: true },
      { id: excludedEventId, legal: false },
      { id: unrelatedIds[0], legal: false },
      { id: unrelatedIds[1], legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

    const remainderDecision = engine.pendingDecision("effectSearchRemainderOrder", "south");
    expect(
      engine.getView("north").decisions.some((decision) => decision.id === remainderDecision.id),
    ).toBe(false);
    expect(
      engine
        .getView("spectator")
        .decisions.some((decision) => decision.id === remainderDecision.id),
    ).toBe(false);
    expect(
      engine.getView("judge").decisions.some((decision) => decision.id === remainderDecision.id),
    ).toBe(true);
    engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: remainderDecision.id,
      selectedIds: [firstEligibleId, firstEligibleId, excludedEventId, unrelatedIds[0]!],
    });
    const bottomOrder = [unrelatedIds[1]!, unrelatedIds[0]!, excludedEventId, firstEligibleId];
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getState().players.south.deck).toEqual(bottomOrder);
    expect(
      engine
        .getView("north")
        .logs.some((entry) => entry.message.includes(op06VinsmokeSora063.name)),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Main may reveal nothing and privately orders a short searched deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Germa66078],
      deck: [op06VinsmokeIchiji060, op06Germa66078, eb01Doma005],
      activeDon: 1,
    });
    const deckIds = [...engine.getState().players.south.deck];

    engine.playCard(op06Germa66078);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const remainder = [...deckIds].reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainder }, "south");

    expect(engine.getState().players.south.deck).toEqual(remainder);
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger draws 1 without Main search or Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op06Germa66078],
        deck: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          op06VinsmokeIchiji060,
          op06VinsmokeSora063,
        ],
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
    expect(engine.getView("north").players.north).toMatchObject({
      activeDon: 0,
      restedDon: 0,
      deckCount: 4,
    });
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
