import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-077 Lightning Dragon", () => {
  test("[Main] DON!! 1 draws and freezes a rested Character of 6000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-077"], activeDon: 5 },
      {
        character: [
          { cardId: "OP13-013", rested: true },
          { cardId: "OP15-088", rested: true },
          "OP16-003",
        ],
        activeDon: 5,
      },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-077");
    engine.asSouth().acceptOptional();
    // The DON!! cost auto-pays from the active DON!!
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the freeze target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([higumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(1);

    engine.endTurn("south");
    engine.endTurn("north");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declines the Main DON return and resolves no effect action", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP15-058", hand: ["OP15-077"], character: ["ST02-006"], activeDon: 6 },
      { character: ["ST02-006"] },
    );
    const before = e.getView("south");
    const event = e.findCardInZone("south", "hand", "OP15-077");
    e.playCard("OP15-077");
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
        hand: ["OP15-077"],
        deck: ["ST02-002", "ST02-003"],
        activeDon: 5,
      },
      {},
    );
    e.playCard("OP15-077");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
