import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { gasUpRed } from "./gas-up.ts";

/**
 * Gas Up (EVO222) — Mechanologist Action, cost 1, 2{d}, go again.
 *
 * Printed: "The next attack you boost this turn gets +4{p}.
 * You may put a Hyper Driver from your banished zone into the arena.
 * Go again"
 *
 * The +4 latch filters `appliesTo.next.hasStatus: "boosted"` (Bios Update /
 * Twintek family). Unboosted contrast and the optional Hyper Driver put are
 * public regardless of whether the latch matches.
 */

describe("Gas Up (EVO222) AAA", () => {
  it("happy: you may put a banished Hyper Driver into the arena and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [gasUpRed],
        banished: [hyperDriverRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(gasUpRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: hyperDriverRed.canonicalId,
    });

    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
    expectFabCard(Dash, gasUpRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: declining the optional keeps the Hyper Driver banished; an unboosted attack stays 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [gasUpRed, zeroToSixtyRed],
        banished: [hyperDriverRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(gasUpRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, hyperDriverRed).toBeBanished();

    Dash.must.playAttack(zeroToSixtyRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the next boosted attack this turn gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [gasUpRed, zeroToSixtyRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(gasUpRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.must.playAttack(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("defend");

    // Zero to Sixty base 4 + 4 from Gas Up.
    expectCombat(game).toHaveAttackPower(8);
  });
});
