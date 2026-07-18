import { describe, expect, test } from "vite-plus/test";
import { op04Hajrudin088, op04Rebecca039, op06GeckoMoria080, op06Sai088 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-088 Sai", () => {
  test("gains +2000 power only while its Dressrosa Leader is active", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        character: [op04Hajrudin088, { card: op06Sai088, playedOnTurn: 0 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const saiId = engine.findCardInZone("south", "character", op06Sai088);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === saiId)
        ?.power,
    ).toBe(6000);

    engine.activateEffect(
      engine.findCardInZone("south", "character", op04Hajrudin088),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === saiId)
        ?.power,
    ).toBe(4000);
  });

  test("does not gain power with an active non-Dressrosa Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06GeckoMoria080,
      character: [op06Sai088],
    });
    const saiId = engine.findCardInZone("south", "character", op06Sai088);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === saiId)
        ?.power,
    ).toBe(4000);
  });
});
