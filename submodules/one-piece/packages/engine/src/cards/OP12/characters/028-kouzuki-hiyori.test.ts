import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01ElephantSMarchoo115,
  op01YouCanBeMySamurai055,
  op12KouzukiHiyori028,
  op12RoronoaZoro020,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-028 Kouzuki Hiyori", () => {
  test("pays both costs, then searches a Slash card or green Event for a Zoro Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12RoronoaZoro020,
      character: [op12KouzukiHiyori028],
      deck: [
        eb01Doma005,
        op01YouCanBeMySamurai055,
        eb01MountainGod018,
        op01ElephantSMarchoo115,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: 1,
    });
    const hiyoriId = engine.findCardInZone("south", "character", op12KouzukiHiyori028);
    const slashId = engine.findCardInZone("south", "deck", eb01Doma005);
    const greenEventId = engine.findCardInZone("south", "deck", op01YouCanBeMySamurai055);
    const excludedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.activateEffect(hiyoriId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Hiyori's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === slashId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === greenEventId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [greenEventId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Hiyori's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(greenEventId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hiyoriId)?.rested,
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
  });

  test("still pays the optional activation costs when the post-colon Leader condition fails", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12KouzukiHiyori028],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: 1,
    });
    const hiyoriId = engine.findCardInZone("south", "character", op12KouzukiHiyori028);

    engine.activateEffect(hiyoriId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hiyoriId)?.rested,
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
