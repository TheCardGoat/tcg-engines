import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Bepo071,
  op05EustassCaptainKid074,
  op05UsoHachi061,
  op05WhenYouReAtSeaYouFightAgainstPirates076,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

const SEARCH_DECK = [op05UsoHachi061, op05EustassCaptainKid074, op05Bepo071, eb01Doma005] as const;

describe("OP05-076 When You're at Sea You Fight against Pirates!!", () => {
  test("Main privately offers each alternative included trait and orders the unchosen remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05WhenYouReAtSeaYouFightAgainstPirates076],
      deck: [...SEARCH_DECK],
      activeDon: 1,
    });
    const strawHatId = engine.findCardInZone("south", "deck", op05UsoHachi061);
    const kidId = engine.findCardInZone("south", "deck", op05EustassCaptainKid074);
    const heartId = engine.findCardInZone("south", "deck", op05Bepo071);

    engine.playCard(op05WhenYouReAtSeaYouFightAgainstPirates076);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected a private three-trait search choice.");
    }
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: strawHatId, legal: true },
      { id: kidId, legal: true },
      { id: heartId, legal: true },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [heartId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [kidId, strawHatId] },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      heartId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates the same search without Main DON!! payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op05WhenYouReAtSeaYouFightAgainstPirates076],
        deck: [...SEARCH_DECK],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lookedIds = engine.getState().players.north.deck.slice(0, 3);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: lookedIds }, "north");

    expect(engine.getView("north").players.north).toMatchObject({
      activeDon: 0,
      restedDon: 0,
      deckCount: 4,
    });
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
