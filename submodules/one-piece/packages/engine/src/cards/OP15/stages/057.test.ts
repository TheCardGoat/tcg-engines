import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-057 Dressrosa Kingdom", () => {
  test("[On Play] with a Dressrosa Leader resolves and places the Stage", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-031", hand: ["OP15-057", "EB01-005"], activeDon: 5 },
      {},
    );

    engine.playCard("OP15-057");
    expect(engine.getView("south").players.south.stage).toBeTruthy();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] without a {Dressrosa} Leader draws nothing", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP15-057", "EB01-005"], activeDon: 5 }, {});

    engine.playCard("OP15-057");

    expect(engine.getView("south").players.south.stage?.cardId).toBe("OP15-057");
    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
