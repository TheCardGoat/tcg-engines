import { describe, expect, test } from "vite-plus/test";
import { op14eb04KouzukiOden026 } from "../../../../../cards/src/cards/OP14EB04/characters/026-kouzuki-oden.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-026 Kouzuki Oden", () => {
  test("gains 2000 power only while rested during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op14eb04KouzukiOden026, rested: true, playedOnTurn: 0 },
          { card: op14eb04KouzukiOden026, playedOnTurn: 0 },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const odenCards = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === op14eb04KouzukiOden026.id);
    const restedId = odenCards.find((card) => card?.rested)?.instanceId;
    const activeId = odenCards.find((card) => !card?.rested)?.instanceId;

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === restedId)?.power).toBe(
      5000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === activeId)?.power).toBe(
      5000,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === restedId)?.power).toBe(
      7000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === activeId)?.power).toBe(
      5000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
