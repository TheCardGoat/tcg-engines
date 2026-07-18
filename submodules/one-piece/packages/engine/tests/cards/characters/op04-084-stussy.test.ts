import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op04Stussy084,
  op07Hattori088,
  op07Joseph092,
  op07Kaku080,
  op07Shave094,
  op07Stussy085,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-084 Stussy", () => {
  test("plays only an included-CP Character costing 2 or less other than Stussy", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Stussy084],
      deck: [op07Hattori088, op07Kaku080, op07Stussy085],
      activeDon: 2,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op07Hattori088);
    const expensiveId = engine.findCardInZone("south", "deck", op07Kaku080);
    const excludedNameId = engine.findCardInZone("south", "deck", op07Stussy085);

    engine.playCard(op04Stussy084, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Stussy's deck choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    for (const excludedId of [expensiveId, excludedNameId]) {
      expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
        false,
      );
    }
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([expensiveId, excludedNameId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("rejects an Event and a non-CP card, and may play nothing before trashing all three", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Stussy084],
      deck: [op07Joseph092, op07Shave094, eb01Doma005],
      activeDon: 2,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op07Joseph092);
    const eventId = engine.findCardInZone("south", "deck", op07Shave094);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op04Stussy084, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Stussy's deck choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    for (const excludedId of [eventId, wrongTraitId]) {
      expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
        false,
      );
    }
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eligibleId, eventId, wrongTraitId]),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
