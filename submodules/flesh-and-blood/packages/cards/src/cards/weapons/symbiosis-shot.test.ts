import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { symbiosisShot } from "./symbiosis-shot.ts";

/**
 * Symbiosis Shot (AIO002) — Mechanologist Weapon - Gun (2H), 2{p},
 * Dash Specialization.
 *
 * Printed:
 *   Action - Remove a steam counter from this: Attack
 *   Whenever a Mechanologist item enters the arena under your control, if this
 *   has fewer than 6 steam counters, you may put a steam counter on this.
 */

describe("Symbiosis Shot (AIO002) AAA", () => {
  it("happy: a steam counter pays for a 2{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [{ card: symbiosisShot, state: { steamCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activateAttack(symbiosisShot);
    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Dash, symbiosisShot).toHaveCounters(0, "steam");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(18);
  });

  it("boundary: without a steam counter the activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [symbiosisShot],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );

    game.as(dash).expectActivationRejected(symbiosisShot);
    expectCombat(game).toBeClosed();
  });

  it("timing: a Mechanologist item entering the arena charges the gun", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [{ card: symbiosisShot, state: { steamCounters: 1 } }],
        hand: [hyperDriverRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(hyperDriverRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, symbiosisShot).toHaveCounters(2, "steam");
  });
});
