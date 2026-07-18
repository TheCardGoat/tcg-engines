import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07Sterry006,
  op09Heat007,
  op09Shanks001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-007 Heat", () => {
  test("on play optionally gives a reduced Leader +1000 through turn end", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Sterry006, op09Heat007],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: op07Sterry006.cost + op09Heat007.cost,
    });

    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    engine.playCard(op07Sterry006, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [drawnId] }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(0);
    engine.playCard(op09Heat007, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Heat's Leader choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(engine.getView("south").players.south.leader.power).toBe(1000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });

  test("a 5000-power Leader is not an eligible On Play target", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Shanks001,
      hand: [op09Heat007],
      activeDon: op09Heat007.cost,
    });

    engine.playCard(op09Heat007, "south");

    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("is offered through the defending player's Blocker decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09Heat007] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const heatId = engine.findCardInZone("south", "character", op09Heat007);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Heat's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(heatId);
    engine.resolveDecision("battleBlocker", { selectedIds: [heatId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      heatId,
    );
  });
});
