import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { olympia } from "../heroes/olympia.ts";
import { hotStreak } from "../weapons/hot-streak.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { prizedGalea } from "./prized-galea.ts";

/**
 * Prized Galea (AOL003) — Warrior Head d2 (Olympia Specialization), Temper.
 * Printed: "Attack Reaction - {r}, destroy this: Target weapon attack you
 * control wagers a Gold token with the defending hero."
 */

describe("Prized Galea (AOL003) AAA", () => {
  it("happy: the weapon attack wagers Gold and a hit wins it", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        head: [prizedGalea],
        weapon1: [hotStreak],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.activateAttack(hotStreak);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.toReaction("attacker");
    Olympia.activate(prizedGalea);

    game.closeCombat({ optionals: "decline" });

    // The staked Gold is won back on the hit; Olympia's hero also rewards the
    // first wager win with a second Gold.
    expectFabPlayer(Olympia).toHaveTokenCount("gold", 2);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("gold", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(18); // 20 - 2
    expectFabCard(Olympia, prizedGalea).toBeIn("graveyard");
  });

  it("boundary: if the wagered attack misses, the defending hero takes the Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        head: [prizedGalea],
        weapon1: [hotStreak],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);
    const Dash = game.as(dash);

    Olympia.activateAttack(hotStreak);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue, nimblismBlue); // 4{d} over a 2{p} attack
    game.toReaction("attacker");
    Olympia.activate(prizedGalea);

    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(20).toHaveTokenCount("gold", 1);
    expectFabPlayer(Olympia).toHaveTokenCount("gold", 0);
  });
});
