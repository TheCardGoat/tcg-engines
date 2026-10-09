import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-075 El Thor", () => {
  test("a non-Enel Leader pays return DON!! but gets neither the boost nor K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", hand: ["OP15-075"], activeDon: 1 },
      { character: ["OP13-013"] },
    );
    engine.playCard("OP15-075");
    engine.asSouth().acceptOptional();
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(engine.getView("south").players.south.leader?.power).toBe(5000);
    expect(engine.getView("south").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] DON!! 1 with an [Enel] Leader boosts a card and may K.O. 3000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP15-058",
        hand: ["OP15-075"],
        character: ["OP16-005"],
        activeDon: 5,
      },
      { character: ["OP13-013"] },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-075");
    engine.asSouth().acceptOptional();
    // The DON!! cost auto-pays from the active DON!!
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      higumaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] resolves as a battle counter", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-075"], activeDon: 5 },
      { activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP15-075");
    const boost = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (boost?.extensions?.resolutionIntent === "effectTargetSelection") {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP15-075");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declines the Main DON return and resolves no effect action", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP15-058", hand: ["OP15-075"], character: ["ST02-006"], activeDon: 6 },
      { character: ["ST02-006"] },
    );
    const before = e.getView("south");
    const event = e.findCardInZone("south", "hand", "OP15-075");
    e.playCard("OP15-075");
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
  test("Counter boosts an Enel Leader for this battle only", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP15-058", hand: ["OP15-075", "ST02-002"], activeDon: 5 },
      { activeDon: 1 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const lifeBefore = e.getView("south").players.south.lifeCount;
    e.asNorth().attachDon(e.leader("north"), 1);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter("OP15-075");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
