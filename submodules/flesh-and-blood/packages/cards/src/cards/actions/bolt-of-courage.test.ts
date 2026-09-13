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
import { boltOfCourageRed } from "./bolt-of-courage.ts";

/**
 * Bolt of Courage, Red (BOL011) — optional charge + conditional on-hit
 * draw. Clean module (no unprinted keywords).
 *
 * Printed: "As an additional cost to play Bolt of Courage, you may
 * charge your hero's soul. If you've charged this turn, Bolt of Courage
 * gains 'If this hits, draw a card.'" — cost 0, 3{p}, defense 3. Both
 * clauses are exercised through public play: the charge moves a hand
 * card to the soul zone, and the granted on-hit draw is observable via
 * hand count.
 */

describe("Bolt of Courage (BOL011) AAA", () => {
  it("happy: charging lets the hit draw a card, and the charged card rests in the soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.attackWith(boltOfCourageRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17); // printed 3{p}
    expect(Boltyn.zone("soul")).toContain(nimblismBlue.canonicalId);
    // 2 cards: one charged to the soul, one played; the hit draws 1 back.
    expect(Boltyn.handCount()).toBe(1);
    expect(Boltyn.zone("graveyard")).toContain(boltOfCourageRed.canonicalId);
  });

  it("boundary: without the charge the hit draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.attackWith(boltOfCourageRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Boltyn.zone("soul")).toHaveLength(0);
    // no charge this turn → no granted "if this hits, draw a card".
    expect(Boltyn.handCount()).toBe(0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageRed],
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
    Boltyn.defendWith([boltOfCourageRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(19);
    expect(Boltyn.zone("graveyard")).toContain(boltOfCourageRed.canonicalId);
  });
});
