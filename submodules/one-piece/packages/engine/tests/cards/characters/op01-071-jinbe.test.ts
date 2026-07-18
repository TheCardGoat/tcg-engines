import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Jinbe071 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-071 Jinbe", () => {
  test("on play may bottom-deck either player's cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01Jinbe071],
        activeDon: op01Jinbe071.cost,
        character: [eb01Doma005],
      },
      {
        character: [eb01Fourtricks025, eb01MountainGod018],
      },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op01Jinbe071, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Jinbe's Character choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(ownId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger plays that physical Jinbe card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op01Jinbe071], hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op01Jinbe071);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === triggerId),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
