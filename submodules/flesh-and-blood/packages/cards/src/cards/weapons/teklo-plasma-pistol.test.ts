import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { tekloPlasmaPistol } from "./teklo-plasma-pistol.ts";

/**
 * Teklo Plasma Pistol (ARC003) — Mechanologist Weapon Pistol 2H, power 2.
 *
 * Printed:
 *   Action - Remove a steam counter from Teklo Plasma Pistol: Attack
 *   Action - {r}: If there are no steam counters on it, put a steam counter on it. Go again
 */

describe("Teklo Plasma Pistol (ARC003) AAA", () => {
  it("happy: paying a steam counter opens combat at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [{ card: tekloPlasmaPistol, state: { steamCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activateAttack(tekloPlasmaPistol);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Dash, tekloPlasmaPistol).toHaveCounters(0, "steam");
  });

  it("boundary: without a steam counter the Attack activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloPlasmaPistol],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game
      .as(dash)
      .expectActivationRejected(
        tekloPlasmaPistol,
        "fNFqtdWLq6tCPnnwjLLWL:actionRemoveSteamCounterTekloPlasmaPistolAttack",
      );
    expectCombat(game).toBeClosed();
  });

  it("timing: loading a steam counter then attacking spends that counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloPlasmaPistol],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(tekloPlasmaPistol);
    expectFabCard(Dash, tekloPlasmaPistol).toHaveCounters(1, "steam");

    Dash.activateAttack(tekloPlasmaPistol);
    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Dash, tekloPlasmaPistol).toHaveCounters(0, "steam");
  });
});
