import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04Karoo004, op04Usopp003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-004 Karoo", () => {
  test("rests itself and gives one rested DON!! to each Character with an included Alabasta type", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Karoo004, op04Usopp003, eb01Doma005],
      restedDon: 2,
    });
    const karooId = engine.findCardInZone("south", "character", op04Karoo004);
    const usoppId = engine.findCardInZone("south", "character", op04Usopp003);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(karooId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const targets = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(targets?.kind).toBe("selectEntity");
    if (targets?.kind !== "selectEntity") throw new Error("Expected Karoo's Alabasta recipients.");
    expect(targets).toMatchObject({ min: 0, max: 2 });
    expect(targets.candidates.map((candidate) => candidate.ref.id)).toEqual([karooId, usoppId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [karooId, usoppId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === karooId),
    ).toMatchObject({
      rested: true,
      attachedDon: 1,
    });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === usoppId)?.attachedDon,
    ).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === excludedId)?.attachedDon,
    ).toBe(0);
    expect(view.players.south.restedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the rest cost and give no DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Karoo004, op04Usopp003],
      restedDon: 2,
    });
    const karooId = engine.findCardInZone("south", "character", op04Karoo004);
    const usoppId = engine.findCardInZone("south", "character", op04Usopp003);

    engine.activateEffect(karooId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === karooId),
    ).toMatchObject({
      rested: true,
      attachedDon: 0,
    });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === usoppId)?.attachedDon,
    ).toBe(0);
    expect(view.players.south.restedDon).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting itself or moving DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Karoo004, op04Usopp003],
      restedDon: 2,
    });
    const karooId = engine.findCardInZone("south", "character", op04Karoo004);
    const usoppId = engine.findCardInZone("south", "character", op04Usopp003);

    engine.activateEffect(karooId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === karooId),
    ).toMatchObject({
      rested: false,
      attachedDon: 0,
    });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === usoppId)?.attachedDon,
    ).toBe(0);
    expect(view.players.south.restedDon).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
