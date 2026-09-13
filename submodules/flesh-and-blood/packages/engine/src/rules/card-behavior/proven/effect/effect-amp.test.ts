/**
 * AAA test for effect: amp.
 * Representative card: Will of Arcana Blue (ROS000) — Wizard Resource, Gem.
 * Triggered ability: "When this is pitched, amp 1." → { type: "amp", amount: 1 }.
 * Amp is tracked via gain-assets events with data.amp > 0.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import {
  bravo,
  dash,
  heartOfFyendal,
  nimbleStrikeRed,
  willOfArcanaBlue,
} from "../../../fixtures.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

/** Sum all amp values from gain-assets events for the given player. */
function totalAmp(game: FabTestEngine, playerId: string): number {
  return game
    .committedEvents()
    .filter((event) => event.name === "gain-assets" && event.data.playerId === playerId)
    .reduce((total, event) => total + (event.name === "gain-assets" ? event.data.amp : 0), 0);
}

/** Resolve triggered layers created by a pitch trigger, then pass. */
function resolvePendingTriggers(game: FabTestEngine): void {
  const triggerGuard = createFabLoopGuard({ label: "effect-amp: resolve pending triggers" });
  while (true) {
    triggerGuard.tick();
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((e) => e.id) },
        },
      });
      continue;
    }
    if (decision || game.getState().rulesStack.at(-1)?.kind !== "triggered") return;
    game.passBoth();
  }
}

describe("effect: amp", () => {
  it("AAA: Will of Arcana Blue grants amp 1 when pitched", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [willOfArcanaBlue, nimbleStrikeRed], deck: 4, resourcePoints: 0 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    game.as(bravo).play(nimbleStrikeRed, { target: game.as(dash).id, pitch: [willOfArcanaBlue] });
    resolvePendingTriggers(game);

    expect(totalAmp(game, Bravo.id)).toBe(1);
  });

  it("AAA boundary: a non-amp resource pitched produces no amp", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [heartOfFyendal, nimbleStrikeRed], deck: 4, resourcePoints: 0 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    game.as(bravo).play(nimbleStrikeRed, { target: game.as(dash).id, pitch: [heartOfFyendal] });

    expect(totalAmp(game, Bravo.id)).toBe(0);
  });
});
