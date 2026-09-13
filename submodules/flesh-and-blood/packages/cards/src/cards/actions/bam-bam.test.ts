import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { rompingClub } from "../weapons/romping-club.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { bamBamYellow } from "./bam-bam.ts";

/**
 * Bam Bam (SEA250) — Brute Attack, 6{p}.
 * Printed: When this hits a hero, destroy an item they control.
 * Instant — Discard this: Your club attacks this turn get "When this hits a
 * hero, destroy an item they control."
 */

describe("Bam Bam (SEA250) AAA", () => {
  it("happy: a hit destroys an item they control", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bamBamYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(rhinar).playAttack(bamBamYellow);
    game.closeCombat({ ordering: "listed", entityTargets: "minimum" });

    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
  });

  it("boundary: a miss leaves their item", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bamBamYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(rhinar).playAttack(bamBamYellow);
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
  });

  it("timing: discarding this grants club attacks the on-hit destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rompingClub],
        hand: [bamBamYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.activate(bamBamYellow);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Rhinar, bamBamYellow).toBeIn("graveyard");
    Rhinar.activateAttack(rompingClub);
    game.closeCombat({ ordering: "listed", entityTargets: "minimum" });

    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
  });
});
