import { describe, expect, test } from "vite-plus/test";
import { op04Rokki054 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-054 Rokki", () => {
  test("is a vanilla Giant and Animal Kingdom Pirates Character", () => {
    expect(op04Rokki054).toMatchObject({
      cost: 5,
      power: 7000,
      counter: 1000,
      traits: ["Giant", "Animal Kingdom Pirates"],
    });
    expect(op04Rokki054.effect).toBeUndefined();
    expect(op04Rokki054.i18n.en.effect).toBeUndefined();
    expect(op04Rokki054.effects).toBeUndefined();

    const engine = OnePieceTestEngine.create({ hand: [op04Rokki054], activeDon: 5 });
    engine.playCard(op04Rokki054, "south");

    expect(
      engine.getView("south").players.south.characters.filter((character) => character !== null),
    ).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
