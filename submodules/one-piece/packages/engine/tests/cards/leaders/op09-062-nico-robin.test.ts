import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op09Dereshi117,
  op09NicoOlvia106,
  op09NicoRobin062,
  op09ProfessorClover102,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("OP09-062 Nico Robin", () => {
  test("maps the Trigger-card payment, adds rested DON!!, and banishes damaged Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09NicoRobin062,
        hand: [op09ProfessorClover102, op09NicoOlvia106, eb01Doma005],
        donDeckCount: 1,
      },
      { hand: [], life: [op09Dereshi117] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const firstTriggerId = engine.findCardInZone("south", "hand", op09ProfessorClover102);
    const secondTriggerId = engine.findCardInZone("south", "hand", op09NicoOlvia106);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const lifeId = engine.findCardInZone("north", "life", op09Dereshi117);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Robin's Trigger-card cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstTriggerId,
      secondTriggerId,
    ]);
    expect(payment.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [firstTriggerId] }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(lifeId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
