import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-117 Black Hole", () => {
  test("[Main] trashing a [Trigger] card negates an opposing Character's effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-117", "OP15-019"], activeDon: 2 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const newgateId = engine.findCardInZone("north", "character", "OP16-003");

    engine.playCard("OP16-117");
    engine.acceptLeadingOptional("south");
    // The lone [Trigger] card auto-pays the trash cost.
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the negate target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [newgateId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).not.toContain("OP15-019");
    expect(south.trash.map((card) => card.cardId)).toContain("OP15-019");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining a payable Trigger discard preserves the Blocker", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP16-117", "OP15-019"], activeDon: 2 },
      { character: ["ST01-006"] },
    );
    e.playCard("OP16-117");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["OP15-019"]);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.pendingDecision("battleBlocker", "north");
  });
  test("negating a Blocker permits damage, then expires after the turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP16-117", "OP15-019"], activeDon: 2 },
      { character: ["ST01-006"] },
    );
    const blocker = e.findCardInZone("north", "character", "ST01-006");
    const life = e.getView("south").players.north.lifeCount;
    e.playCard("OP16-117");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(blocker);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").players.north.lifeCount).toBe(life - 1);
    e.endTurn("south");
    e.endTurn("north");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.pendingDecision("battleBlocker", "north");
  });
  test("Life Trigger recovers a Blackbeard Event and cannot recover the resolving Trigger", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP16-117", "ST02-002"], trash: ["OP16-115", "ST02-002"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    const event = e.findCardInZone("south", "trash", "OP16-115");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    const choice = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice.kind !== "selectEntity") throw new Error("Expected recovery choice");
    expect(choice.candidates.map((c) => c.ref.id)).toEqual([event]);
    e.asSouth().chooseTargets(event);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([event]);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-117");
  });
});
