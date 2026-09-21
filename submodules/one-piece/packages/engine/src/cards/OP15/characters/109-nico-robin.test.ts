import { describe, expect, test } from "vite-plus/test";
import { op15Brook022 } from "../../../../../cards/src/cards/leaders/op15-022-brook.ts";
import { op15GanFall102 } from "../../../../../cards/src/cards/characters/op15-102-gan-fall.ts";
import { op15NicoRobin109 } from "../../../../../cards/src/cards/characters/op15-109-nico-robin.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-109 Nico Robin", () => {
  test("[On Play] pays top Life, moves a deck card to Life, and plays a Sky Island Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Brook022,
        hand: [op15NicoRobin109, op15GanFall102],
        activeDon: 8,
        deck: [op15GanFall102, op15GanFall102, op15GanFall102],
        life: 3,
      },
      {},
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op15NicoRobin109);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The Life cost auto-pays from the top of Life.
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore);
    expect(south.hand).toHaveLength(2);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the Sky Island play choice.");
    const ganFallId = engine
      .getView("south")
      .players.south.hand.find((card) => card.cardId === "OP15-102")!.instanceId!;
    engine.resolveDecision("effectPlaySelection", { selectedIds: [ganFallId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === ganFallId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined skips the Life pay and the Sky Island play", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Brook022,
        hand: [op15NicoRobin109, op15GanFall102],
        activeDon: 8,
        deck: [op15GanFall102, op15GanFall102, op15GanFall102],
        life: 3,
      },
      {},
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15NicoRobin109);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore);
    expect(south.deckCount).toBe(deckBefore);
    expect(south.hand.map((card) => card.cardId)).toContain("OP15-102");
    expect(south.characters.map((card) => card?.cardId)).toContain("OP15-109");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
