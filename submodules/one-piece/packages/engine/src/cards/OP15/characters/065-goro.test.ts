import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op03Boodle050 } from "../../../../../cards/src/cards/characters/op03-050-boodle.ts";
import { op15Goro065 } from "../../../../../cards/src/cards/characters/op15-065-goro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-065 Goro", () => {
  test("[On Play] rests a DON!! when the revealed card costs 2 or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Goro065], activeDon: 3, donDeckCount: 4, deck: [op03Boodle050, eb01Doma005] },
      {},
    );
    const donBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op15Goro065);

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected the DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.restedDon).toBe(4);
    expect(south.donDeckCount).toBe(donBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("adds no DON!! when the revealed card costs more than 2", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15Goro065],
        activeDon: 3,
        donDeckCount: 4,
        deck: [eb01Fourtricks025, eb01Doma005],
      },
      {},
    );

    engine.playCard(op15Goro065);

    const south = engine.getView("south").players.south;
    expect(south.restedDon).toBe(3);
    expect(south.donDeckCount).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
