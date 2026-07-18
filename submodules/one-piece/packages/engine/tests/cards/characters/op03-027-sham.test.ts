import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op03Buchi034,
  op03Kuro021,
  op03Sham027,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-027 Sham", () => {
  test("with an included East Blue Leader, rests only a cost-2-or-less opponent and plays Buchi", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Kuro021,
        hand: [op03Sham027, op03Buchi034],
        activeDon: op03Sham027.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const buchiId = engine.findCardInZone("south", "hand", op03Buchi034);

    engine.playCard(op03Sham027, "south");

    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(rest?.kind).toBe("selectEntity");
    if (rest?.kind !== "selectEntity") throw new Error("Expected Sham's rest selection.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(lowCostId);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Sham's Buchi play selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([buchiId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [buchiId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === lowCostId)?.rested,
    ).toBe(true);
    expect(view.players.south.characters.some((card) => card?.instanceId === buchiId)).toBe(true);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not offer Buchi when one is already on its controller's field", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Kuro021,
        hand: [op03Sham027],
        activeDon: op03Sham027.cost,
        character: [op03Buchi034],
      },
      { character: [eb01Doma005] },
    );
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const buchiId = engine.findCardInZone("south", "character", op03Buchi034);

    engine.playCard(op03Sham027, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === buchiId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("does nothing without an East Blue Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      hand: [op03Sham027, op03Buchi034],
      activeDon: op03Sham027.cost,
    });

    engine.playCard(op03Sham027, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
