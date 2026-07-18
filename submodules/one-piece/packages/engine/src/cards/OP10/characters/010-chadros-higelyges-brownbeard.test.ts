import { describe, expect, test } from "vite-plus/test";
import {
  op10CaesarClown006,
  op10ChadrosHigelygesBrownbeard010,
  op10Smiley009,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

function brownbeardPowerWith(highPowerCharacters: (typeof op10Smiley009)[]) {
  const engine = OnePieceTestEngine.create(
    {
      character: [
        { card: op10ChadrosHigelygesBrownbeard010, playedOnTurn: 0 },
        ...highPowerCharacters,
      ],
    },
    {},
    { firstPlayer: "north", activeSeat: "south" },
  );
  const brownbeardId = engine.findCardInZone(
    "south",
    "character",
    op10ChadrosHigelygesBrownbeard010,
  );
  engine.declareAttack(brownbeardId, engine.leader("north"), "south");
  return (
    engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === brownbeardId)?.power ?? 0
  );
}

describe("OP10-010 Chadros.Higelyges (Brownbeard)", () => {
  test("gains +1000 when exactly one other Character has at least 6000 power", () => {
    expect(brownbeardPowerWith([op10Smiley009])).toBe(
      (op10ChadrosHigelygesBrownbeard010.power ?? 0) + 1000,
    );
  });

  test("does not gain power when two Characters already have at least 6000 power", () => {
    expect(brownbeardPowerWith([op10Smiley009, op10CaesarClown006])).toBe(
      op10ChadrosHigelygesBrownbeard010.power,
    );
  });
});
