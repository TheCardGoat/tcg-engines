import { describe, expect, test } from "vite-plus/test";
import { op04TrafalgarLaw087 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-087 Trafalgar Law", () => {
  test("is a vanilla Dressrosa and Heart Pirates Character", () => {
    expect(op04TrafalgarLaw087).toMatchObject({
      cost: 5,
      power: 7000,
      counter: 1000,
      traits: ["Dressrosa", "Heart Pirates"],
    });
    expect(op04TrafalgarLaw087.effect).toBeUndefined();
    expect(op04TrafalgarLaw087.i18n.en.effect).toBeUndefined();
    expect(op04TrafalgarLaw087.effects).toBeUndefined();

    const engine = OnePieceTestEngine.create({
      hand: [op04TrafalgarLaw087],
      activeDon: op04TrafalgarLaw087.cost,
    });
    engine.playCard(op04TrafalgarLaw087, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.cardId === op04TrafalgarLaw087.id),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
