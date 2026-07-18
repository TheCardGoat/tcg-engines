import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op09Buggy042, op12Buggy049 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-042 Buggy", () => {
  test("pays five DON!! plus one chosen hand card and plays a composite Cross Guild Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Buggy042,
      hand: [op12Buggy049, eb01Doma005, eb01MountainGod018],
      activeDon: 5,
    });
    const playId = engine.findCardInZone("south", "hand", op12Buggy049);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const excludedId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Buggy's hand payment choice.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([playId, paymentId, excludedId]),
    );
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Buggy's Cross Guild play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(playId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
