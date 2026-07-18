import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op08ItSToDieFor076 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-076 It's to Die For", () => {
  test("Main adds both optional active DON!! when the opponent has a 6000-or-more Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08ItSToDieFor076], activeDon: 3, donDeckCount: 2 },
      { character: [eb01MountainGod018] },
    );

    engine.playCard(op08ItSToDieFor076);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 2,
      restedDon: 3,
      donDeckCount: 0,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
