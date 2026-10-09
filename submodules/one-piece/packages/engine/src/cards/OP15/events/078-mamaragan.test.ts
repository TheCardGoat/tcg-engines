import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-078 Mamaragan", () => {
  test("[Main] DON!! 2 draws and rests a Character of 5000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-078"], activeDon: 6 },
      { character: ["OP13-013", "OP16-003"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-078");
    engine.asSouth().acceptOptional();
    // The DON!! 2 cost auto-pays from the active DON!!
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([higumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declines the Main DON return and resolves no effect action", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP15-058", hand: ["OP15-078"], character: ["ST02-006"], activeDon: 6 },
      { character: ["ST02-006"] },
    );
    const before = e.getView("south");
    const event = e.findCardInZone("south", "hand", "OP15-078");
    e.playCard("OP15-078");
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
        hand: ["OP15-078"],
        deck: ["ST02-002", "ST02-003"],
        activeDon: 5,
      },
      {},
    );
    e.playCard("OP15-078");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Counter grants its printed battle power and then expires", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP15-078", "ST02-002"], activeDon: 5, trash: 14, deck: ["ST02-003", "ST02-003"] },
      { activeDon: 2 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attachDon(e.leader("north"), 2);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter("OP15-078");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("ST02-003");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
