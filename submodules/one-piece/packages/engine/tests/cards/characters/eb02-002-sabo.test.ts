import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Inazuma022, eb02Sabo002 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-002 Sabo", () => {
  test("rests itself and maps only another included Revolutionary Army Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb02Sabo002, eb01Inazuma022, eb01Doma005],
    });
    const saboId = engine.findCardInZone("south", "character", eb02Sabo002);
    const inazumaId = engine.findCardInZone("south", "character", eb01Inazuma022);

    engine.activateEffect(saboId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Sabo's other Revolutionary Army Character choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([inazumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [inazumaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === saboId)?.rested).toBe(
      true,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === inazumaId)?.power,
    ).toBe(9000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb02Sabo002, eb01Inazuma022, eb01Doma005],
    });
    const saboId = engine.findCardInZone("south", "character", eb02Sabo002);
    engine.activateEffect(saboId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
