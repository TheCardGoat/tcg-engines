import { describe, expect, test } from "vite-plus/test";
import { op04CorridaColiseum096 } from "@tcg/op-cards";
import { op10Cub044 } from "../../../../../cards/src/cards/OP10/characters/044-cub.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-044 Cub", () => {
  test("can rest a Dressrosa Stage as its optional cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Cub044],
      stage: op04CorridaColiseum096,
      activeDon: 1,
    });
    engine.playCard(op10Cub044, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.stage?.rested).toBe(true);
  });
});
