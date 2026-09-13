import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { poisonTheTipsYellow } from "./poison-the-tips.ts";

/**
 * Poison the Tips, Yellow (CRU124) — Ranger Action, cost 0, defense 2.
 * Printed: "Until end of turn, arrows you control gain 'If this hits a
 * hero, they discard a card.'" + Reload + Go again.
 *
 * The module encodes all three clauses (reload + goAgain keywords, and the
 * a2 grant of a discard-on-hit trigger to every Arrow the controller owns
 * in permanent/combat-chain zones until end of turn), so the full behavior
 * is provable without pins.
 */

describe("Poison the Tips (CRU124) AAA", () => {
  it("happy: an arrow that hits after Poison the Tips forces the defender to discard", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [poisonTheTipsYellow],
        arsenal: [searingShotRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    // Decline the optional reload (CR 8.5.23); the arrow is already seated.
    Azalea.play(poisonTheTipsYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    // The granted discard-on-hit trigger pends an ordering decision for the
    // defender; "listed" preserves the engine-presented order.
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Searing Shot 4{p} hits plus its own printed “loses 1{h}” rider, and
    // the granted trigger makes Dash discard her only card — hand emptied
    // to the graveyard.
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Dash).toHaveHandCount(0);
    expect(Dash.zone("graveyard")).toContain(snatchRed.canonicalId);
  });

  it("boundary: a non-arrow attack that hits makes the defender discard nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [poisonTheTipsYellow, snatchRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(poisonTheTipsYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Snatch is a plain attack action, not an Arrow: the a2 grant excludes
    // it, so the hit must NOT trigger a discard.
    Azalea.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16); // 4{p} Snatch hits
    expectFabPlayer(Dash).toHaveHandCount(1); // Nimblism kept
  });

  it("timing: reload seeds an empty arsenal and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [poisonTheTipsYellow, searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    expect(Azalea.actionPoints()).toBe(1);
    Azalea.play(poisonTheTipsYellow);
    // Accept the optional reload (CR 8.5.23): arsenal is empty, so Searing
    // Shot goes face-down into the arsenal.
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // −1 AP to play the Action, +1 AP from go again = still 1.
    expect(Azalea.actionPoints()).toBe(1);
    expectFabPlayer(Azalea).toHaveHandCount(0);
    expect(Azalea.zone("arsenal")).toContain(searingShotRed.canonicalId);
  });
});
