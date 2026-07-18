import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11CharlotteKatakuri062 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-062 Charlotte Katakuri", () => {
  test("returns one DON, privately looks at the opposing top card, and gains battle power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11CharlotteKatakuri062, activeDon: 1 },
      { deck: [eb01Doma005], hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    expect(
      engine.getView("south").logs.some((entry) => entry.message.includes(eb01Doma005.name)),
    ).toBe(true);
    expect(
      engine.getView("north").logs.some((entry) => entry.message.includes(eb01Doma005.name)),
    ).toBe(false);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
