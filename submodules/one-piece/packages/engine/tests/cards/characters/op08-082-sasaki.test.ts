import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op08Sasaki082 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-082 Sasaki", () => {
  test("rests one DON!! and itself before reducing an opposing Character's cost for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08Sasaki082], activeDon: 1 },
      { character: [eb01MountainGod018] },
    );
    const sasakiId = engine.findCardInZone("south", "character", op08Sasaki082);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(sasakiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Sasaki's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    const paidView = engine.getView("south");
    expect(paidView.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(
      paidView.players.south.characters.find((card) => card?.instanceId === sasakiId)?.rested,
    ).toBe(true);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(3);
    engine.endTurn("south");
    expect(
      engine.getView("north").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(5);
  });

  test("may decline without resting DON!! or itself", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08Sasaki082], activeDon: 1 },
      { character: [eb01MountainGod018] },
    );
    const sasakiId = engine.findCardInZone("south", "character", op08Sasaki082);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(sasakiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === sasakiId)?.rested,
    ).toBe(false);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      5,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
