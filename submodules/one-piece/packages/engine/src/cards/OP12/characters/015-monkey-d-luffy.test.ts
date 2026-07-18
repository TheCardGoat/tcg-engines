import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08PhoenixBrand055 } from "@tcg/op-cards";
import { op12MonkeyDLuffy015 } from "../../../../../cards/src/cards/OP12/characters/015-monkey-d-luffy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-015 Monkey.D.Luffy", () => {
  test("gains power from two total given DON!! cards, including DON!! on another Character", () => {
    const below = OnePieceTestEngine.create({
      character: [op12MonkeyDLuffy015, { card: eb01Doma005, attachedDon: 1 }],
    });
    const belowId = below.findCardInZone("south", "character", op12MonkeyDLuffy015);
    expect(
      below.getView("south").players.south.characters.find((card) => card?.instanceId === belowId)
        ?.power,
    ).toBe(op12MonkeyDLuffy015.power);

    const threshold = OnePieceTestEngine.create({
      character: [op12MonkeyDLuffy015, { card: eb01Doma005, attachedDon: 2 }],
    });
    const thresholdId = threshold.findCardInZone("south", "character", op12MonkeyDLuffy015);
    expect(
      threshold
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === thresholdId)?.power,
    ).toBe((op12MonkeyDLuffy015.power ?? 0) + 2000);
  });

  test("reveals two Events, plays an eligible red Character, then gives rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      hand: [
        op12MonkeyDLuffy015,
        op08PhoenixBrand055,
        op08PhoenixBrand055,
        op08PhoenixBrand055,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: op12MonkeyDLuffy015.cost,
      restedDon: 1,
    });
    const eventIds = engine
      .getView("south")
      .players.south.hand.filter((card) => card.cardId === op08PhoenixBrand055.id)
      .map((card) => card.instanceId)
      .filter((id): id is string => Boolean(id));
    const eligibleId = engine.findCardInZone("south", "hand", eb01Doma005);
    const excludedId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.playCard(op12MonkeyDLuffy015, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostRevealFromHand",
      { selectedIds: eventIds.slice(0, 2) },
      "south",
    );
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Luffy's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(eventIds),
    );
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
