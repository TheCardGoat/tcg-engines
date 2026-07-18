import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op10RoronoaZoro038 } from "../../../../../cards/src/cards/OP10/characters/038-roronoa-zoro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-038 Roronoa Zoro", () => {
  test("gains power on the opponent's turn only with at least two rested Characters", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10RoronoaZoro038, { card: eb01Doma005, rested: true }] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const zoroId = engine.findCardInZone("south", "character", op10RoronoaZoro038);
    const power = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === zoroId)?.power;
    expect(power).toBe(6000);

    const threshold = OnePieceTestEngine.create(
      {
        character: [
          { card: op10RoronoaZoro038, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const thresholdId = threshold.findCardInZone("south", "character", op10RoronoaZoro038);
    expect(
      threshold
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === thresholdId)?.power,
    ).toBe(8000);
  });
});
