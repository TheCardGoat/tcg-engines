import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07PortgasDAce053,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-053 Portgas.D.Ace", () => {
  test("draws two, then orders two hand cards for a chosen top or bottom deck position", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07PortgasDAce053, eb01MountainGod018],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op07PortgasDAce053.cost,
    });
    const firstDrawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op07PortgasDAce053, "south");

    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    if (selection?.kind !== "selectEntity") throw new Error("Expected Ace's hand-card choice.");
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstDrawnId, secondDrawnId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstDrawnId, secondDrawnId] },
      "south",
    );

    const order = engine.pendingDecision("effectReturnToDeckOrder", "south").steps[0];
    expect(order).toMatchObject({ kind: "orderItems", min: 2, max: 2 });
    engine.resolveDecision(
      "effectReturnToDeckOrder",
      { selectedIds: [secondDrawnId, firstDrawnId] },
      "south",
    );

    const position = engine.pendingDecision("effectDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") throw new Error("Expected Ace's deck-position choice.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([secondDrawnId, firstDrawnId]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("uses Blocker through the defending player's battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07PortgasDAce053] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op07PortgasDAce053);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Ace's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.prompts).toHaveLength(0);
  });
});
