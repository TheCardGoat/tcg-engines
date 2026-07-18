import { describe, expect, test } from "vite-plus/test";
import { op04OimoKashii078 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-078 Oimo & Kashii", () => {
  test("is a vanilla Giant and World Government Character", () => {
    expect(op04OimoKashii078).toMatchObject({
      cost: 6,
      power: 8000,
      counter: 1000,
      traits: ["Giant", "World Government"],
    });
    expect(op04OimoKashii078.effect).toBeUndefined();
    expect(op04OimoKashii078.i18n.en.effect).toBeUndefined();
    expect(op04OimoKashii078.effects).toBeUndefined();

    const engine = OnePieceTestEngine.create({
      hand: [op04OimoKashii078],
      activeDon: op04OimoKashii078.cost,
    });
    engine.playCard(op04OimoKashii078, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.cardId === op04OimoKashii078.id),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
