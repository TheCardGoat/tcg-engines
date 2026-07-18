import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01AshuraDoji032 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-032 Ashura Doji", () => {
  test("with DON!! attached, gains +2000 only at two rested opposing Characters", () => {
    const thresholdEngine = OnePieceTestEngine.create(
      {
        character: [{ card: op01AshuraDoji032, attachedDon: 1 }],
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const thresholdId = thresholdEngine.findCardInZone("south", "character", op01AshuraDoji032);

    expect(
      thresholdEngine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === thresholdId)?.power,
    ).toBe(7000);

    const belowThresholdEngine = OnePieceTestEngine.create(
      {
        character: [{ card: op01AshuraDoji032, attachedDon: 1 }],
      },
      {
        character: [eb01Doma005, { card: eb01Doma005, rested: true }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const belowThresholdId = belowThresholdEngine.findCardInZone(
      "south",
      "character",
      op01AshuraDoji032,
    );

    expect(
      belowThresholdEngine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === belowThresholdId)?.power,
    ).toBe(5000);
  });
});
