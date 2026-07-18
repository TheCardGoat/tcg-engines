import { describe, expect, test } from "vite-plus/test";
import { op04Bananagator062 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-062 Bananagator", () => {
  test("is a vanilla Animal Character", () => {
    expect(op04Bananagator062).toMatchObject({
      cost: 5,
      power: 7000,
      counter: 1000,
      traits: ["Animal"],
    });
    expect(op04Bananagator062.effect).toBeUndefined();
    expect(op04Bananagator062.i18n.en.effect).toBeUndefined();
    expect(op04Bananagator062.effects).toBeUndefined();

    const engine = OnePieceTestEngine.create({ hand: [op04Bananagator062], activeDon: 5 });
    const bananagatorId = engine.findCardInZone("south", "hand", op04Bananagator062);
    engine.playCard(op04Bananagator062, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.some((character) => character?.instanceId === bananagatorId),
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
  });
});
