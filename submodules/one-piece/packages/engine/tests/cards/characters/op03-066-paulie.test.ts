import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Paulie066 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-066 Paulie", () => {
  test("may rest two DON!!, add one active, then K.O. an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Paulie066],
        activeDon: 9,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03Paulie066, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const afterCost = engine.getView("south").players.south;
    expect(afterCost).toMatchObject({ activeDon: 2, restedDon: 7 });

    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Paulie's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(lowCostId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 3, restedDon: 7 });
    expect(view.players.south.donDeckCount).toBe(afterCost.donDeckCount - 1);
    expect(view.players.north.characters.some((card) => card?.instanceId === lowCostId)).toBe(
      false,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lowCostId);
    expect(view.prompts).toHaveLength(0);
  });

  test("below eight DON!! may resolve the cost and decline the added DON!! without a K.O. prompt", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Paulie066],
      activeDon: 7,
    });

    engine.playCard(op03Paulie066, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const afterCost = engine.getView("south").players.south;
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 7,
      donDeckCount: afterCost.donDeckCount,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline before resting DON!! or adding a card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Paulie066],
      activeDon: 9,
    });

    engine.playCard(op03Paulie066, "south");
    const before = engine.getView("south").players.south;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: before.activeDon,
      restedDon: before.restedDon,
      donDeckCount: before.donDeckCount,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
