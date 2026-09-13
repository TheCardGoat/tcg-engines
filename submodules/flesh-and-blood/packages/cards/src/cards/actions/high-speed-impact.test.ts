import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { highSpeedImpactRed } from "./high-speed-impact.ts";

/**
 * High Speed Impact, Red (CRU106) — Mechanologist Attack, cost 1, 4{p}.
 * Printed: If this hits, the next attack you boost this combat chain gains dominate. Boost.
 *
 * The latch is this-combat-chain. Boost HSI so a Mechanologist deck-top
 * gives go again and the follow-up stays on the same chain. `hasStatus: boosted`
 * already rewrites to wasBoosted (Gas Up / Bios Update).
 */

describe("High Speed Impact family AAA", () => {
  it("happy: a hit grants dominate to the next boosted attack this combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [highSpeedImpactRed, zeroToSixtyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [zeroToSixtyRed],
        deck: 6,
      },
      { hero: bravo, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(highSpeedImpactRed, { boost: true });
    game.advanceCombatTo("resolution");
    expectFabPlayer(game.as(bravo)).toHaveLife(36);

    Dash.playAttack(zeroToSixtyRed, { boost: true });
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: an unboosted next attack this chain does not gain dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [highSpeedImpactRed, zeroToSixtyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [zeroToSixtyRed],
        deck: 6,
      },
      { hero: bravo, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(highSpeedImpactRed, { boost: true });
    game.advanceCombatTo("resolution");
    Dash.playAttack(zeroToSixtyRed);
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("timing: a miss does not grant dominate to a later boosted attack this chain", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [highSpeedImpactRed, zeroToSixtyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [zeroToSixtyRed],
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(highSpeedImpactRed, { boost: true });
    Bravo.defendWith(nimblismBlue, nimblismBlue);
    game.advanceCombatTo("resolution");
    expectFabPlayer(Bravo).toHaveLife(40);

    Dash.playAttack(zeroToSixtyRed, { boost: true });
    expectCombat(game).notToHaveKeyword("dominate");
  });
});
