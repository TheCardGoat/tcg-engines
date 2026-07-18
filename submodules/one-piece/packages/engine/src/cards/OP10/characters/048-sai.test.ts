import { describe, expect, test } from "vite-plus/test";
import { op04Rebecca039 } from "@tcg/op-cards";
import { op10Sai048 } from "../../../../../cards/src/cards/OP10/characters/048-sai.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-048 Sai", () => {
  test("can rest a compound-trait Dressrosa Leader as its optional cost", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04Rebecca039,
      hand: [op10Sai048],
      activeDon: op10Sai048.cost,
    });
    engine.playCard(op10Sai048, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.leader.rested).toBe(true);
  });
});
