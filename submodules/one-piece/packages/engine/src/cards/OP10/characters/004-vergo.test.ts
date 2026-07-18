import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op10Sanji005,
  op10Vergo004,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-004 Vergo", () => {
  test("finds an included Punk Hazard card, excludes Vergo, and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Vergo004],
      deck: [
        op10Sanji005,
        op10Vergo004,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op10Vergo004.cost,
    });
    const sanjiId = engine.findCardInZone("south", "deck", op10Sanji005);
    const vergoId = engine.findCardInZone("south", "deck", op10Vergo004);

    engine.playCard(op10Vergo004, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Vergo's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === sanjiId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === vergoId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [sanjiId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Vergo's bottom order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.prompts).toHaveLength(0);
  });
});
