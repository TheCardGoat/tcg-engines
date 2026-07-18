import { describe, expect, test } from "vite-plus/test";
import { op04Randolph114 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-114 Randolph", () => {
  test("is a vanilla Big Mom Pirates Homies Character", () => {
    expect(op04Randolph114).toMatchObject({
      cost: 5,
      power: 7000,
      counter: 1000,
      traits: ["Big Mom Pirates", "Homies"],
    });
    expect(op04Randolph114.effect).toBeUndefined();
    expect(op04Randolph114.i18n.en.effect).toBeUndefined();
    expect(op04Randolph114.effects).toBeUndefined();

    const engine = OnePieceTestEngine.create({
      hand: [op04Randolph114],
      activeDon: op04Randolph114.cost,
    });
    engine.playCard(op04Randolph114, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.cardId === op04Randolph114.id),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
