import { describe, expect, test } from "vite-plus/test";
import {
  eb01Loguetown030,
  op13Higuma013,
  op13Otama043,
  op13WindmillVillage022,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-030 Loguetown", () => {
  test("lets its controller order the compound bottom-deck cost before drawing 2", () => {
    const engine = OnePieceTestEngine.create({
      stage: eb01Loguetown030,
      hand: [op13Otama043, op13York094],
      deck: [op13Higuma013, op13WindmillVillage022],
    });
    const stageId = engine.findCardInZone("south", "stage", eb01Loguetown030);
    const selectedHandId = engine.findCardInZone("south", "hand", op13Otama043);
    const unselectedHandId = engine.findCardInZone("south", "hand", op13York094);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostReturnThisAndHandToDeck", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected Loguetown to publish its compound activation cost.");
    }
    expect(costDecision.actorId).toBe("south");
    expect(costStep.ordered).toBe(true);
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      stageId,
      selectedHandId,
      unselectedHandId,
    ]);

    engine.resolveDecision(
      "effectCostReturnThisAndHandToDeck",
      { selectedIds: [selectedHandId, stageId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.stage).toBeNull();
    expect(view.players.south.handCount).toBe(3);
    expect(engine.getState().players.south.deck.slice(-2)).toEqual([selectedHandId, stageId]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the defending player use its Life Trigger to play it without paying DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Higuma013, playedOnTurn: 0 }],
        activeDon: 3,
      },
      {
        life: [eb01Loguetown030],
        stage: op13WindmillVillage022,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op13Higuma013);
    engine.endTurn("south");
    engine.endTurn("north");
    const handCountBeforeDamage = engine.getView("north").players.north.handCount;
    engine.attachDon(attackerId, 3, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    const pendingView = engine.getView("north");
    expect(triggerDecision).toMatchObject({
      actorId: "north",
      kind: "confirm",
      submit: { commandType: "resolvePrompt", promptId: triggerDecision.id },
    });
    expect(pendingView.players.north.lifeCount).toBe(0);
    expect(pendingView.players.north.handCount).toBe(handCountBeforeDamage);

    const activeDonBeforeTrigger = pendingView.players.north.activeDon;
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const resolvedView = engine.getView("north");
    expect(resolvedView.players.north.stage?.cardId).toBe(eb01Loguetown030.id);
    expect(resolvedView.players.north.handCount).toBe(handCountBeforeDamage);
    expect(resolvedView.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(resolvedView.players.north.trash.map((card) => card.cardId)).toContain(
      op13WindmillVillage022.id,
    );
    expect(resolvedView.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
