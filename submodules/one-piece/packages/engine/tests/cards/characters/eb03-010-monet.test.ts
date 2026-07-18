import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Funkfreed044,
  eb01MountainGod018,
  eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011,
  eb03Monet010,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-010 Monet", () => {
  test("searches either a low-power Character or Event, orders the rest, then blocks", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Monet010],
        deck: [
          eb01Funkfreed044,
          eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
        ],
        activeDon: 5,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lowPowerId = engine.findCardInZone("south", "deck", eb01Funkfreed044);
    const eventId = engine.findCardInZone(
      "south",
      "deck",
      eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011,
    );
    const excludedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb03Monet010, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Monet's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === lowPowerId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eventId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Monet's deck-bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      eventId,
    );
    const monetId = engine.findCardInZone("south", "character", eb03Monet010);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Monet's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", monetId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [monetId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(monetId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
