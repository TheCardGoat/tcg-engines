import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-074 Magellan", () => {
  test("[On Play] for an Impel Down Leader returns an opposing DON!! to the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP02-071", hand: ["OP16-074"], activeDon: 8 },
      { activeDon: 5 },
    );

    engine.playCard("OP16-074");

    const north = engine.getView("south").players.north;
    expect(north.activeDon).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On K.O.] returns 4 opposing DON!! to the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-074", rested: true }] },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const magellanId = engine.findCardInZone("south", "character", "OP16-074");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-074");

    const north = engine.getView("south").players.north;
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      magellanId,
    );
    expect(north.activeDon).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without an Impel Down Leader the On Play does not return DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-074"], activeDon: 8 },
      { activeDon: 5 },
    );

    engine.playCard("OP16-074");

    expect(engine.getView("south").players.north.activeDon).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
