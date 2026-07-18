import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op06Cerberus087,
  op06GeckoMoria080,
  op06GeckoMoria086,
  op06JigoroOfTheWind084,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-080 Gecko Moria", () => {
  test("pays both costs, trashes the top two cards, and maps eligible Thriller Bark Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06GeckoMoria080,
        hand: [eb01MountainGod018, eb01Doma005],
        deck: [op06JigoroOfTheWind084, eb01Doma005, eb01MountainGod018],
        trash: [op06Cerberus087, op06GeckoMoria086],
        activeDon: 3,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const otherPaymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const existingCandidateId = engine.findCardInZone("south", "trash", op06Cerberus087);
    const excludedCostEightId = engine.findCardInZone("south", "trash", op06GeckoMoria086);
    const milledCandidateId = engine.findCardInZone("south", "deck", op06JigoroOfTheWind084);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Moria's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      paymentId,
      otherPaymentId,
    ]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Moria's trash play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([existingCandidateId, milledCandidateId]),
    );
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedCostEightId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [milledCandidateId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(
      milledCandidateId,
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2, deckCount: 1 });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
