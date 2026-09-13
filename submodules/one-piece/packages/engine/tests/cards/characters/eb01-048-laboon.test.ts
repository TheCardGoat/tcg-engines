import { describe, expect, test } from "vite-plus/test";
import { eb01Laboon048, eb01MountainGod018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-048 Laboon", () => {
  test("rests itself and maps an opponent Character for the turn cost reduction", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb01Laboon048] },
      { character: [eb01MountainGod018] },
    );
    const laboonId = engine.findCardInZone("south", "character", eb01Laboon048);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(laboonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === laboonId)?.rested,
    ).toBe(true);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      1,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb01Laboon048] },
      { character: [eb01MountainGod018] },
    );
    const laboonId = engine.findCardInZone("south", "character", eb01Laboon048);
    engine.activateEffect(laboonId, "activateMain", "south");
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
