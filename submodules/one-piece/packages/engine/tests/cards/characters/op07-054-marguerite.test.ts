import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07Marguerite054 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-054 Marguerite", () => {
  test("draws one card on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Marguerite054],
      deck: [eb01Doma005, eb01MountainGod018],
      activeDon: op07Marguerite054.cost,
    });
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op07Marguerite054, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);
  });

  test("uses Blocker through the defending player's battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Marguerite054] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op07Marguerite054);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Marguerite's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.prompts).toHaveLength(0);
  });
});
