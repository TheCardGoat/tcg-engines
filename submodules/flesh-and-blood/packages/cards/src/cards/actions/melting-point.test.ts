import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { meltingPointRed } from "./melting-point.ts";

/**
 * Melting Point (OUT105) — Ranger Action, red.
 *
 * Printed: Your next arrow attack this turn gains +4{p}. If it has an aim
 * counter, it gains "When this hits a hero, destroy a 1H weapon they
 * control with 1 base {p}." Go again
 *
 * The +4 latch is public. The aim-counter rider is a self-static on Melting
 * Point (not the next arrow) and the destroy scan is `zones:["permanent"]`,
 * so an aimed hit does not destroy an equipped 1H — pin, do not half-fix.
 */

describe("Melting Point (OUT105) AAA", () => {
  it("happy: the next arrow attack this turn gains +4{p} and go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [meltingPointRed],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(meltingPointRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    // Searing Shot base 4 + 4 = 8.
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a non-arrow attack gets no +4, and an arrow cannot fire from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [meltingPointRed, snatchRed, searingShotRed],
        weapon1: [deathDealer],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(meltingPointRed);
    game.helpers.resolveUntilIdle();

    expect(() => Azalea.attackWith(searingShotRed)).toThrow();
    expectFabCard(Azalea, searingShotRed).toBeIn("hand");

    Azalea.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: an aimed arrow hit destroys a 1H weapon with 1 base {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [meltingPointRed],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { aimCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, weapon1: [nerveScalpel], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(meltingPointRed);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Dash, nerveScalpel).toBeIn("graveyard");
  });
});
