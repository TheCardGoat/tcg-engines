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
import { throttleBlue } from "../actions/throttle.ts";
import { revUpBlue } from "../actions/rev-up.ts";
import { gasGuzzlerBlue } from "../actions/gas-guzzler.ts";
import { hanabiBlaster } from "./hanabi-blaster.ts";

/**
 * Hanabi Blaster (DYN088) — Mechanologist Weapon - Gun (2H), 5{p}, Overpower.
 *
 * Printed:
 *   Once per Turn Action - Remove 2 steam counters from this: Attack
 *   Overpower
 *   The third time you play a card with boost each turn, put a steam counter on this.
 */

describe("Hanabi Blaster (DYN088) AAA", () => {
  it("happy: two steam counters pay for a 5{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [{ card: hanabiBlaster, state: { steamCounters: 2 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activateAttack(hanabiBlaster);
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Dash, hanabiBlaster).toHaveCounters(0, "steam");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(15);
  });

  it("boundary: with fewer than 2 steam counters the activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [{ card: hanabiBlaster, state: { steamCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );

    game.as(dash).expectActivationRejected(hanabiBlaster);
    expectCombat(game).toBeClosed();
  });

  it("timing: the third boost played this turn puts a steam counter on the blaster", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [hanabiBlaster],
        hand: [throttleBlue, revUpBlue, gasGuzzlerBlue],
        resourcePoints: 9,
        actionPoints: 3,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, hanabiBlaster).toHaveCounters(0, "steam");
    for (const boost of [throttleBlue, revUpBlue, gasGuzzlerBlue]) {
      Dash.playAttack(boost, { optionals: "decline" });
      game.helpers.resolveRestOfCombat();
    }

    expectFabCard(Dash, hanabiBlaster).toHaveCounters(1, "steam");
  });
});
