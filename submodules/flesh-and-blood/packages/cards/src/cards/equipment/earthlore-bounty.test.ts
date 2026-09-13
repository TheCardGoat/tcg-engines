import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";
import { browbeatBlue } from "../actions/browbeat.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { earthloreBounty } from "./earthlore-bounty.ts";

/**
 * Earthlore Bounty — Guardian Equipment - Chest, d2 Temper.
 *
 * Printed: "Whenever you draw 1 or more cards from an action card effect,
 * create that many Seismic Surge tokens."
 * Snatch ("When this hits, draw a card") is the real action-card-effect draw.
 */

describe("Earthlore Bounty (EVR020) AAA", () => {
  it("happy: drawing from an action card effect creates a Seismic Surge token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [earthloreBounty],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Snatch hits → its action-card-effect draw fires the bounty once.
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 1);
  });

  it("boundary: a fully blocked attack never draws, so no surge is created", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [earthloreBounty],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [browbeatBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    Dash.defendWith(browbeatBlue, nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // 6{d} ≥ 4{p} — Snatch deals no damage, does not hit, does not draw.
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 0);
  });

  it("timing: each qualifying draw triggers once — two hits create two surges", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [earthloreBounty],
        hand: [snatchRed, snatchYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();
    Bravo.playAttack(snatchYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 2);
  });
});
