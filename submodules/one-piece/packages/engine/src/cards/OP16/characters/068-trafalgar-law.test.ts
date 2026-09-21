import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-068 Trafalgar Law", () => {
  test("[On Play] adds up to 1 active DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-068"], activeDon: 4, donDeckCount: 3 },
      {},
    );

    engine.playCard("OP16-068");
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    // Play cost 4 consumed the active DON!!; the added DON!! is active.
    expect(south.activeDon).toBe(1);
    expect(south.donDeckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[When Attacking] with a Donquixote Pirates Leader gains +3000 power during the turn", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP04-019", character: ["OP16-068"], activeDon: 5 },
      {},
    );

    engine.asSouth().attack("OP16-068", engine.asNorth().leader());

    const power = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === "OP16-068")?.power;
    expect(power).toBe(6000);
  });

  test("without a Donquixote Pirates Leader the power bonus does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-068", attachedDon: 1 }], activeDon: 5 },
      {},
    );

    engine.asSouth().attack("OP16-068", engine.asNorth().leader());

    const power = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === "OP16-068")?.power;
    expect(power).toBe(4000);
  });
});
