import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-076 Lightning Beast Kiten", () => {
  test("wrong Leader still pays DON!! -1 but resolves neither Main action", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-076"], character: ["EB01-005"], activeDon: 5 },
      { character: ["EB01-005"] },
    );
    const before = engine.getView("south").players.south;
    engine.playCard("OP15-076");
    engine.asSouth().acceptOptional();
    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(before.donDeckCount + 1);
    expect(view.players.south.deckCount).toBe(before.deckCount);
    expect(view.players.south.handCount).toBe(0);
    expect(view.players.north.characters[0]?.power).toBe(3000);
    expect(view.prompts).toHaveLength(0);
  });

  test("[Main] DON!! 1 with an [Enel] Leader draws and gives -1000 power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP15-058", hand: ["OP15-076", "EB01-005"], activeDon: 5 },
      { character: ["OP13-013"] },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-076");
    engine.asSouth().acceptOptional();
    // The DON!! cost auto-pays from the active DON!!
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(2);
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.power,
    ).toBe(2000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] resolves as a battle counter", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-076"], activeDon: 5 },
      { activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP15-076");
    const boost = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (boost?.extensions?.resolutionIntent === "effectTargetSelection") {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP15-076");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declines the Main DON return and resolves no effect action", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP15-058", hand: ["OP15-076"], character: ["ST02-006"], activeDon: 6 },
      { character: ["ST02-006"] },
    );
    const before = e.getView("south");
    const event = e.findCardInZone("south", "hand", "OP15-076");
    e.playCard("OP15-076");
    e.asSouth().declineOptional();
    const after = e.getView("south");
    expect(after.players.south.activeDon).toBe(6);
    expect(after.players.south.donDeckCount).toBe(before.players.south.donDeckCount);
    expect(after.players.south.handCount).toBe(0);
    expect(after.players.south.deckCount).toBe(before.players.south.deckCount);
    expect(after.players.south.characters).toEqual(before.players.south.characters);
    expect(after.players.north.characters).toEqual(before.players.north.characters);
    expect(after.players.south.trash.map((c) => c.instanceId)).toContain(event);
    expect(after.prompts).toHaveLength(0);
  });
  test("FAQ: Enel draws even when the later Character action has no target", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP15-058",
        hand: ["OP15-076"],
        deck: ["ST02-002", "ST02-003"],
        activeDon: 5,
      },
      {},
    );
    e.playCard("OP15-076");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Counter boosts an Enel Leader for this battle only", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP15-058", hand: ["OP15-076", "ST02-002"], activeDon: 5 },
      { activeDon: 1 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const lifeBefore = e.getView("south").players.south.lifeCount;
    e.asNorth().attachDon(e.leader("north"), 1);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter("OP15-076");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
