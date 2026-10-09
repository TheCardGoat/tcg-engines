import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-002 Izo", () => {
  test("reveal payment accepts exactly 8000 and excludes both 7000 and 9000", () => {
    const engine = OnePieceTestEngine.create({
      hand: ["OP16-002", "OP16-004", "OP16-016", "OP16-008", "OP16-035"],
      activeDon: 1,
    });
    const exactId = engine.findCardInZone("south", "hand", "OP16-004");
    const lowId = engine.findCardInZone("south", "hand", "OP16-008");
    const highId = engine.findCardInZone("south", "hand", "OP16-035");
    const deckBefore = engine.getView("south").players.south.deckCount;
    engine.playCard("OP16-002", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const reveal = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    if (reveal?.kind !== "payCost") throw new Error("Expected reveal payment.");
    const ids = reveal.candidates.map((card) => card.ref.id);
    expect(ids).toContain(exactId);
    expect(ids).not.toContain(lowId);
    expect(ids).not.toContain(highId);
    engine.resolveDecision("effectCostRevealFromHand", { selectedIds: [exactId] }, "south");
    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 1);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      exactId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] revealing an 8000-power Character draws 1 card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-002", "OP16-004", "OP13-013"], activeDon: 1 },
      {},
    );

    engine.playCard("OP16-002");
    // Exactly one eligible card exists, so the reveal cost auto-pays.
    engine.acceptLeadingOptional("south");

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toHaveLength(3);
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-004");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the payable reveal preserves hand, deck, and DON!! after play", () => {
    const engine = OnePieceTestEngine.create({
      hand: ["OP16-002", "OP16-004", "OP13-013"],
      deck: ["EB01-005", "OP16-016"],
      activeDon: 2,
    });
    const izoId = engine.findCardInZone("south", "hand", "OP16-002");
    const revealId = engine.findCardInZone("south", "hand", "OP16-004");
    const retainedId = engine.findCardInZone("south", "hand", "OP13-013");
    engine.playCard("OP16-002", "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    const before = engine.getView("south").players.south;
    expect(before.hand.map((card) => card.instanceId)).toEqual([revealId, retainedId]);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const after = engine.getView("south").players.south;
    expect(after.hand.map((card) => card.instanceId)).toEqual([revealId, retainedId]);
    expect(after.deckCount).toBe(before.deckCount);
    expect(after.deckCount).toBe(2);
    expect(after.activeDon).toBe(before.activeDon);
    expect(after.restedDon).toBe(before.restedDon);
    expect(after.activeDon).toBe(1);
    expect(after.restedDon).toBe(1);
    expect(after.trash).toHaveLength(0);
    expect(after.characters.map((card) => card?.instanceId)).toContain(izoId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without an 8000-power Character in hand the draw is not offered", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-002", "OP13-013"], activeDon: 1 }, {});

    engine.playCard("OP16-002");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
