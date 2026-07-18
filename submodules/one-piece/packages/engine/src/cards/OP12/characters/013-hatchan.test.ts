import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op08PhoenixBrand055 } from "@tcg/op-cards";
import { op12Hatchan013 } from "../../../../../cards/src/cards/OP12/characters/013-hatchan.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-013 Hatchan", () => {
  test("rests itself, reveals exactly two Events, and gives two rested DON!! to one card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08PhoenixBrand055, op08PhoenixBrand055, op08PhoenixBrand055, eb01Doma005],
      character: [op12Hatchan013],
      restedDon: 2,
    });
    const hatchanId = engine.findCardInZone("south", "character", op12Hatchan013);
    const eventIds = engine
      .getView("south")
      .players.south.hand.filter((card) => card.cardId === op08PhoenixBrand055.id)
      .map((card) => card.instanceId)
      .filter((id): id is string => Boolean(id));
    const nonEventId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.activateEffect(hatchanId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const reveal = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    expect(reveal).toMatchObject({ kind: "payCost", min: 2, max: 2 });
    if (reveal?.kind !== "payCost") throw new Error("Expected Hatchan's reveal cost.");
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonEventId);
    engine.resolveDecision(
      "effectCostRevealFromHand",
      { selectedIds: eventIds.slice(0, 2) },
      "south",
    );

    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(eventIds),
    );
    expect(view.players.south.leader.attachedDon).toBe(2);
    expect(view.players.south.restedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hatchanId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
