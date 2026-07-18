import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Rebecca048,
  op04CorridaColiseum096,
  op05MaryGeoise097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-048 Rebecca", () => {
  test("searches, orders the remainder, then plays the selected cost-1 Dressrosa Stage", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Rebecca048, op04CorridaColiseum096, op05MaryGeoise097],
      deck: [
        op04CorridaColiseum096,
        op05MaryGeoise097,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: 2,
    });
    const searchedStageId = engine.findCardInZone("south", "deck", op04CorridaColiseum096);
    const ineligibleStageId = engine.findCardInZone("south", "deck", op05MaryGeoise097);
    const existingStageId = engine.findCardInZone("south", "hand", op04CorridaColiseum096);
    const existingWrongTraitId = engine.findCardInZone("south", "hand", op05MaryGeoise097);

    engine.playCard(eb03Rebecca048, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Rebecca's Stage search.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === searchedStageId)?.legal).toBe(
      true,
    );
    expect(
      search.candidates.find((candidate) => candidate.ref.id === ineligibleStageId)?.legal,
    ).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [searchedStageId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") {
      throw new Error("Expected Rebecca's deck-bottom order.");
    }
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Rebecca's Stage play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([
      existingStageId,
      searchedStageId,
    ]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      existingWrongTraitId,
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [searchedStageId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.instanceId).toBe(searchedStageId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(existingStageId);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(searchedStageId);
    expect(view.prompts).toHaveLength(0);
  });
});
