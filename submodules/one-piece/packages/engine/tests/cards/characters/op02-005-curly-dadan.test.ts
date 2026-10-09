import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02CurlyDadan005,
  op02Makino015,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-005 Curly.Dadan", () => {
  test("finds only a red cost-1 Character among the top five and lets its controller order the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02CurlyDadan005],
      deck: [op02Makino015, eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op02CurlyDadan005.cost,
    });
    const makinoId = engine.findCardInZone("south", "deck", op02Makino015);
    const domaId = engine.findCardInZone("south", "deck", eb01Doma005);
    const fourtricksId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op02CurlyDadan005, "south");
    engine.resolveDecision("effectSearchLookCount", { optionId: "5" }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Curly.Dadan's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === makinoId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === domaId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === fourtricksId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [makinoId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems")
      throw new Error("Expected Curly.Dadan's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(makinoId);
    expect(view.players.south.deckCount).toBe(4);
    expect(view.prompts).toHaveLength(0);
  });
  test.each([0, 2])(
    "chooses %i before revealing cards and preserves the choice across a snapshot",
    (amount) => {
      let engine = OnePieceTestEngine.create({
        hand: [op02CurlyDadan005],
        deck: [
          op02Makino015,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
        ],
        activeDon: 2,
      });
      engine.playCard(op02CurlyDadan005);
      const count = engine.pendingDecision("effectSearchLookCount", "south");
      const step = count.steps[0];
      if (step?.kind !== "chooseOption") throw new Error("Expected count before search.");
      expect(step.options.map((option) => option.id)).toEqual(["0", "1", "2", "3", "4", "5"]);
      // The pending count exposes no deck identities to either player.
      for (const seat of ["south", "north"] as const) {
        expect(JSON.stringify(engine.getView(seat).prompts)).not.toContain("Makino");
        expect(JSON.stringify(engine.getView(seat).prompts)).not.toContain("Mountain God");
      }
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: count.id,
        optionId: "6",
      });
      expect(engine.pendingDecision("effectSearchLookCount", "south").id).toBe(count.id);
      engine.resolveDecision("effectSearchLookCount", { optionId: String(amount) }, "south");
      if (amount === 2) {
        const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
        if (search?.kind !== "selectEntity") throw new Error("Expected limited search.");
        expect(search.candidates.map((candidate) => candidate.publicInfo?.cardId)).toEqual([
          "OP02-015",
          "EB01-005",
        ]);
        engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
        const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
        if (order?.kind !== "orderItems") throw new Error("Expected two-card remainder.");
        engine.resolveDecision(
          "effectSearchRemainderOrder",
          { selectedIds: order.candidates.map((c) => c.ref.id) },
          "south",
        );
      }
      expect(engine.getView("south").players.south.deckCount).toBe(6);
      expect(engine.getView("south").prompts).toHaveLength(0);
      engine.endTurn("south");
      engine.endTurn("north");
      expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toEqual([
        amount === 0 ? "OP02-015" : "EB01-025",
      ]);
    },
  );

  test("caps the inspection count at the actual short deck size", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02CurlyDadan005],
      deck: [op02Makino015, eb01Doma005],
      activeDon: 2,
    });
    engine.playCard(op02CurlyDadan005);
    const step = engine.pendingDecision("effectSearchLookCount", "south").steps[0];
    if (step?.kind !== "chooseOption") throw new Error("Expected count choice.");
    expect(step.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectSearchLookCount", { optionId: "0" }, "south");
    expect(engine.getView("south").players.south.deckCount).toBe(2);
    expect(engine.getView("south").status).toBe("active");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
