import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

function baseLeaderPower(): number {
  const engine = OnePieceTestEngine.create({}, {});
  return engine.getView("south").players.south.leader?.power ?? 0;
}

describe("OP16-003 Edward.Newgate", () => {
  test("gives your Leader +2000 power and [Double Attack] during your turn only", () => {
    const reference = baseLeaderPower();
    const engine = OnePieceTestEngine.create({ character: ["OP16-003"] }, {});

    const south = engine.getView("south").players.south;
    expect(south.leader?.power).toBe(reference + 2000);

    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader?.power).toBe(reference);

    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader?.power).toBe(reference + 2000);
  });

  test("the Leader deals two Life damage through Double Attack, while Newgate does not gain it", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP16-003", playedOnTurn: 0 }],
        life: ["EB01-005", "EB01-005", "EB01-005"],
      },
      { life: ["EB01-005", "EB01-005", "EB01-005", "EB01-005"] },
    );
    engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
    expect(engine.getView("north").players.north.lifeCount).toBe(2);
    expect(engine.getView("north").players.north.hand.map((card) => card.cardId)).toEqual([
      "EB01-005",
      "EB01-005",
    ]);
    engine.asSouth().attack("OP16-003", engine.leader("north"));
    engine.asNorth().chooseCounter();
    expect(engine.getView("north").players.north.lifeCount).toBe(1);
    expect(engine.getView("north").players.north.hand).toHaveLength(3);
    engine.asSouth().endTurn();
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] revealing two 8000-power Characters may give an opposing Character -6000 this turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-003", "OP16-004", "OP15-036", "OP13-013"], activeDon: 8 },
      { character: ["OP16-004"] },
    );
    const targetId = engine.findCardInZone("north", "character", "OP16-004");

    engine.playCard("OP16-003");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the -6000 power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(2000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the reveal leaves opposing power untouched", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-003", "OP16-004", "OP15-036", "OP13-013"], activeDon: 8 },
      { character: ["OP16-004"] },
    );
    const targetId = engine.findCardInZone("north", "character", "OP16-004");

    engine.playCard("OP16-003");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === targetId)
        ?.power,
    ).toBe(8000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
