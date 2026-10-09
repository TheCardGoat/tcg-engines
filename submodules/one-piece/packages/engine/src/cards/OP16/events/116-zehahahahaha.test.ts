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
  test("FAQ: playing Teach does not require the opponent to have Life", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP16-116", "ST03-014"], activeDon: 10 },
      { life: 0 },
    );
    const teach = e.findCardInZone("south", "hand", "ST03-014");
    e.playCard("OP16-116");
    e.resolveDecision("effectPlaySelection", { selectedIds: [teach] }, "south");
    e.resolveDecision("effectRemoveFromLifeCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === teach)).toBe(
      true,
    );
    expect(e.getView("south").players.north.lifeCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("Life Trigger draws two and trashes one without requiring ten DON", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP16-116", "ST02-002"], deck: ["ST02-002", "ST02-003", "ST02-002"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.handCount).toBe(2);
    e.asSouth().trashFromHand("ST02-002");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-003"]);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-116");
  });
});
