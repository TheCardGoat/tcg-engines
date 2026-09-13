import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { fai } from "../heroes/fai.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { rustedRelicBlue } from "./rusted-relic.ts";
import { snatchRed } from "./snatch.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { biosUpdateRed } from "./bios-update.ts";

/**
 * Bios Update (DYN091) — Mechanologist Action, cost 0, 3{d}, go again.
 *
 * Printed: "The next attack action card you boost this turn gains +3{p}.
 * The next time a Mechanologist item with cost 2 or less is banished to pay
 * a boost cost this turn, put it into the arena. Go again."
 *
 * The +3 latch filters `appliesTo.next.hasStatus: "boosted"`, which is
 * declared but unhandled — in the appliesTo.next matcher that fail-closes
 * (no throw, no +N), same family as charged-to-play. Pin the missing buff;
 * the unboosted contrast and go again are public.
 */

describe("Bios Update (DYN091) AAA", () => {
  it("happy: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [biosUpdateRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabPlayer(Dash).toHaveAP(1);
    Dash.play(biosUpdateRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
    expectFabCard(Dash, biosUpdateRed).toBeIn("graveyard");
  });

  it("happy: boosting the next attack action grants +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [biosUpdateRed, zeroToSixtyRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(biosUpdateRed);
    game.helpers.resolveUntilIdle();
    Dash.must.playAttack(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: an unboosted follow-up attack action stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [biosUpdateRed, zeroToSixtyRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(biosUpdateRed);
    game.helpers.resolveUntilIdle();
    Dash.attackWith(zeroToSixtyRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("happy: a cost-1 Mechanologist item banished to boost enters the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [biosUpdateRed, zeroToSixtyRed],
        actionPoints: 2,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, hyperDriverRed],
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(biosUpdateRed);
    game.helpers.resolveUntilIdle();
    expect(Teklo.zone("deck")).toContain(hyperDriverRed.canonicalId);
    Teklo.attackWith(zeroToSixtyRed, { boost: true });

    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena");
  });

  it("boundary: a Generic item banished to boost stays banished", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [biosUpdateRed, zeroToSixtyRed],
        actionPoints: 2,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, rustedRelicBlue],
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(biosUpdateRed);
    game.helpers.resolveUntilIdle();
    Teklo.attackWith(zeroToSixtyRed, { boost: true });

    expectFabCard(Teklo, rustedRelicBlue).toBeIn("banished");
    expect(Teklo.zone("arena")).not.toContain(rustedRelicBlue.canonicalId);
  });
});
