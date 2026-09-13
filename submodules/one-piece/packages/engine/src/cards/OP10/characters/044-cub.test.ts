import { describe, expect, test } from "vite-plus/test";
import { op04CorridaColiseum096 } from "@tcg/op-cards";
import { op10Cub044 } from "../../../../../cards/src/cards/OP10/characters/044-cub.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-044 Cub", () => {
  test("can rest a Dressrosa Stage as its optional cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Cub044],
      stage: op04CorridaColiseum096,
      activeDon: 1,
    });
    engine.playCard(op10Cub044, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.stage?.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").players.south.characters.filter(Boolean).length).toBeGreaterThan(
      0,
    );
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Cub044],
      stage: op04CorridaColiseum096,
      activeDon: 1,
    });
    engine.playCard(op10Cub044, "south");
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
