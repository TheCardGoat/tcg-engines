import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01ElephantSMarchoo115,
  op01YouCanBeMySamurai055,
  op12Perona034,
  op12RoronoaZoro020,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-034 Perona", () => {
  test("with a Slash Leader searches either a Slash card or green Event", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12RoronoaZoro020,
      hand: [op12Perona034],
      deck: [
        eb01Doma005,
        op01YouCanBeMySamurai055,
        eb01MountainGod018,
        op01ElephantSMarchoo115,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op12Perona034.cost,
    });
    const slashId = engine.findCardInZone("south", "deck", eb01Doma005);
    const greenEventId = engine.findCardInZone("south", "deck", op01YouCanBeMySamurai055);
    const excludedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op12Perona034, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Perona's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === slashId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === greenEventId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [greenEventId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Perona's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      greenEventId,
    );
  });

  test("does not search when its Leader lacks the Slash attribute", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12Perona034],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: op12Perona034.cost,
    });

    engine.playCard(op12Perona034, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
