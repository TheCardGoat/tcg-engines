import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04KinEmon102, op10KinEmon026, op10KinEmon027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-027 Kin'emon", () => {
  test("cannot activate without a 1000-power Kin'emon in trash for its bottom-deck cost", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10KinEmon027],
      hand: [op04KinEmon102],
    });
    const kinemonId = engine.findCardInZone("south", "character", op10KinEmon027);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kinemonId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("bottom-decks itself and a 1000-power Kin'emon from trash, then plays a cost-6 Kin'emon", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10KinEmon027],
      hand: [op04KinEmon102],
      trash: [op10KinEmon026, op10KinEmon026, op10KinEmon027],
      deck: [eb01Doma005],
    });
    const sourceId = engine.findCardInZone("south", "character", op10KinEmon027);
    const paymentId = engine.findCardInZone("south", "trash", op10KinEmon026);
    const wrongPowerId = engine.findCardInZone("south", "trash", op10KinEmon027);
    const playedId = engine.findCardInZone("south", "hand", op04KinEmon102);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 2, max: 2, ordered: true });
    if (cost?.kind !== "payCost") throw new Error("Expected Kin'emon's trash payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongPowerId);
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [sourceId, paymentId] },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected the cost-6 Kin'emon choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playedId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(3);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(playedId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(sourceId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(wrongPowerId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(paymentId);
    expect(engine.findCardInZone("south", "deck", op10KinEmon027)).toBe(sourceId);
    expect(engine.findCardInZone("south", "deck", op10KinEmon026)).toBe(paymentId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10KinEmon027],
      hand: [op04KinEmon102],
      trash: [op10KinEmon026, op10KinEmon026, op10KinEmon027],
      deck: [eb01Doma005],
    });
    const sourceId = engine.findCardInZone("south", "character", op10KinEmon027);
    engine.activateEffect(sourceId, "activateMain", "south");
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
  test.each(["source-first", "trash-first"])(
    "orders mixed cost %s after snapshot and rejects invalid payments",
    (order) => {
      let e = OnePieceTestEngine.create({
        character: ["OP10-027"],
        trash: ["OP10-026", "OP10-026", "OP10-027"],
        hand: ["OP04-102", "P-096", "P-096"],
        deck: ["ST02-012"],
        activeDon: 5,
      });
      const source = e.findCardInZone("south", "character", "OP10-027");
      const payments = e
        .getView("south")
        .players.south.trash.filter((c) => c.cardId === "OP10-026")
        .flatMap((c) => (c.instanceId ? [c.instanceId] : []));
      const wrong = e.findCardInZone("south", "trash", "OP10-027");
      e.asSouth().attachDon(source, 1);
      e.asSouth().activateMain(source);
      e.asSouth().acceptOptional();
      const decision = e.pendingDecision("effectCostReturnTrashToDeck", "south");
      expect(decision.steps[0]).toMatchObject({ kind: "payCost", ordered: true, min: 2, max: 2 });
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      for (const selectedIds of [payments, [source, source], [source, wrong]]) {
        const failure = e.expectFailure({
          type: "resolvePrompt",
          seat: "south",
          promptId: decision.id,
          selectedIds,
        });
        expect(failure.accepted).toBe(false);
        e = OnePieceTestEngine.fromState(failure.state);
        expect(e.pendingDecision("effectCostReturnTrashToDeck", "south").id).toBe(decision.id);
        expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(source);
        expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(1);
        expect(e.getView("south").players.south.trash).toHaveLength(3);
        expect(e.getView("south").players.south.deckCount).toBe(1);
      }
      const selectedIds =
        order === "source-first" ? [source, payments[0]!] : [payments[0]!, source];
      e.resolveDecision("effectCostReturnTrashToDeck", { selectedIds }, "south");
      e.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
      expect(e.getView("south").players.south.restedDon).toBe(1);
      expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
      e.asSouth().play("P-096");
      e.resolveDecision(
        "effectTrashFromHandSelection",
        { selectedIds: [e.findCardInZone("south", "hand", "ST02-012")] },
        "south",
      );
      e.asSouth().play("P-096");
      e.resolveDecision(
        "effectTrashFromHandSelection",
        { selectedIds: [e.findCardInZone("south", "hand", "OP04-102")] },
        "south",
      );
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(
        selectedIds[0],
      );
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).not.toContain(
        selectedIds[1],
      );
      expect(e.getView("south").players.south.deckCount).toBe(1);
    },
  );
});
