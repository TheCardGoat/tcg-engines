import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12Jango045 } from "@tcg/op-cards";
import { op12MonkeyDGarp056 } from "../../../../../cards/src/cards/characters/op12-056-monkey-d-garp.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-056 Monkey.D.Garp", () => {
  test("trashes a chosen hand card before playing only an eligible blue Navy Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12MonkeyDGarp056, op12Jango045, op12MonkeyDGarp056, eb01Doma005],
      activeDon: op12MonkeyDGarp056.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op12Jango045);
    const garpIds = engine
      .getView("south")
      .players.south.hand.filter((card) => card.cardId === op12MonkeyDGarp056.id)
      .map((card) => card.instanceId);
    const excludedGarpId = garpIds[1];
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op12MonkeyDGarp056, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Garp's Navy play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedGarpId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12MonkeyDGarp056, op12Jango045, op12MonkeyDGarp056, eb01Doma005],
      activeDon: op12MonkeyDGarp056.cost,
    });
    engine.playCard(op12MonkeyDGarp056, "south");

    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("cannot play the Navy Character drawn by Kuzan after Garp finishes resolving", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: "OP12-040",
      hand: [op12MonkeyDGarp056, eb01Doma005, "OP12-050"],
      deck: [op12Jango045, eb01Doma005, eb01Doma005],
      activeDon: op12MonkeyDGarp056.cost,
    });
    const payment = engine.findCardInZone("south", "hand", eb01Doma005);
    const existing = engine.findCardInZone("south", "hand", "OP12-050");
    const drawn = engine.findCardInZone("south", "deck", op12Jango045);
    engine.asSouth().play(op12MonkeyDGarp056);
    engine.asSouth().acceptOptional();
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [payment] }, "south");
    const step = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Garp play choice");
    expect(step.candidates.map((c) => c.ref.id)).toContain(existing);
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(drawn);
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).not.toContain(
      drawn,
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [existing] }, "south");
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      existing,
    );
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(drawn);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
