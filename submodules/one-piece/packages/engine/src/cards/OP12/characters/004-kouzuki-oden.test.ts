import { describe, expect, test } from "vite-plus/test";
import { op01RadicalBeam029 } from "@tcg/op-cards";
import { op12KouzukiOden004 } from "../../../../../cards/src/cards/OP12/characters/004-kouzuki-oden.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-004 Kouzuki Oden", () => {
  test("once per turn reveals two Events to gain 2000 power for the turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01RadicalBeam029, op01RadicalBeam029, op01RadicalBeam029],
      character: [op12KouzukiOden004],
    });
    const odenId = engine.findCardInZone("south", "character", op12KouzukiOden004);

    engine.activateEffect(odenId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const reveal = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    expect(reveal).toMatchObject({ kind: "payCost", min: 2, max: 2 });
    if (reveal?.kind !== "payCost") throw new Error("Expected Oden's reveal cost.");
    engine.resolveDecision(
      "effectCostRevealFromHand",
      { selectedIds: reveal.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === odenId)
        ?.power,
    ).toBe((op12KouzukiOden004.power ?? 0) + 2000);
    expect(engine.getView("south").players.south.hand).toHaveLength(3);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: odenId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
