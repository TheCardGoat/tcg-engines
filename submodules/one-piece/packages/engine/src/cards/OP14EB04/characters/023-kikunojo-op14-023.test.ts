import { describe, expect, test } from "vite-plus/test";
import { op14eb04KikunojoOp14023023 } from "../../../../../cards/src/cards/OP14EB04/characters/023-kikunojo-op14-023.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-023 Kikunojo", () => {
  test("remains rested after attacking until its end-of-turn effect sets the same Character active", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04KikunojoOp14023023, playedOnTurn: 0 }],
      },
      { hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kikunojoId = engine.findCardInZone("south", "character", op14eb04KikunojoOp14023023);

    engine.declareAttack(kikunojoId, engine.leader("north"), "south");
    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kikunojoId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kikunojoId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
