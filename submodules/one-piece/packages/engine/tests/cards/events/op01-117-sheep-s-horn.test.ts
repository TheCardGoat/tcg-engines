import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, eb02Enel052, op01SheepSHorn117 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-117 Sheep's Horn", () => {
  test("lets the controller choose attached DON!! for DON!! -1 before resting a cost-6-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01SheepSHorn117],
        activeDon: 4,
      },
      {
        character: [eb01MountainGod018, eb02Enel052],
      },
    );
    const leaderId = engine.leader("south");
    const eventId = engine.findCardInZone("south", "hand", op01SheepSHorn117);
    const selectedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", eb02Enel052);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.attachDon(leaderId);
    engine.playCard(op01SheepSHorn117);

    const costDecision = engine.pendingDecision("effectCostReturnDon", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the controller to choose which DON!! card to return.");
    }
    const attachedDonId = `attached-don:${leaderId}:0`;
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      "active-don:0",
      "rested-don:0",
      "rested-don:1",
      attachedDonId,
    ]);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: [attachedDonId] }, "south");

    const restDecision = engine.pendingDecision("effectTargetSelection", "south");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose an opposing Character to rest.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 2 });
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === excludedId)?.rested,
    ).toBe(false);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
