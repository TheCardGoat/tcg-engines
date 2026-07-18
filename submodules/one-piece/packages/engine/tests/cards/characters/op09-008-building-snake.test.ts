import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op09BuildingSnake008 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-008 Building Snake", () => {
  test("returns its physical card to deck bottom and gives one opponent -3000 through turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09BuildingSnake008, attachedDon: 2 }],
        deck: [eb01Doma005],
      },
      { character: [eb01MountainGod018] },
    );
    const sourceId = engine.findCardInZone("south", "character", op09BuildingSnake008);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Building Snake's target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(sourceId);
    expect(engine.getState().players.south.deck.at(-1)).toBe(sourceId);
    expect(view.players.south.restedDon).toBe(2);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      (eb01MountainGod018.power ?? 0) - 3000,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01MountainGod018.power,
    );
  });

  test("may decline without returning itself or modifying the opponent", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09BuildingSnake008] },
      { character: [eb01MountainGod018] },
    );
    const sourceId = engine.findCardInZone("south", "character", op09BuildingSnake008);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(sourceId);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01MountainGod018.power,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
