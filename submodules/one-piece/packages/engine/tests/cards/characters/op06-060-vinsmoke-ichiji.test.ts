import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op06VinsmokeIchiji060,
  op06VinsmokeIchiji061,
  op06VinsmokeReiju042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function payIchijiCosts(engine: OnePieceTestEngine, sourceId: string) {
  engine.activateEffect(sourceId, "activateMain", "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  const donCost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
  expect(donCost?.kind).toBe("payCost");
  if (donCost?.kind !== "payCost") throw new Error("Expected Ichiji's DON!! return cost.");
  engine.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: [donCost.candidates[0]!.ref.id] },
    "south",
  );
}

describe("OP06-060 Vinsmoke Ichiji", () => {
  test("returns a DON!!, trashes itself, and may play cost-7 Ichiji from hand or trash", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06VinsmokeReiju042,
      hand: [op06VinsmokeIchiji061],
      character: [op06VinsmokeIchiji060],
      trash: [op06VinsmokeIchiji061, eb01Doma005],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: 1,
      restedDon: 1,
    });
    const sourceId = engine.findCardInZone("south", "character", op06VinsmokeIchiji060);
    const handIchijiId = engine.findCardInZone("south", "hand", op06VinsmokeIchiji061);
    const trashIchijiId = engine.findCardInZone("south", "trash", op06VinsmokeIchiji061);
    const wrongNameId = engine.findCardInZone("south", "trash", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    payIchijiCosts(engine, sourceId);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Ichiji's play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([handIchijiId, trashIchijiId]),
    );
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongNameId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [trashIchijiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.characters.some((card) => card?.instanceId === trashIchijiId)).toBe(
      true,
    );
  });

  test("still pays both activation costs when the post-colon Leader condition is false", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06VinsmokeIchiji061],
      character: [op06VinsmokeIchiji060],
      activeDon: 1,
      restedDon: 1,
    });
    const sourceId = engine.findCardInZone("south", "character", op06VinsmokeIchiji060);
    const handIchijiId = engine.findCardInZone("south", "hand", op06VinsmokeIchiji061);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    payIchijiCosts(engine, sourceId);

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handIchijiId);
    expect(view.prompts).toHaveLength(0);
  });
});
