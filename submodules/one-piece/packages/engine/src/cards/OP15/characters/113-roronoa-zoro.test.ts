import { describe, expect, test } from "vite-plus/test";
import { op02IceAge117 } from "@tcg/op-cards";
import { op15RoronoaZoro113 } from "../../../../../cards/src/cards/characters/op15-113-roronoa-zoro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-113 Roronoa Zoro", () => {
  test("[On Play] trashes a hand card to move a deck card to the top of Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15RoronoaZoro113, op02IceAge117], activeDon: 4, deck: 5 },
      {},
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15RoronoaZoro113);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The lone hand card auto-pays the trash cost.
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore + 1);
    expect(south.deckCount).toBe(deckBefore - 1);
    expect(south.trash.map((card) => card.cardId)).toContain("OP02-117");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined trashes nothing and moves no Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15RoronoaZoro113, op02IceAge117], activeDon: 4, deck: 5 },
      {},
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15RoronoaZoro113);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore);
    expect(south.deckCount).toBe(deckBefore);
    expect(south.hand.map((card) => card.cardId)).toContain("OP02-117");
    expect(south.trash.map((card) => card.cardId)).not.toContain("OP02-117");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
