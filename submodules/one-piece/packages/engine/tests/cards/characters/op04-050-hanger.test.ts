import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op04Hanger050 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-050 Hanger", () => {
  test("trashes a hand card and rests itself before drawing", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Hanger050],
      hand: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018],
    });
    const hangerId = engine.findCardInZone("south", "character", op04Hanger050);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.activateEffect(hangerId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Hanger's hand-trash cost.");
    expect(payment).toMatchObject({ min: 1, max: 1 });
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([
        discardedId,
        engine.findCardInZone("south", "hand", eb01Fourtricks025),
      ]),
    );
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hangerId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: hangerId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("may decline without resting itself, discarding, or drawing", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Hanger050],
      hand: [eb01Doma005],
      deck: [eb01MountainGod018],
    });
    const hangerId = engine.findCardInZone("south", "character", op04Hanger050);
    const keptId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.activateEffect(hangerId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash).toHaveLength(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hangerId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("cannot activate without a hand card to trash", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Hanger050],
      deck: [eb01MountainGod018],
    });
    const hangerId = engine.findCardInZone("south", "character", op04Hanger050);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: hangerId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hangerId)?.rested,
    ).toBe(false);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
