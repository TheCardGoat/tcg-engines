import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Kaido094,
  op01Shanks120,
} from "@tcg/op-cards";
import { op13GolDRoger064 } from "../../../../../cards/src/cards/OP13/characters/064-gol-d-roger.ts";
import { op13Shanks065 } from "../../../../../cards/src/cards/OP13/characters/065-shanks.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-065 Shanks", () => {
  test("reveals and adds the selected included Roger Pirates card, excludes Shanks, and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Shanks065],
      deck: [
        op13GolDRoger064,
        op01Shanks120,
        eb01Doma005,
        eb01MountainGod018,
        op01Kaido094,
        eb01Fourtricks025,
      ],
      activeDon: op13Shanks065.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op13GolDRoger064);
    const excludedNameId = engine.findCardInZone("south", "deck", op01Shanks120);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op13Shanks065, "south");
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    expect(decision.actorId).toBe("south");
    const search = decision.steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Shanks's search selection.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedNameId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Shanks's remainder order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    expect(submittedOrder).toEqual(expect.arrayContaining([excludedNameId, wrongTraitId]));
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...submittedOrder]);
    expect(view.prompts).toHaveLength(0);
  });

  test("may add no card and bottom-orders all five looked cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Shanks065],
      deck: [op13GolDRoger064, op01Shanks120, eb01Doma005, eb01MountainGod018, op01Kaido094],
      activeDon: op13Shanks065.cost,
    });

    engine.playCard(op13Shanks065, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Shanks's remainder order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    expect(submittedOrder).toHaveLength(5);
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 0, deckCount: 5 });
    expect(engine.getState().players.south.deck).toEqual(submittedOrder);
    expect(view.prompts).toHaveLength(0);
  });
});
