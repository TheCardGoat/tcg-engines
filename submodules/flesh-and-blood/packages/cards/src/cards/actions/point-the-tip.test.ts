import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { pointTheTipRed } from "./point-the-tip.ts";

/**
 * Point the Tip (DYN168) — Ranger Action, cost 0, go again.
 *
 * Printed: "Target face up arrow in your arsenal gains +3{p} until end of
 * turn. Put an aim counter on it. Go again"
 *
 * Arrows play only from arsenal while controlling a bow (CR 8.2.6a).
 * Fixtures default arsenal face-down (CR 3.3); seat face-up explicitly.
 */

describe("Point the Tip (DYN168) AAA", () => {
  it("happy: a face-up arsenal arrow gets +3{p} and an aim counter", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [pointTheTipRed],
        arsenal: [{ card: searingShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.must.play(pointTheTipRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Azalea, pointTheTipRed).toBeIn("graveyard");
    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expectFabCard(Azalea, searingShotRed).toHaveCounters(1, "aim");
    expectFabCard(Azalea, searingShotRed).toHavePower(7);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a face-down arsenal arrow is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [pointTheTipRed],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    expectFabUnplayable(() => Azalea.play(pointTheTipRed));
    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expectFabCard(Azalea, searingShotRed).toBeFaceDown();
    expectFabCard(Azalea, searingShotRed).toHaveCounters(0, "aim");
  });

  it("timing: go again lets the arrow be played from arsenal this turn (CR 8.2.6a)", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [pointTheTipRed],
        arsenal: [{ card: searingShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.must.play(pointTheTipRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toBeOpen();
    expect(Azalea.zone("arsenal")).toHaveLength(0);
  });
});
