import { describe, expect, test } from "vite-plus/test";
import {
  eb01ConquererOfThreeWorldsRagnaraku039,
  eb01MountainGod018,
  op05JohnGiant044,
  op13JewelryBonney108,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-039 Conquerer of Three Worlds Ragnaraku", () => {
  test("pays 5 DON!! and DON!! -1, then K.O.s only a chosen cost-8-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01ConquererOfThreeWorldsRagnaraku039],
        activeDon: 6,
      },
      {
        character: [op05JohnGiant044, op13JewelryBonney108],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", eb01ConquererOfThreeWorldsRagnaraku039);
    const eligibleId = engine.findCardInZone("north", "character", op05JohnGiant044);
    const tooExpensiveId = engine.findCardInZone("north", "character", op13JewelryBonney108);
    const beforePlay = engine.getView("south").players.south;

    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039);

    const returnDonDecision = engine.pendingDecision("effectCostReturnDon", "south");
    const returnDonStep = returnDonDecision.steps[0];
    expect(returnDonStep?.kind).toBe("payCost");
    if (returnDonStep?.kind !== "payCost") {
      throw new Error("Expected the controller to choose active or rested DON!! for DON!! -1.");
    }
    expect(returnDonStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      "active-don:0",
      "rested-don:0",
      "rested-don:1",
      "rested-don:2",
      "rested-don:3",
      "rested-don:4",
    ]);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("south");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Ragnaraku to publish its opponent Character choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      tooExpensiveId,
    );

    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === tooExpensiveId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.activeDon + view.players.south.restedDon).toBe(
      beforePlay.activeDon + beforePlay.restedDon - 1,
    );
    expect(view.players.south.donDeckCount).toBe(beforePlay.donDeckCount + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the damaged player add up to 1 active DON!! from its Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [eb01ConquererOfThreeWorldsRagnaraku039],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    const beforeTrigger = engine.getView("north").players.north;
    expect(triggerDecision).toMatchObject({ actorId: "north", kind: "confirm" });
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const donDecision = engine.pendingDecision("effectAddDon", "north");
    const donStep = donDecision.steps[0];
    expect(donDecision.actorId).toBe("north");
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected Ragnaraku to publish its optional DON!! count choice.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(beforeTrigger.activeDon + 1);
    expect(view.players.north.restedDon).toBe(beforeTrigger.restedDon);
    expect(view.players.north.donDeckCount).toBe(beforeTrigger.donDeckCount - 1);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      eb01ConquererOfThreeWorldsRagnaraku039.id,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
