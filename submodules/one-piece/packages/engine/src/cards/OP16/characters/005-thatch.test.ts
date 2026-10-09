import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-005 Thatch", () => {
  test("a Whitebeard Pirates Allies Character at 8000 power satisfies the hand discount", () => {
    const engine = OnePieceTestEngine.create({
      character: ["OP16-016"],
      hand: ["OP16-005"],
      activeDon: 5,
    });
    engine.playCard("OP16-005", "south");
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(engine.getView("south").players.south.characters.map((card) => card?.cardId)).toContain(
      "OP16-005",
    );
  });

  test("costs -3 in hand while an 8000+ power Whitebeard Pirates Character is on the field", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-003"], hand: ["OP16-005"], activeDon: 5 },
      {},
    );

    // Cost 8, reduced to 5: playable with exactly 5 DON!!.
    engine.playCard("OP16-005");

    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(0);
    expect(south.restedDon).toBe(5);
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-005");
    expect(south.characters.find((card) => card?.cardId === "OP16-005")?.cost).toBe(8);
  });

  test("without the Whitebeard Pirates condition the full cost is due", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-005"], activeDon: 4 }, {});

    expect(() => engine.playCard("OP16-005")).toThrow();
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
  });
  test("Blocker remains available after paying the reduced hand cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-003"], hand: ["OP16-005"], activeDon: 5 },
      {},
    );
    engine.playCard("OP16-005");
    const thatch = engine.findCardInZone("south", "character", "OP16-005");
    engine.endTurn("south");
    const life = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [thatch] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(life);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === thatch)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
