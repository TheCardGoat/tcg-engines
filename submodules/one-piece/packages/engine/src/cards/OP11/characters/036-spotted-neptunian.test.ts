import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Shirahoshi057,
  op11BirdNeptunian033,
  op11CaponeGangBege048,
  op11Shirahoshi022,
  op11SpottedNeptunian036,
  op11Vito042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-036 Spotted Neptunian", () => {
  test("searches for a Neptunian or named Shirahoshi and orders the four-card remainder", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Shirahoshi022,
      hand: [op11SpottedNeptunian036],
      deck: [
        op11BirdNeptunian033,
        eb01Shirahoshi057,
        eb01Doma005,
        eb01MountainGod018,
        op11Vito042,
        op11CaponeGangBege048,
      ],
      activeDon: op11SpottedNeptunian036.cost,
    });
    const neptunianId = engine.findCardInZone("south", "deck", op11BirdNeptunian033);
    const shirahoshiId = engine.findCardInZone("south", "deck", eb01Shirahoshi057);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.findCardInZone("south", "deck", op11CaponeGangBege048);

    engine.playCard(op11SpottedNeptunian036, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Spotted Neptunian's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === neptunianId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === shirahoshiId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [shirahoshiId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected bottom-deck ordering.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(shirahoshiId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...submittedOrder]);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a Shirahoshi Leader, does not look at or reorder the deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11SpottedNeptunian036],
      deck: [
        op11BirdNeptunian033,
        eb01Shirahoshi057,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: op11SpottedNeptunian036.cost,
    });
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op11SpottedNeptunian036, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
