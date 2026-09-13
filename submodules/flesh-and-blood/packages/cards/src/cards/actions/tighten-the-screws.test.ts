import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { urgentDeliveryRed } from "./urgent-delivery.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { tightenTheScrewsRed } from "./tighten-the-screws.ts";

/**
 * Tighten the Screws (SEA041) — Mechanologist Action.
 *
 * Printed:
 *   Your next Mechanologist attack this turn gets +4{p}.
 *   You may {u} a cog you control.
 *   Go again
 */

describe("Tighten the Screws (SEA041) AAA", () => {
  it("happy: the next Mechanologist attack this turn gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tightenTheScrewsRed, urgentDeliveryRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(tightenTheScrewsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.attackWith(urgentDeliveryRed);

    // Urgent Delivery base 4 + 4 = 8.
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a non-Mechanologist attack does not get +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tightenTheScrewsRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(tightenTheScrewsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.attackWith(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the play AP and may {u} a cog you control", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tightenTheScrewsRed],
        arena: [{ card: goldenCog, state: { tapped: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(tightenTheScrewsRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: goldenCog.canonicalId,
    });

    expectFabPlayer(Dash).toHaveAP(1);
    expectFabCard(Dash, goldenCog).toBeReady();
  });
});
