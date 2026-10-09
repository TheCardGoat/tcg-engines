import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-074 Varie", () => {
  test("wrong Leader still pays DON!! -1 but resolves neither Main action", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-074"], character: ["EB01-005"], activeDon: 5 },
      { character: ["EB01-005"] },
    );
    const before = engine.getView("south").players.south;
    engine.playCard("OP15-074");
    engine.asSouth().acceptOptional();
    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(before.donDeckCount + 1);
    expect(view.players.south.deckCount).toBe(before.deckCount);
    expect(view.players.south.handCount).toBe(0);
    expect(view.players.south.characters[0]?.cost).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("[Main] DON!! 1 with an [Enel] Leader draws and gives a Character +2 cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP15-058",
        hand: ["OP15-074", "EB01-005"],
        character: ["OP15-060"],
        activeDon: 5,
      },
      {},
    );
    const enelId = engine.findCardInZone("south", "character", "OP15-060");

    engine.playCard("OP15-074");
    engine.asSouth().acceptOptional();
    // The DON!! cost auto-pays; choose Enel for the +2 cost.
    const costTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (costTarget?.kind !== "selectEntity") throw new Error("Expected the +2 cost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [enelId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(2);
    expect(south.characters.find((card) => card?.instanceId === enelId)?.cost).toBe(8);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] an [Enel] card gains +2000 power during the battle", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP15-058", hand: ["OP15-074"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP15-074");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the [Enel] target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );

    // 5000 + 2000 >= 6000: saved (without the boost it would not be).
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("declines the Main DON return and resolves no effect action", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP15-058", hand: ["OP15-074"], character: ["ST02-006"], activeDon: 6 },
      { character: ["ST02-006"] },
    );
    const before = e.getView("south");
    const event = e.findCardInZone("south", "hand", "OP15-074");
    e.playCard("OP15-074");
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
        hand: ["OP15-074"],
        deck: ["ST02-002", "ST02-003"],
        activeDon: 5,
      },
      {},
    );
    e.playCard("OP15-074");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
