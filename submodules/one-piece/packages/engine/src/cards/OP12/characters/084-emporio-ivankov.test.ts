import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op12Koala081 } from "@tcg/op-cards";
import { op12EmporioIvankov084 } from "../../../../../cards/src/cards/OP12/characters/084-emporio-ivankov.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-084 Emporio.Ivankov", () => {
  test("with an included Revolutionary Army Leader trashes the top three deck cards on play", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Koala081,
      hand: [op12EmporioIvankov084],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01MountainGod018],
      activeDon: op12EmporioIvankov084.cost,
    });
    const topThreeIds = engine.getView("south").players.south.deckCount;

    engine.playCard(op12EmporioIvankov084, "south");

    const view = engine.getView("south");
    expect(topThreeIds).toBe(4);
    expect(view.players.south).toMatchObject({ deckCount: 1 });
    expect(view.players.south.trash).toHaveLength(3);
    expect(view.prompts).toHaveLength(0);
  });

  test("uses Blocker through the defending player's battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12EmporioIvankov084] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ivankovId = engine.findCardInZone("south", "character", op12EmporioIvankov084);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Ivankov's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(ivankovId);
    engine.resolveDecision("battleBlocker", { selectedIds: [ivankovId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      ivankovId,
    );
  });
});
