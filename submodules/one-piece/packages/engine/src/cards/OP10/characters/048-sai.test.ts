import { describe, expect, test } from "vite-plus/test";
import { op04Rebecca039 } from "@tcg/op-cards";
import { op10Sai048 } from "../../../../../cards/src/cards/characters/op10-048-sai.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-048 Sai", () => {
  test("can rest a compound-trait Dressrosa Leader as its optional cost", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04Rebecca039,
      hand: [op10Sai048],
      activeDon: op10Sai048.cost,
    });
    engine.playCard(op10Sai048, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.leader.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").players.south.characters.filter(Boolean).length).toBeGreaterThan(
      0,
    );
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04Rebecca039,
      hand: [op10Sai048],
      activeDon: op10Sai048.cost,
    });
    engine.playCard(op10Sai048, "south");
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
});
