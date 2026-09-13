import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op06HodyJones020, op06Hyouzou034 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-020 Hody Jones", () => {
  test("rests itself, maps the opposing DON-or-Character choice, and blocks own Life removal", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        character: [{ card: op06Hyouzou034, playedOnTurn: 0 }],
        life: [eb01Doma005],
      },
      { character: [eb01Doma005, eb01MountainGod018], activeDon: 1 },
    );
    const hodyTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const hyouzouId = engine.findCardInZone("south", "character", op06Hyouzou034);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const restChoice = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    expect(restChoice?.kind).toBe("payCost");
    if (restChoice?.kind !== "payCost") {
      throw new Error("Expected Hody Jones to offer one Character-or-DON!! choice.");
    }
    expect(restChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([
      hodyTargetId,
      "active-don:north:0",
    ]);
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [hodyTargetId] }, "south");

    expect(engine.getView("south").players.south.leader.rested).toBe(true);
    expect(engine.getView("south").players.north.characters[0]?.rested).toBe(true);

    engine.activateEffect(hyouzouId, "activateMain", "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        character: [{ card: op06Hyouzou034, playedOnTurn: 0 }],
        life: [eb01Doma005],
      },
      { character: [eb01Doma005, eb01MountainGod018], activeDon: 1 },
    );
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
