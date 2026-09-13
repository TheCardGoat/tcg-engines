import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { engulfingLightRed } from "./engulfing-light.ts";

/**
 * Engulfing Light, Red (BOL014) — optional charge + conditional on-hit
 * soul retrieval. Clean module (no unprinted keywords).
 *
 * Printed: "As an additional cost to play Engulfing Light, you may charge
 * your hero's soul. If you've charged this turn, Engulfing Light gains
 * 'If this hits, put it into your hero's soul.'" — cost 0, 3{p}, defense
 * 3. Both clauses are exercised through public play: the charge moves a
 * hand card to the soul zone, and the granted on-hit retrieval is
 * observable via the resolved attack's zone.
 */

describe("Engulfing Light (BOL014) AAA", () => {
  it("happy: charging lets the hit place Engulfing Light into the soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [engulfingLightRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.attackWith(engulfingLightRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17); // printed 3{p}
    // the charged card and the attack itself both rest in the soul.
    expect(Boltyn.zone("soul")).toContain(nimblismBlue.canonicalId);
    expect(Boltyn.zone("soul")).toContain(engulfingLightRed.canonicalId);
    expect(Boltyn.zone("graveyard")).not.toContain(engulfingLightRed.canonicalId);
  });

  it("boundary: without the charge the resolved attack goes to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [engulfingLightRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.attackWith(engulfingLightRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Boltyn.zone("soul")).toHaveLength(0);
    expect(Boltyn.zone("graveyard")).toContain(engulfingLightRed.canonicalId);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [engulfingLightRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([engulfingLightRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(19);
    expect(Boltyn.zone("graveyard")).toContain(engulfingLightRed.canonicalId);
  });
});
