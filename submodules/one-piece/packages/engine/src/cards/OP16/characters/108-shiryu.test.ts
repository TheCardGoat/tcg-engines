import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-108 Shiryu", () => {
  test("[On Play] trashing a hand card adds a Blackbeard card from trash face-up on top of Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-108", "EB01-005"], trash: ["OP16-103"], activeDon: 6 },
      {},
    );

    engine.playCard("OP16-108");
    engine.acceptLeadingOptional("south");
    // The lone hand card auto-pays the trash cost and the lone Blackbeard
    // card in trash auto-adds to the top of Life.
    const state = engine.getState();
    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(5);
    const topLifeId = state.players.south.life[0]!;
    expect(state.cards[topLifeId]!.cardId).toBe("OP16-103");
    expect(state.cards[topLifeId]!.faceUp).toBe(true);
  });

  test("[Trigger] Draw 2 cards when taken as Life damage", () => {
    const engine = OnePieceTestEngine.create(
      { life: ["OP16-108"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
  });
});
