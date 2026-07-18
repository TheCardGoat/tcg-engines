import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op07Sterry006 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-006 Sterry", () => {
  test("may reduce its active Leader before drawing and trashing a chosen hand card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Sterry006, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op07Sterry006.cost,
    });
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op07Sterry006, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.leader.power).toBe(0);
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Sterry's hand trash.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([retainedId, drawnId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [retainedId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(retainedId);
    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without reducing the Leader, drawing, or trashing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Sterry006, eb01Doma005],
      deck: [eb01Fourtricks025],
      activeDon: op07Sterry006.cost,
    });
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const deckCount = engine.getView("south").players.south.deckCount;

    engine.playCard(op07Sterry006, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.south.deckCount).toBe(deckCount);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
