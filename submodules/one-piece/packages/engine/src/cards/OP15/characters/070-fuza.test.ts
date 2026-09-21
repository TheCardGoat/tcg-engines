import { describe, expect, test } from "vite-plus/test";
import { op15Shura067 } from "../../../../../cards/src/cards/characters/op15-067-shura.ts";
import { op15Yama073 } from "../../../../../cards/src/cards/characters/op15-073-yama.ts";
import { op15Fuza070 } from "../../../../../cards/src/cards/characters/op15-070-fuza.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-070 Fuza", () => {
  test("grants Unblockable to Shura cards and sets 6000 base power on the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Fuza070, op15Shura067], activeDon: 6 },
      { character: [op15Yama073] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shuraId = engine.findCardInZone("south", "character", op15Shura067);
    const yamaId = engine.findCardInZone("north", "character", op15Yama073);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.attachDon(shuraId, 4, "south");

    // The Shura Character attacks with 6000 power and cannot be blocked
    // even though the opponent controls a Blocker.
    engine.declareAttack(shuraId, engine.leader("north"), "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === yamaId)
        ?.rested,
    ).toBe(false);

    engine.endTurn("south");

    const powers = engine
      .getView("south")
      .players.south.characters.flatMap((card) => (card ? [card.power] : []));
    expect(powers).toEqual([6000, 6000]);
  });
});
