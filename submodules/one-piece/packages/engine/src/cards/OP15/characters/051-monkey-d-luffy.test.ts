import { describe, expect, test } from "vite-plus/test";
import { op15MonkeyDLuffy051 } from "../../../../../cards/src/cards/characters/op15-051-monkey-d-luffy.ts";
import { op15Rebecca039 } from "../../../../../cards/src/cards/leaders/op15-039-rebecca.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-051 Monkey.D.Luffy", () => {
  test("[Opponent's Turn] gains +3000 power with a Dressrosa Leader", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Rebecca039, character: [op15MonkeyDLuffy051], activeDon: 2 },
      {},
    );

    expect(engine.getView("south").players.south.characters[0]?.power).toBe(4000);

    engine.endTurn("south");

    expect(engine.getView("south").players.south.characters[0]?.power).toBe(7000);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-051", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-051",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
