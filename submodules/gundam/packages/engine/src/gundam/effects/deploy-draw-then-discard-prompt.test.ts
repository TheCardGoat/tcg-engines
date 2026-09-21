/**
 * Pins the deploy `drawThenDiscard` contract (ST04-002 Strike Gundam).
 *
 * 1. Deploying into a live game halts with a discard `pendingChoice` and
 *    exposes `resolveEffect` to the controller — the contract the live
 *    interaction publisher must surface.
 * 2. Drawing a deck's last card inside the effect triggers deck-out
 *    (rule 1-2-2-2 / 11-2-1-2) which precedes the discard: the game ends
 *    and no discard choice is surfaced.
 *
 * Live gap (2026-09-17): in a server match the deployed Strike Gundam's
 * discard left the runtime waiting while the client received neither the
 * prompt nor a `resolveEffect` affordance (match deadlocked). The engine
 * contract below is correct; the divergence is in the live publish path.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "../../index.ts";

const strikeGundamDeployEffect: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [
    {
      action: { action: "drawThenDiscard", drawCount: 1, discardCount: 1 },
    },
  ],
  sourceText: "【Deploy】Draw 1. Then, discard 1.",
};

function drawThenDiscardUnit() {
  return createMockUnit({
    name: "Strike Gundam",
    cost: 2,
    level: 4,
    effects: [strikeGundamDeployEffect],
  });
}

describe("Deploy draw-then-discard contract", () => {
  it("halts with a discard targetSelection and exposes resolveEffect", () => {
    const source = drawThenDiscardUnit();
    const mk = (name: string) => createMockUnit({ name, cost: 0, effects: [] });
    const engine = GundamTestEngine.create(
      {
        hand: [source],
        resourceArea: activeResources(4),
        deck: [mk("Drawn A"), mk("Drawn B"), mk("Drawn C")],
      },
      { play: [mk("Enemy")] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(sourceId));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") return;
    expect(choice.controllerId).toBe(PLAYER_ONE);
    expect(choice.minTargets).toBe(1);
    expect(choice.maxTargets).toBe(1);

    // Legal targets come from PLAYER_ONE's own hand (the drawn card).
    const handIds = p1.getHand();
    expect(handIds).toHaveLength(1);
    expect(choice.legalTargetIds).toEqual(handIds);

    // The controller's available moves expose the pending-effect answer.
    expect(engine.getRuntime().getAvailableMoves(PLAYER_ONE as never)).toContain("resolveEffect");

    // Answering the discard completes the effect and clears the prompt.
    expectSuccess(p1.resolveEffect({ targets: [handIds[0]!] }));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getHand()).toHaveLength(0);
  });

  it("deck-out on the effect's draw ends the game before the discard", () => {
    const source = drawThenDiscardUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [source],
        resourceArea: activeResources(4),
        deck: [createMockUnit({ name: "Last Card" })],
      },
      { play: [createMockUnit({ ap: 1, hp: 1 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(sourceId));

    // Rule 1-2-2-2: drawing the deck's last card leaves PLAYER_ONE with an
    // empty deck — the deck-out loss precedes the discard choice.
    expect(engine.getG().pendingEffects).toHaveLength(0);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getBoardView().winner).toBe(PLAYER_TWO);
  });
});
