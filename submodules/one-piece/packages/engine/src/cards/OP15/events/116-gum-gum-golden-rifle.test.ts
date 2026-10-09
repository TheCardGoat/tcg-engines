import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-116 Gum-Gum Golden Rifle", () => {
  test("[Main] with a Straw Hat Leader cycles the top of Life and trashes 1 from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-022",
        hand: ["OP15-116", "EB01-005"],
        deck: ["OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 1,
      },
      {},
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const state = engine.getState();
    const oldTopId = state.players.south.life[0]!;
    const oldTopCard = state.cards[oldTopId]!.cardId;

    engine.playCard("OP15-116");
    const add = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the Life add count.");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    // The lone hand card auto-pays the trash.

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.cardId)).toContain(oldTopCard);
    expect(south.lifeCount).toBe(lifeBefore);
    const newTopId = engine.getState().players.south.life[0]!;
    expect(newTopId).not.toBe(oldTopId);
    // The new top Life card came from the top of the deck.
    expect(engine.getView("south").players.south.deckCount).toBe(3);
    expect(south.hand).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a Straw Hat Leader the Main effect is not offered", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-080", hand: ["OP15-116", "EB01-005"], activeDon: 1 },
      {},
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.playCard("OP15-116");

    // The whole effect is gated on the Straw Hat Leader: nothing happens.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each([0, 1])("FAQ: may replenish Life with %i Life and an empty hand", (life) => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-022",
        hand: ["OP15-116"],
        life,
        deck: ["ST02-002", "ST02-003"],
        activeDon: 1,
      },
      {},
    );
    e.playCard("OP15-116");
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Counter grants its printed battle power and then expires", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP15-116", "ST02-002"], activeDon: 5, trash: 14, deck: ["ST02-003", "ST02-003"] },
      { activeDon: 2 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attachDon(e.leader("north"), 2);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter("OP15-116");
    expect(e.getView("south").players.south.leader.power).toBe(9000);

    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
