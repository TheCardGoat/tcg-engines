import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04Orlumbus079, op04Rebecca039 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-039 Rebecca", () => {
  test("cannot attack and privately searches an included Dressrosa card after paying DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04Rebecca039,
      deck: [op04Orlumbus079, eb01Doma005, eb01Doma005],
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "deck", op04Orlumbus079);
    const trashedId = engine.findCardInZone("south", "deck", eb01Doma005);

    const attackFailure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: engine.leader("south"),
      targetId: engine.leader("north"),
    });
    expect(attackFailure.reason).toBe("The selected attacker cannot attack.");

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected Rebecca's controller to choose a revealed Dressrosa card.");
    }
    expect(step).toMatchObject({ min: 0, max: 1 });
    expect(
      step.candidates.map((candidate) => ({ id: candidate.ref.id, legal: candidate.legal })),
    ).toEqual([
      { id: selectedId, legal: true },
      { id: trashedId, legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([selectedId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashedId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1, deckCount: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
