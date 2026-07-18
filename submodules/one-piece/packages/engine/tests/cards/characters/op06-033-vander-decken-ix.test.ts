import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op06Hammond032,
  op06TheArkNoah041,
  op06VanderDeckenIx033,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-033 Vander Decken IX", () => {
  function resolveWithAlternativeCost(payment: "fishManHand" | "arkStage") {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06VanderDeckenIx033, op06Hammond032, op06TheArkNoah041],
        stage: op06TheArkNoah041,
        activeDon: op06VanderDeckenIx033.cost,
      },
      {
        character: [
          { card: eb01MountainGod018, rested: true },
          { card: eb01Doma005, rested: false },
        ],
      },
    );
    const fishManId = engine.findCardInZone("south", "hand", op06Hammond032);
    const arkHandId = engine.findCardInZone("south", "hand", op06TheArkNoah041);
    const arkFieldId = engine.findCardInZone("south", "stage", op06TheArkNoah041);
    const restedTargetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const activeTargetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op06VanderDeckenIx033, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const costPrompt = engine.pendingDecision("effectCostTrashCard", "south").steps[0];
    expect(costPrompt).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (costPrompt?.kind !== "payCost") {
      throw new Error("Expected Vander Decken's alternative-cost choice.");
    }
    expect(costPrompt.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([fishManId, arkHandId, arkFieldId]),
    );
    const selectedCostId = payment === "fishManHand" ? fishManId : arkFieldId;
    engine.resolveDecision("effectCostTrashCard", { selectedIds: [selectedCostId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Vander Decken's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(restedTargetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeTargetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restedTargetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(selectedCostId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(restedTargetId);
    expect(view.prompts).toHaveLength(0);
  }

  test("trashes a Fish-Man from hand and K.O.'s only a rested opposing Character", () => {
    resolveWithAlternativeCost("fishManHand");
  });

  test("trashes The Ark Noah from the Stage and K.O.'s a rested opposing Character", () => {
    resolveWithAlternativeCost("arkStage");
  });

  test("may decline without trashing a card or K.O.'ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06VanderDeckenIx033, op06Hammond032],
        activeDon: op06VanderDeckenIx033.cost,
      },
      { character: [{ card: eb01MountainGod018, rested: true }] },
    );
    const paymentId = engine.findCardInZone("south", "hand", op06Hammond032);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op06VanderDeckenIx033, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the optional effect without an eligible cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06VanderDeckenIx033],
        activeDon: op06VanderDeckenIx033.cost,
      },
      { character: [{ card: eb01Doma005, rested: true }] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op06VanderDeckenIx033, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
