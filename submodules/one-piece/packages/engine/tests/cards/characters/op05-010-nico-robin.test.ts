import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05NicoRobin010, op13York094 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-010 Nico Robin", () => {
  test("K.O.s up to one opposing Character with 1000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05NicoRobin010], activeDon: op05NicoRobin010.cost },
      { character: [op13York094, eb01Doma005] },
    );
    const legalId = engine.findCardInZone("north", "character", op13York094);
    const excludedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op05NicoRobin010, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Nico Robin's K.O. choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([legalId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [legalId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(legalId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(excludedId);
    expect(view.prompts).toHaveLength(0);
  });
});
