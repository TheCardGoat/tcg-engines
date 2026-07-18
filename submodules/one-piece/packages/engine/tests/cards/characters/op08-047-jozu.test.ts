import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Kaido094,
  op08Jozu047,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-047 Jozu", () => {
  test("returns another own Character as payment, then may return either player's cost-6 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08Jozu047],
        character: [eb01Doma005, eb01Fourtricks025],
        activeDon: op08Jozu047.cost,
      },
      { character: [eb01MountainGod018, op01Kaido094] },
    );
    const paymentId = engine.findCardInZone("south", "character", eb01Doma005);
    const otherPaymentId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op01Kaido094);

    engine.playCard(op08Jozu047, "south");
    const jozuId = engine.findCardInZone("south", "character", op08Jozu047);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (cost?.kind !== "payCost") throw new Error("Expected Jozu's Character-return payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      paymentId,
      otherPaymentId,
    ]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(jozuId);
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [paymentId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Jozu's owner-neutral return.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([jozuId, otherPaymentId, targetId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning another Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08Jozu047],
      character: [eb01Doma005],
      activeDon: op08Jozu047.cost,
    });
    const paymentId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.playCard(op08Jozu047, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === paymentId),
    ).toBe(true);
  });
});
