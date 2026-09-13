import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { releaseTheTensionRed } from "./release-the-tension.ts";

/**
 * Release the Tension (EVR091) — Ranger Action, cost 0, go again.
 *
 * Printed: Your next arrow attack this turn gains +3{p} and "Defense
 * reactions can't be played from arsenal this chain link." Go again
 */

describe("Release the Tension (EVR091) AAA", () => {
  it("happy: the next arrow attack this turn gains +3{p} and arsenal defense reactions cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [releaseTheTensionRed],
        weapon1: [deathDealer],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [sinkBelowRed], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(releaseTheTensionRed);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);

    game.toReaction("defender");
    // The granted restrict ability applies to the next arrow attack: arsenal
    // defense reactions are closed for this chain link.
    expect(() => Dash.play(sinkBelowRed, { from: "arsenal" })).toThrow(/cannot be played/);
    expectFabCard(Dash, sinkBelowRed).toBeIn("arsenal");
  });

  it("boundary: a non-arrow attack played after Release the Tension gets no +3", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [releaseTheTensionRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(releaseTheTensionRed);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point; a defense reaction from hand is still legal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [releaseTheTensionRed],
        weapon1: [deathDealer],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [sinkBelowRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    expectFabPlayer(Azalea).toHaveAP(1);
    Azalea.play(releaseTheTensionRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    game.toReaction("defender");
    Dash.play(sinkBelowRed);
    expectFabCard(Dash, sinkBelowRed).toBeIn("stack");
  });
});
