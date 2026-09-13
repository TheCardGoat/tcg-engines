import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { crossTheLineRed } from "../actions/cross-the-line.ts";
import { blessingOfAegisYellow } from "../actions/blessing-of-aegis.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { vestigeOfSol } from "./vestige-of-sol.ts";

/**
 * Vestige of Sol (MON060) — Light Chest Equipment. Blade Break.
 *
 * Printed: If a card has been put into your hero's soul this turn, whenever
 * you pitch a Light card, instead gain that many {r} plus 1.
 */

describe("Vestige of Sol (MON060) AAA", () => {
  it("pin: the soul-conditioned pitch boost never fires (§5 engine/card-put-into-soul-this-turn-unhandled)", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        chest: [vestigeOfSol],
        hand: [blessingOfAegisYellow, crossTheLineRed, brutalAssaultBlue],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(blessingOfAegisYellow);
    game.helpers.resolveUntilIdle();

    // Next turn start: Blessing of Aegis puts itself into the soul (+1 life).
    Boltyn.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Boltyn).toHaveLife(21); // Blessing's soul-entry trigger

    // PIN: the soul entry happened this turn (life 21 above), but the
    // pitch-boost static gates on unhandled has-status
    // "card-put-into-soul-this-turn" and never activates — the cost-2
    // swing stays unpayable off a 1-{r} Light pitch.
    expect(() => Boltyn.must.pitch(crossTheLineRed).play(brutalAssaultBlue)).toThrow(
      /pay|resource/i,
    );
    expectFabCard(Boltyn, crossTheLineRed).toBeIn("hand");
  });

  it("boundary: with no soul entry this turn the pitch stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        chest: [vestigeOfSol],
        hand: [crossTheLineRed, brutalAssaultBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    // Without a soul entry this turn the pitch yields only its printed 1
    // {r} — the cost-2 swing is unpayable.
    expect(() => Boltyn.must.pitch(crossTheLineRed).play(brutalAssaultBlue)).toThrow(
      /pay|resource/i,
    );
    expectFabCard(Boltyn, crossTheLineRed).toBeIn("hand");
  });
});
