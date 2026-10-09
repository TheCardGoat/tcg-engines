import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-115 Black Vortex", () => {
  test("[Main] with a Blackbeard Leader returns a [Trigger] card from trash to hand", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-080", hand: ["OP16-115"], trash: ["OP15-019"], activeDon: 1 },
      {},
    );

    engine.playCard("OP16-115");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the return target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP15-019",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Black Vortex itself is excluded from the choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-080",
        hand: ["OP16-115"],
        trash: ["OP16-115", "OP09-097", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP16-115");

    // No eligible [Trigger] card other than Black Vortex: nothing happens.
    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-115");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("Life Trigger negates Newgate's active aura for the rest of the turn", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP16-115", "ST02-002", "ST02-003"] },
      { character: ["OP16-003"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const newgate = e.findCardInZone("north", "character", "OP16-003");
    expect(e.getView("south").players.north.leader.power).toBe(7000);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseTargets(newgate);
    expect(e.getView("south").players.north.leader.power).toBe(5000);
    e.endTurn("north");
    e.endTurn("south");
    expect(e.getView("south").players.north.leader.power).toBe(7000);
  });
});
