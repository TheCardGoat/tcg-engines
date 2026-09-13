import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { evergreenRed } from "./evergreen.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { logFallRed } from "./log-fall.ts";
import { logFallYellow } from "./log-fall.ts";

/**
 * Log Fall, Red (TER011) — overpower if an Earth card was pitched to play this.
 */

describe("Log Fall (TER011) AAA", () => {
  it("happy: pitching an Earth card grants overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [logFallRed, evergreenRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(evergreenRed, nimblismBlue, nimblismBlue).playAttack(logFallRed);
    game.passBoth();
    expectCombat(game).toHaveKeyword("overpower");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: pitching only Generic cards does not grant overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [logFallRed, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(nimblismBlue, nimblismBlue, nimblismBlue).playAttack(logFallRed);
    expectCombat(game).notToHaveKeyword("overpower");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [logFallRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([logFallRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});

/**
 * Log Fall, Yellow (TER015) — overpower if an Earth card was pitched to play this.
 */

describe("Log Fall (TER015) AAA", () => {
  it("happy: pitching an Earth card grants overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [logFallYellow, evergreenRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(evergreenRed, nimblismBlue, nimblismBlue).playAttack(logFallYellow);
    game.passBoth();
    expectCombat(game).toHaveKeyword("overpower");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: pitching only Generic cards does not grant overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [logFallYellow, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(nimblismBlue, nimblismBlue, nimblismBlue).playAttack(logFallYellow);
    expectCombat(game).notToHaveKeyword("overpower");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [logFallYellow],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([logFallYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
