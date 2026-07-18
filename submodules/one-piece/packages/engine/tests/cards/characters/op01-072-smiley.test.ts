import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Smiley072 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-072 Smiley", () => {
  test("with DON!! attached gains +1000 per hand card only during its turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Doma005, eb01Doma005],
        character: [{ card: op01Smiley072, attachedDon: 1 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const smileyId = engine.findCardInZone("south", "character", op01Smiley072);
    const handCount = engine.getView("south").players.south.hand.length;

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === smileyId)
        ?.power,
    ).toBe(2000 + handCount * 1000);

    engine.endTurn("south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === smileyId)
        ?.power,
    ).toBe(1000);

    const noDon = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Doma005, eb01Doma005],
        character: [op01Smiley072],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const noDonId = noDon.findCardInZone("south", "character", op01Smiley072);
    expect(
      noDon.getView("south").players.south.characters.find((card) => card?.instanceId === noDonId)
        ?.power,
    ).toBe(1000);
  });
});
