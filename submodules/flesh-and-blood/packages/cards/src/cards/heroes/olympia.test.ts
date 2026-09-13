import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FabTestEngine,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { olympia } from "./olympia.ts";
import { hotStreak } from "../weapons/hot-streak.ts";
import { wageVigorBlue } from "../actions/wage-vigor.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Olympia (HVY093) — Warrior Hero — Young.
 *
 * Printed: "The first time each of your attacks wins a wager, create a Gold
 * token."
 *
 * Signature weapon: Hot Streak (HVY095).
 *
 * Pattern mirrors olympia-prized-fighter.test.ts (adult HVY092).
 */

const opponentHero = dash;

describe("olympia (HVY093) AAA", () => {
  it("happy: the first wager your attack wins creates a Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        hand: [wageVigorBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.playAttack(wageVigorBlue, { stopAt: "on-attack" });
    Olympia.accept(); // the wager — an unblocked 4{p} attack wins it
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Olympia).toHaveTokenCount("gold", 1);
    expectFabPlayer(Olympia).toHaveTokenCount("vigor", 1);
  });

  it("boundary: declining the wager creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        hand: [wageVigorBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.playAttack(wageVigorBlue, { stopAt: "on-attack" });
    Olympia.decline();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Olympia).toHaveTokenCount("gold", 0);
    expectFabPlayer(Olympia).toHaveTokenCount("vigor", 0);
  });

  it("timing: an attack that never wagers creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Olympia).toHaveTokenCount("gold", 0);
  });

  it("signature weapon: Hot Streak (HVY095) attacks for {r} at power 2 and hits", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        weapon1: [hotStreak],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Olympia = game.as(olympia);

    Olympia.activate(hotStreak);
    game.passBoth();

    expectFabPlayer(Olympia).toHaveResourceCount(0);
    expectCombat(game).toBeOpen().toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(opponentHero)).toHaveLife(18); // 20 − 2
  });
});
