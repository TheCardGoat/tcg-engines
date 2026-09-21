import { describe, expect, test } from "vite-plus/test";
import { op15Brook022 } from "../../../../../cards/src/cards/leaders/op15-022-brook.ts";
import { op15Sanji081 } from "../../../../../cards/src/cards/characters/op15-081-sanji.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-081 Sanji", () => {
  test("[On Play] trashes 5 deck cards with a Straw Hat Crew Leader", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Brook022, hand: [op15Sanji081], activeDon: 3, deck: 8 },
      {},
    );
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15Sanji081);

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-081", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-081",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
