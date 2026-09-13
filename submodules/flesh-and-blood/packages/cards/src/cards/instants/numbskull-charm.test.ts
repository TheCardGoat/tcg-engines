import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { pleiadesSuperstar } from "../heroes/pleiades-superstar.ts";
import { cutNCarveRed } from "../actions/cut-n-carve.ts";
import { lunartidePlundererYellow } from "../actions/lunartide-plunderer.ts";
import { numbskullCharmYellow } from "./numbskull-charm.ts";

/**
 * Numbskull Charm (SUP007) — Shaman Yellow instant.
 *
 * Printed: Choose any number;
 * - Destroy a Confidence or Might token.
 * - The crowd cheers you.
 * - Pitch the top card of your deck. If it has 6 or more {p}, create a Vigor token.
 */

describe("Numbskull Charm (SUP007) AAA", () => {
  it("happy: the destroy-token mode removes a seated Confidence token", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        arena: [fabToken("confidence")],
        hand: [numbskullCharmYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.play(numbskullCharmYellow, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Pleiades).toHaveTokenCount("confidence", 0);
  });

  it("happy: pitch-top below 6{p} creates no Vigor; cheering then mints Confidence", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        hand: [numbskullCharmYellow],
        resourcePoints: 2,
        actionPoints: 1,
        // Deck top is a non-attack action with no printed {p}.
        deck: [cutNCarveRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.play(numbskullCharmYellow, { modeIndexes: [2] });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Pleiades).toHaveTokenCount("vigor", 0);

    const game2 = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        hand: [numbskullCharmYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [cutNCarveRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const P1b = game2.as(pleiadesSuperstar);
    P1b.play(numbskullCharmYellow, { modeIndexes: [1] });
    game2.helpers.resolveUntilIdle();
    expectFabPlayer(P1b).toHaveTokenCount("confidence", 1);
  });

  it("boundary: a 6-power deck top mints the Vigor reward", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        hand: [numbskullCharmYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [lunartidePlundererYellow],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.play(numbskullCharmYellow, { modeIndexes: [2] });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Pleiades).toHaveTokenCount("vigor", 1);
  });
});
