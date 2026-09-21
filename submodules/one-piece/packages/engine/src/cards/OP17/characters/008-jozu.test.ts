import { describe, expect, test } from "vite-plus/test";
import { op17Jozu008 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-008 Jozu", () => {
  test("sets an [Edward.Newgate] Leader's base power to 8000 until the opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-001", hand: [op17Jozu008], activeDon: op17Jozu008.cost },
      {},
    );
    const leaderPower = () => engine.getView("south").players.south.leader?.power;

    engine.playCard(op17Jozu008, "south");
    expect(leaderPower()).toBe(8000);

    // The boost spans the opponent's whole next turn...
    engine.endTurn("south");
    expect(leaderPower()).toBe(8000);
    // ...and expires when that turn's End Phase completes.
    engine.endTurn("north");
    expect(leaderPower()).toBe(5000);
  });

  test("does nothing under a Leader with a different name", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP13-001", hand: [op17Jozu008], activeDon: op17Jozu008.cost },
      {},
    );

    engine.playCard(op17Jozu008, "south");
    expect(engine.getView("south").players.south.leader?.power).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
