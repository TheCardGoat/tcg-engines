import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op05Gladius025 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-025 Gladius", () => {
  test("may rest itself to rest only an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Gladius025] },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const gladiusId = engine.findCardInZone("south", "character", op05Gladius025);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(gladiusId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Gladius's rest target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === gladiusId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === highCostId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting itself, and cannot activate while already rested", () => {
    const declined = OnePieceTestEngine.create(
      { character: [op05Gladius025] },
      { character: [eb01Doma005] },
    );
    const gladiusId = declined.findCardInZone("south", "character", op05Gladius025);
    const targetId = declined.findCardInZone("north", "character", eb01Doma005);

    declined.activateEffect(gladiusId, "activateMain", "south");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "south");
    let view = declined.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === gladiusId)?.rested,
    ).toBe(false);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);

    const unavailable = OnePieceTestEngine.create({
      character: [{ card: op05Gladius025, rested: true }],
    });
    const unavailableId = unavailable.findCardInZone("south", "character", op05Gladius025);
    expect(
      unavailable.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: unavailableId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
