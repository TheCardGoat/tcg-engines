import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Shirahoshi057,
  eb02FakeStrawHatCrew005,
  eb02PortgasDAce028,
  op02EdwardNewgate001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-028 Portgas.D.Ace", () => {
  test("searches, orders, and plays a cost-2 Character rested for a Whitebeard Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02EdwardNewgate001,
      hand: [eb02PortgasDAce028, eb01Shirahoshi057],
      deck: [
        eb02FakeStrawHatCrew005,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: 5,
    });
    const searchedId = engine.findCardInZone("south", "deck", eb02FakeStrawHatCrew005);
    const existingId = engine.findCardInZone("south", "hand", eb01Shirahoshi057);

    engine.playCard(eb02PortgasDAce028, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Ace's top-five search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === searchedId)?.legal).toBe(
      true,
    );
    expect(search.candidates.filter((candidate) => candidate.legal)).toHaveLength(1);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [searchedId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Ace's deck-bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Ace's rested play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([searchedId, existingId]),
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [searchedId] }, "south");

    const played = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === searchedId);
    expect(played?.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not search or play when the Leader lacks Whitebeard Pirates", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02PortgasDAce028, eb01Shirahoshi057],
      activeDon: 5,
    });
    const costTwoId = engine.findCardInZone("south", "hand", eb01Shirahoshi057);

    engine.playCard(eb02PortgasDAce028, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      costTwoId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
