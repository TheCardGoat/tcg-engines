import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { nimblismYellow } from "./nimblism.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { prayerOfBellonaYellow } from "./prayer-of-bellona.ts";

/**
 * Prayer of Bellona, Yellow (DTD053) — Light Warrior Action, cost 1, go again.
 * Printed: "Your next attack this turn gets +2{p}.
 * Reveal the top card of your deck. If it's yellow, put it into your hand,
 * then charge your hero's soul.
 * Go again"
 *
 * The authored a2 sequence runs `charge` as a sibling of the yellow
 * conditional (not inside `then`). Printed charge is yellow-only; a
 * non-yellow reveal that still charges is pinned as a definition gap.
 */

describe("Prayer of Bellona (DTD053) AAA", () => {
  it("happy: the next attack this turn gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [prayerOfBellonaYellow, nimblismBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deckTop: [brutalAssaultBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(prayerOfBellonaYellow);
    game.helpers.resolveUntilIdle();
    Boltyn.attackWith(snatchRed);

    // Snatch 4{p} + 2 = 6. Do not defend with an attack action: Boltyn's
    // charged-this-turn static would add another +1{p}.
    expectCombat(game).toHaveAttackPower(6);
  });

  it("happy: a yellow reveal goes to hand, then charges the soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [prayerOfBellonaYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismYellow],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(prayerOfBellonaYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Boltyn, nimblismYellow).toBeIn("soul");
    expect(Boltyn.zone("hand")).not.toContain(nimblismYellow.canonicalId);
    expectFabPlayer(Boltyn).toHaveAP(1);
  });

  it("boundary: a non-yellow reveal does not charge", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [prayerOfBellonaYellow, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(prayerOfBellonaYellow);
    game.helpers.resolveUntilIdle();

    expect(Boltyn.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabCard(Boltyn, nimblismBlue).toBeIn("hand");
  });

  it("timing: go again refunds the action point; a second attack is unbuffed", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [prayerOfBellonaYellow, nimblismBlue, snatchRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deckTop: [nimblismYellow],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    expect(Boltyn.actionPoints()).toBe(2);
    Boltyn.play(prayerOfBellonaYellow);
    game.helpers.resolveUntilIdle();
    expect(Boltyn.actionPoints()).toBe(2);

    Boltyn.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();

    Boltyn.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });
});
