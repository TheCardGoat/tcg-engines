import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-116 Zehahahahaha!!", () => {
  test("[Main] with 10 DON!! plays a [Marshall.D.Teach] and moves an opposing Life card to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-116", "OP16-119"], activeDon: 10 },
      { activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;
    const state = engine.getState();
    const northTopLifeId = state.players.north.life[0]!;
    const northTopCard = state.cards[northTopLifeId]!.cardId;

    engine.playCard("OP16-116");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );
    const remove = engine.pendingDecision("effectRemoveFromLifeCount", "south").steps[0];
    if (remove?.kind !== "chooseOption") throw new Error("Expected the Life count.");
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");
    // The played Teach's own On Play search: decline it.
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-119");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    engine.findCardInZone("north", "hand", northTopCard);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without 10 DON!! nothing happens", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-116", "OP16-119"], activeDon: 8 },
      { activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard("OP16-116");

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).not.toContain("OP16-119");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
