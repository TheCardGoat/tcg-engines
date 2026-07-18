import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op10Bian053 } from "@tcg/op-cards";
import { op11Brook056 } from "../../../../../cards/src/cards/OP11/characters/056-brook.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-056 Brook", () => {
  test("may bottom-deck either player's base-cost-1 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11Brook056],
        character: [op10Bian053],
        activeDon: op11Brook056.cost,
      },
      { character: [eb01Doma005] },
    );
    const ownId = engine.findCardInZone("south", "character", op10Bian053);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op11Brook056, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Brook's deck-bottom target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(ownId);
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).not.toContain(ownId);
  });

  test("uses Blocker to redirect an attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Brook056] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const brookId = engine.findCardInZone("south", "character", op11Brook056);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Brook's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(brookId);
    engine.resolveDecision("battleBlocker", { selectedIds: [brookId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      brookId,
    );
  });
});
