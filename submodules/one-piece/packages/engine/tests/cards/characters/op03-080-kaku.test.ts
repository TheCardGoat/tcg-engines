import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb03Stussy043,
  op03Fukurou088,
  op03Kaku080,
  op03Nero087,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-080 Kaku", () => {
  test("orders two included CP trash cards, then K.O.s an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Kaku080],
        trash: [op03Fukurou088, eb03Stussy043, eb01Doma005],
        activeDon: op03Kaku080.cost,
      },
      { character: [op03Nero087, eb01MountainGod018] },
    );
    const cp9Id = engine.findCardInZone("south", "trash", op03Fukurou088);
    const cp0Id = engine.findCardInZone("south", "trash", eb03Stussy043);
    const nonCpId = engine.findCardInZone("south", "trash", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", op03Nero087);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03Kaku080, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Kaku's ordered CP trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([cp9Id, cp0Id]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonCpId);
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: [cp0Id, cp9Id] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Kaku's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    // Deck order is intentionally asserted at the narrow hidden-zone identity boundary.
    expect(engine.getState().players.south.deck.slice(-2)).toEqual([cp0Id, cp9Id]);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline without moving trash cards or K.O.ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Kaku080],
        trash: [op03Fukurou088, eb03Stussy043],
        activeDon: op03Kaku080.cost,
      },
      { character: [op03Nero087] },
    );
    const targetId = engine.findCardInZone("north", "character", op03Nero087);

    engine.playCard(op03Kaku080, "south");
    const before = engine.getView("south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash).toHaveLength(before.players.south.trash.length);
    expect(view.players.south.deckCount).toBe(before.players.south.deckCount);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
