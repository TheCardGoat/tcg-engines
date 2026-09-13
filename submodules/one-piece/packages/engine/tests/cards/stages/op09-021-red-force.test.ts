import { describe, expect, test } from "vite-plus/test";
import { op02Magellan085, op09RedForce021, op09Shanks001, op13Higuma013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-021 Red Force", () => {
  test("lets a composite Red-Haired Pirates Leader weaken a chosen opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Shanks001,
        stage: op09RedForce021,
      },
      {
        character: [op02Magellan085, op13Higuma013],
      },
    );
    const stageId = engine.findCardInZone("south", "stage", op09RedForce021);
    const selectedId = engine.findCardInZone("north", "character", op02Magellan085);
    const unselectedId = engine.findCardInZone("north", "character", op13Higuma013);

    engine.activateEffect(stageId, "activateMain");

    const confirmation = engine.pendingDecision("effectOptional", "south");
    expect(confirmation).toMatchObject({ actorId: "south", kind: "confirm" });
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Red Force to publish an opposing Character selection.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedId,
      unselectedId,
    ]);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(5000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === unselectedId)?.power,
    ).toBe(3000);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");

    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(6000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("can pay its rest cost before a nonmatching Leader makes the effect do nothing", () => {
    const engine = OnePieceTestEngine.create(
      { stage: op09RedForce021 },
      { character: [op13Higuma013] },
    );
    const stageId = engine.findCardInZone("south", "stage", op09RedForce021);
    const opponentId = engine.findCardInZone("north", "character", op13Higuma013);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentId)?.power,
    ).toBe(3000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { stage: op09RedForce021 },
      { character: [op13Higuma013] },
    );
    const stageId = engine.findCardInZone("south", "stage", op09RedForce021);
    engine.activateEffect(stageId, "activateMain");
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
