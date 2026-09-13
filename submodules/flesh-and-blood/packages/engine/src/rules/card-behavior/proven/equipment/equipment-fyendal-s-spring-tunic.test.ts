/**
 * Hand-authored AAA for WTR150 fyendal-s-spring-tunic — Generic Chest, d1,
 * bladeBreak, "At the start of your turn, if this has fewer than 3 energy
 * counters, you may put an energy counter on it." / "Instant - Remove 3
 * energy counters from this: Gain {r}".
 *
 * Blade-break lifecycle is covered in equipment-blade-break-wtr-arc; this
 * focused file proves the printed energy-counter ability through public
 * moves only: start-turn optional accumulation over real endTurn cycles,
 * the Instant remove-3 → +{r} activation, and the empty/insufficient
 * counter boundaries. (The sibling equipment-wtr-classics loop early-returns
 * below 3 counters, so this file is the authoritative accumulation proof.)
 */
import { describe, expect, it } from "vitest";
import type { FabPlayerHandle } from "../../../../index.ts";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { fyendalSSpringTunic } from "../../../../../../cards/src/cards/equipment/fyendal-s-spring-tunic.ts";

function energyCount(game: FabTestEngine, tunicId: string): number {
  return (
    game
      .getState()
      .objects[tunicId]?.counters.find((c) => c.kind === "named" && c.name === "energy")?.count ?? 0
  );
}

/** Accept or decline every pending boolean decision until the stack clears. */
function settleBooleans(game: FabTestEngine, accept: boolean): void {
  for (let s = 0; s < 20; s += 1) {
    const d = game.getState().decision;
    if (d?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (d) {
      if (game.answerForcedDecision()) continue;
      break;
    }
    if (game.getState().rulesStack.length > 0) {
      game.passBoth();
      continue;
    }
    break;
  }
}

/**
 * Drive one full turn cycle (Bravo ends, Dash ends) and return the tunic's
 * energy count once Bravo's next start phase has resolved.
 */
function runCycle(
  game: FabTestEngine,
  bravoHandle: FabPlayerHandle,
  dashHandle: FabPlayerHandle,
  accept: boolean,
): number {
  bravoHandle.endTurn();
  settleBooleans(game, accept);
  dashHandle.endTurn();
  settleBooleans(game, accept);
  return energyCount(game, bravoHandle.card(fyendalSSpringTunic));
}

describe("fyendal-s-spring-tunic energy ability (WTR150)", () => {
  it("core mechanic: start of turn, accepting the optional counter adds energy (1→2→3)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [fyendalSSpringTunic],
        hand: [],
        actionPoints: 1,
        deck: 10,
      },
      { hero: dash, deck: 10 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    expect(runCycle(game, Bravo, Dash, true)).toBe(1);
    expect(runCycle(game, Bravo, Dash, true)).toBe(2);
    expect(runCycle(game, Bravo, Dash, true)).toBe(3);
  });

  it("boundaries: declining the optional counter leaves energy unchanged", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [fyendalSSpringTunic],
        hand: [],
        actionPoints: 1,
        deck: 10,
      },
      { hero: dash, deck: 10 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    expect(runCycle(game, Bravo, Dash, false)).toBe(0);
    expect(runCycle(game, Bravo, Dash, false)).toBe(0);
  });

  it("boundaries: at 3 counters the <3 gate stops offering the optional", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [fyendalSSpringTunic],
        hand: [],
        actionPoints: 1,
        deck: 10,
      },
      { hero: dash, deck: 10 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    for (let cycle = 0; cycle < 3; cycle += 1) {
      runCycle(game, Bravo, Dash, true);
    }
    // A further cycle cannot push past 3 — the optional is only offered <3.
    expect(runCycle(game, Bravo, Dash, true)).toBe(3);
  });

  it("core interaction: Instant remove 3 energy → gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [fyendalSSpringTunic],
        hand: [],
        actionPoints: 1,
        deck: 10,
      },
      { hero: dash, deck: 10 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    // Accumulate 3 energy.
    for (let cycle = 0; cycle < 3; cycle += 1) {
      runCycle(game, Bravo, Dash, true);
    }
    const rpBefore = Bravo.resourcePoints();
    Bravo.activate(fyendalSSpringTunic);
    game.passBoth();
    expect(Bravo.resourcePoints()).toBe(rpBefore + 1);
    // Counters consumed.
    expect(energyCount(game, Bravo.card(fyendalSSpringTunic))).toBe(0);
  });

  it("boundaries: cannot remove 3 energy with fewer than 3 counters", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [fyendalSSpringTunic],
        hand: [],
        actionPoints: 1,
        deck: 10,
      },
      { hero: dash, deck: 10 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    // 2 energy only.
    for (let cycle = 0; cycle < 2; cycle += 1) {
      runCycle(game, Bravo, Dash, true);
    }
    expect(() => game.as(bravo).activate(fyendalSSpringTunic)).toThrow();
  });
});
