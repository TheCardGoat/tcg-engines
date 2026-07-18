import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02EmporioIvankov049, op05Koala006 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-006 Koala", () => {
  test("a compound Revolutionary Army Leader enables only an opposing Character target", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EmporioIvankov049,
        hand: [op05Koala006],
        activeDon: op05Koala006.cost,
      },
      { character: [eb01Doma005] },
    );
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op05Koala006, "south");
    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected Koala's power target.");
    expect(selection).toMatchObject({ min: 0, max: 1 });
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual([characterId]);
    expect(selection.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      engine.leader("north"),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(0);
  });

  test("may decline the reduction", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EmporioIvankov049,
        hand: [op05Koala006],
        activeDon: op05Koala006.cost,
      },
      { character: [eb01Doma005] },
    );
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op05Koala006, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(3000);
  });

  test("a non-Revolutionary Army Leader suppresses the On Play effect", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05Koala006], activeDon: op05Koala006.cost },
      { character: [eb01Doma005] },
    );
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op05Koala006, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
