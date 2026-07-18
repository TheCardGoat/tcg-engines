import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  eb01Sanji014,
  eb01TonyTonyChopper006,
  eb02GumGumGiantPistol021,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-021 Gum-Gum Giant Pistol", () => {
  test("gives a composite Straw Hat Crew Character +6000 and freezes that same Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02GumGumGiantPistol021],
      character: [
        { card: eb01TonyTonyChopper006, rested: true, playedOnTurn: 0 },
        { card: eb01Sanji014, rested: true, playedOnTurn: 0 },
      ],
      activeDon: 3,
    });
    const eventId = engine.findCardInZone("south", "hand", eb02GumGumGiantPistol021);
    const selectedId = engine.findCardInZone("south", "character", eb01TonyTonyChopper006);
    const otherEligibleId = engine.findCardInZone("south", "character", eb01Sanji014);

    engine.playCard(eb02GumGumGiantPistol021);

    const powerDecision = engine.pendingDecision("effectTargetSelection", "south");
    const powerStep = powerDecision.steps[0];
    expect(powerDecision.actorId).toBe("south");
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the Event controller to receive the Straw Hat Crew choice.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedId,
      otherEligibleId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(10000);
    engine.endTurn("south");
    engine.endTurn("north");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === otherEligibleId)?.rested,
    ).toBe(false);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the damaged player rest only a cost-4-or-less opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Sanji014],
      },
      {
        life: [eb02GumGumGiantPistol021],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "character", eb01Sanji014);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("north");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to receive the Trigger rest choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      eb02GumGumGiantPistol021.id,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
