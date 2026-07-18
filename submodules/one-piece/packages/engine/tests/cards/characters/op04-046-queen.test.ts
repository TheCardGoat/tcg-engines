import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Kaido061,
  op04IceOni047,
  op04PlagueRounds055,
  op04Queen046,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-046 Queen", () => {
  test("with an included Leader type, searches up to 2 Plague Rounds or Ice Oni cards", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01Kaido061,
      hand: [op04Queen046],
      deck: [
        op04PlagueRounds055,
        op04IceOni047,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: 4,
    });
    const plagueRoundsId = engine.findCardInZone("south", "deck", op04PlagueRounds055);
    const iceOniId = engine.findCardInZone("south", "deck", op04IceOni047);
    const excludedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op04Queen046, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Queen's search choice.");
    expect(search).toMatchObject({ min: 0, max: 2 });
    expect(search.candidates.find((candidate) => candidate.ref.id === plagueRoundsId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === iceOniId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [plagueRoundsId, iceOniId] },
      "south",
    );

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Queen's bottom-deck order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const handIds = engine.getView("south").players.south.hand.map((card) => card.instanceId);
    expect(handIds).toContain(plagueRoundsId);
    expect(handIds).toContain(iceOniId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may reveal zero cards and orders all seven looked cards at the deck bottom", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01Kaido061,
      hand: [op04Queen046],
      deck: [
        op04PlagueRounds055,
        op04IceOni047,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op04Queen046.cost,
    });

    engine.playCard(op04Queen046, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Queen's bottom-deck order.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    // Exact hidden deck order is not projected; this is the narrow identity boundary.
    expect(engine.getState().players.south.deck).toEqual(bottomOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not look at the deck without an Animal Kingdom Pirates Leader", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Queen046],
      deck: [
        op04PlagueRounds055,
        op04IceOni047,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op04Queen046.cost,
    });
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op04Queen046, "south");

    const view = engine.getView("south");
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
