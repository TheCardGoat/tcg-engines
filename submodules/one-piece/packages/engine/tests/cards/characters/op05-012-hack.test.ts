import { describe, expect, test } from "vite-plus/test";
import { op05Hack012 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-012 Hack", () => {
  test("is a vanilla Fish-Man Revolutionary Army Character", () => {
    expect(op05Hack012).toMatchObject({
      cost: 3,
      power: 5000,
      counter: 1000,
      traits: ["Fish-Man Revolutionary Army"],
    });
    expect(op05Hack012.effect).toBeUndefined();
    expect(op05Hack012.i18n.en.effect).toBeUndefined();
    expect(op05Hack012.effects).toBeUndefined();

    const engine = OnePieceTestEngine.create({
      hand: [op05Hack012],
      activeDon: op05Hack012.cost,
    });
    engine.playCard(op05Hack012, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.cardId === op05Hack012.id),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
