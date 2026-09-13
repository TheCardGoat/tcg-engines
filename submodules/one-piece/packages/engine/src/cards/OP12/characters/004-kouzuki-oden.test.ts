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

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01RadicalBeam029, op01RadicalBeam029, op01RadicalBeam029],
      character: [op12KouzukiOden004],
    });
    const odenId = engine.findCardInZone("south", "character", op12KouzukiOden004);
    engine.activateEffect(odenId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
