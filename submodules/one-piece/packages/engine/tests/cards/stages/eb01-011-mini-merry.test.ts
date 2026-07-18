import { describe, expect, test } from "vite-plus/test";
import { eb01MiniMerry011, op13Higuma013, op13Otama043, op13York094 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-011 Mini-Merry", () => {
  test("lets its controller pay the printed Character cost and draw a card", () => {
    const engine = OnePieceTestEngine.create({
      stage: eb01MiniMerry011,
      character: [{ card: op13York094, attachedDon: 2 }, op13York094, op13Otama043],
      deck: [op13Higuma013],
    });
    const stageId = engine.findCardInZone("south", "stage", eb01MiniMerry011);
    const ineligibleId = engine.findCardInZone("south", "character", op13Otama043);
    const eligibleIds = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === op13York094.id)
      .map((card) => card?.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));
    expect(eligibleIds).toHaveLength(2);

    engine.activateEffect(stageId, "activateMain");

    const confirmation = engine.pendingDecision("effectOptional", "south");
    expect(confirmation).toMatchObject({
      actorId: "south",
      kind: "confirm",
      submit: { commandType: "resolvePrompt", promptId: confirmation.id },
    });
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostReturnCharacterToDeck", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected Mini-Merry to publish its Character activation cost.");
    }
    expect(costStep.costType).toBe("returnCharacterToDeck");
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual(eligibleIds);
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);

    const selectedId = eligibleIds[0]!;
    engine.resolveDecision(
      "effectCostReturnCharacterToDeck",
      { selectedIds: [selectedId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.handCount).toBe(1);
    expect(view.players.south.characters.filter(Boolean)).toHaveLength(2);
    expect(engine.getState().players.south.deck.at(-1)).toBe(selectedId);
    expect(engine.getState().cards[selectedId]?.attachedDon).toBe(0);
    expect(view.players.south.restedDon).toBe(2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
