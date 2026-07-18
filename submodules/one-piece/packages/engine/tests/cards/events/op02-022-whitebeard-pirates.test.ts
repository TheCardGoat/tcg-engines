import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Seaquake021,
  op02WhitebeardPirates022,
  op13Fossa047,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

const SEARCH_DECK = [
  op13Fossa047,
  eb01Doma005,
  op02Seaquake021,
  eb01Fourtricks025,
  eb01MountainGod018,
] as const;

function resolveRemainder(engine: OnePieceTestEngine, seat: "south" | "north") {
  const orderDecision = engine.pendingDecision("effectSearchRemainderOrder", seat);
  const orderStep = orderDecision.steps[0];
  expect(orderStep?.kind).toBe("orderItems");
  if (orderStep?.kind !== "orderItems") {
    throw new Error("Expected the controller to order the remaining cards.");
  }
  engine.resolveDecision(
    "effectSearchRemainderOrder",
    { selectedIds: orderStep.candidates.map((candidate) => candidate.ref.id).reverse() },
    seat,
  );
}

describe("OP02-022 Whitebeard Pirates", () => {
  test("maps exact and compound Whitebeard Pirates Characters and excludes other cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02WhitebeardPirates022],
      deck: [...SEARCH_DECK],
      activeDon: 1,
    });
    const eventId = engine.findCardInZone("south", "hand", op02WhitebeardPirates022);
    const exactTraitId = engine.findCardInZone("south", "deck", op13Fossa047);
    const selectedCompoundId = engine.findCardInZone("south", "deck", eb01Doma005);
    const wrongCategoryId = engine.findCardInZone("south", "deck", op02Seaquake021);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const otherRemainderId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op02WhitebeardPirates022);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the private Whitebeard search.");
    }
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: exactTraitId, legal: true },
      { id: selectedCompoundId, legal: true },
      { id: wrongCategoryId, legal: false },
      { id: unrelatedId, legal: false },
      { id: otherRemainderId, legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedCompoundId] }, "south");
    resolveRemainder(engine, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(selectedCompoundId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("activates the Main search from Life without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        deck: [...SEARCH_DECK],
        life: [op02WhitebeardPirates022],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const activeDonBefore = engine.getView("north").players.north.activeDon;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
    resolveRemainder(engine, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(activeDonBefore);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      op02WhitebeardPirates022.id,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
