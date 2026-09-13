import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op05Pell014,
  op02Kingdew006,
  op02Vista011,
  op08PhoenixBrand055,
  op10Marco055,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-055 Phoenix Brand", () => {
  test("Main reveals exactly two eligible hand cards publicly and can bottom-deck either player's Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08PhoenixBrand055, op02Vista011, op02Kingdew006, op10Marco055, op05Pell014],
        character: [op05Pell014],
        deck: [eb01MountainGod018],
        activeDon: 4,
      },
      { character: [eb01MountainGod018] },
    );
    const firstRevealId = engine.findCardInZone("south", "hand", op02Vista011);
    const secondRevealId = engine.findCardInZone("south", "hand", op02Kingdew006);
    const thirdEligibleId = engine.findCardInZone("south", "hand", op10Marco055);
    const excludedHandId = engine.findCardInZone("south", "hand", op05Pell014);
    const ownTargetId = engine.findCardInZone("south", "character", op05Pell014);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op08PhoenixBrand055);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostRevealFromHand", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the controller to choose two Whitebeard Pirates cards to reveal.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstRevealId,
      secondRevealId,
      thirdEligibleId,
    ]);
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedHandId);
    engine.resolveDecision(
      "effectCostRevealFromHand",
      { selectedIds: [firstRevealId, secondRevealId] },
      "south",
    );

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the owner-neutral Character selection.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownTargetId,
      opposingTargetId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(ownTargetId);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstRevealId, secondRevealId]),
    );
    const opponentLogs = engine
      .getView("north")
      .logs.map((entry) => entry.message)
      .join("\n");
    expect(opponentLogs).toContain(op02Vista011.name);
    expect(opponentLogs).toContain(op02Kingdew006.name);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08PhoenixBrand055, op02Vista011, op02Kingdew006, op10Marco055, op05Pell014],
        character: [op05Pell014],
        deck: [eb01MountainGod018],
        activeDon: 4,
      },
      { character: [eb01MountainGod018] },
    );
    engine.playCard(op08PhoenixBrand055, "south");
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
