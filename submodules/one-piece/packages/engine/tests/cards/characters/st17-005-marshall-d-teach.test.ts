import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  prb02MarshallDTeachSt17005PirateFoil005,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST17-005 Marshall.D.Teach", () => {
  test("places a chosen hand card on top of the deck before giving two rested DON!! once per turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02MarshallDTeachSt17005PirateFoil005],
      hand: [eb01Doma005, eb01Fourtricks025],
      restedDon: 2,
    });
    const teachId = engine.findCardInZone(
      "south",
      "character",
      prb02MarshallDTeachSt17005PirateFoil005,
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const retainedId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const leaderId = engine.leader("south");

    engine.activateEffect(teachId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnHandToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 1, max: 1, ordered: true });
    if (cost?.kind !== "payCost") throw new Error("Expected Teach's top-deck payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([paymentId, retainedId]);
    engine.resolveDecision("effectCostReturnHandToDeck", { selectedIds: [paymentId] }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Teach's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Teach's DON!! recipient.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([leaderId, teachId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    const view = engine.getView("south");
    expect(engine.getState().players.south.deck[0]).toBe(paymentId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([retainedId]);
    expect(view.players.south.leader.attachedDon).toBe(2);
    expect(view.players.south.restedDon).toBe(0);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: teachId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    expect(view.prompts).toHaveLength(0);
  });
});
