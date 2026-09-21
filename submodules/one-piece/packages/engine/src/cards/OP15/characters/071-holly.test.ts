import { describe, expect, test } from "vite-plus/test";
import { op15Holly071 } from "../../../../../cards/src/cards/characters/op15-071-holly.ts";
import { op15Ohm061 } from "../../../../../cards/src/cards/characters/op15-061-ohm.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-071 Holly", () => {
  test("grants Double Attack to Ohm cards and sets 6000 base power on the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Holly071, op15Ohm061], activeDon: 6 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ohmId = engine.findCardInZone("south", "character", op15Ohm061);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.attachDon(ohmId, 4, "south");

    // Double Attack: the attacking Character deals 2 damage to the Leader.
    engine.declareAttack(ohmId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);

    engine.endTurn("south");

    const powers = engine
      .getView("south")
      .players.south.characters.flatMap((card) => (card ? [card.power] : []));
    expect(powers).toEqual([6000, 6000]);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-071", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-071",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
