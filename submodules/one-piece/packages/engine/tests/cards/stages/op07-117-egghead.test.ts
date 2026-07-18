import { describe, expect, test } from "vite-plus/test";
import { op07Atlas098, op07Egghead117, op13Higuma013, op13Pythagoras111 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-117 Egghead", () => {
  test("lets its controller set an eligible Egghead Character active at the end of their turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        stage: op07Egghead117,
        life: 3,
        character: [
          { card: op07Atlas098, rested: true },
          { card: op13Pythagoras111, rested: true },
          { card: op13Higuma013, rested: true },
        ],
      },
      { character: [{ card: op07Atlas098, rested: true }] },
    );
    const eligibleId = engine.findCardInZone("south", "character", op07Atlas098);
    const tooExpensiveId = engine.findCardInZone("south", "character", op13Pythagoras111);
    const wrongTypeId = engine.findCardInZone("south", "character", op13Higuma013);
    const opposingEligibleId = engine.findCardInZone("north", "character", op07Atlas098);

    engine.endTurn("south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("south");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Egghead to publish its Character selection.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingEligibleId,
    );

    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    const restedById = new Map(
      view.players.south.characters.flatMap((card) =>
        card ? [[card.instanceId, card.rested] as const] : [],
      ),
    );
    expect(restedById.get(eligibleId)).toBe(false);
    expect(restedById.get(tooExpensiveId)).toBe(true);
    expect(restedById.get(wrongTypeId)).toBe(true);
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    const highLifeEngine = OnePieceTestEngine.create({
      stage: op07Egghead117,
      life: 4,
      character: [{ card: op07Atlas098, rested: true }],
    });
    highLifeEngine.endTurn("south");

    expect(highLifeEngine.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(highLifeEngine.getView("south").prompts).toHaveLength(0);
  });

  test("lets the defending player use its Life Trigger to play it without paying DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Higuma013, playedOnTurn: 0 }],
        activeDon: 3,
      },
      {
        life: [op07Egghead117],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(attackerId, 3, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    expect(triggerDecision).toMatchObject({
      actorId: "north",
      kind: "confirm",
      submit: { commandType: "resolvePrompt", promptId: triggerDecision.id },
    });
    const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;

    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.stage?.cardId).toBe(op07Egghead117.id);
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
