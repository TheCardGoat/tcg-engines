import { describe, expect, test } from "vite-plus/test";
import { op07Foxy059, op07Gina065 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-065 Gina", () => {
  test("with a Foxy Pirates Leader and no DON!! advantage, adds up to one active DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07Foxy059,
        hand: [op07Gina065],
        activeDon: op07Gina065.cost,
      },
      { activeDon: 1 },
    );

    engine.playCard(op07Gina065, "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Gina's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
  });

  test("adds no DON!! without both the Leader trait and DON!! comparison", () => {
    const wrongLeader = OnePieceTestEngine.create(
      { hand: [op07Gina065], activeDon: op07Gina065.cost },
      { activeDon: 1 },
    );
    wrongLeader.playCard(op07Gina065, "south");
    expect(wrongLeader.getView("south").prompts).toHaveLength(0);

    const aheadOnDon = OnePieceTestEngine.create(
      {
        leaderCardId: op07Foxy059,
        hand: [op07Gina065],
        activeDon: op07Gina065.cost + 1,
      },
      { activeDon: 0 },
    );
    aheadOnDon.playCard(op07Gina065, "south");
    expect(aheadOnDon.getView("south").prompts).toHaveLength(0);
  });
});
