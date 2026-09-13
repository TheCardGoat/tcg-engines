import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { underLoopBlue } from "./under-loop.ts";
import { mhzScriptYellow } from "./mhz-script.ts";
import { pourTheMoldRed } from "./pour-the-mold.ts";

/**
 * Pour the Mold Red (ARC014) — Mechanologist Action. Go again.
 *
 * Printed: Put a Mechanologist item with cost 2 or less from your hand
 * into the arena.
 * If you have boosted this turn, put a steam counter on it.
 */

describe("Pour the Mold (ARC014) AAA", () => {
  it("happy: after a boost, the hand item enters with a steam counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [underLoopBlue, pourTheMoldRed, mhzScriptYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: kano, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(underLoopBlue, { boost: true });
    game.advanceUntil({ stopAt: "defend" });
    game.as(kano).defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Dash.play(pourTheMoldRed);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: mhzScriptYellow.canonicalId,
    });

    expectFabCard(Dash, mhzScriptYellow).toBeIn("arena");
    expectFabCard(Dash, mhzScriptYellow).toHaveCounters(1, "steam");
    expectFabPlayer(Dash).toHaveAP(1); // go again refund
  });

  it("pin: the steam counter is granted without a boost too (§5 engine/boost-condition-ungated)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pourTheMoldRed, mhzScriptYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(pourTheMoldRed);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: mhzScriptYellow.canonicalId,
    });

    // PIN: printed the counter needs "if you have boosted this turn" —
    // it is granted unconditionally.
    expectFabCard(Dash, mhzScriptYellow).toBeIn("arena");
    expectFabCard(Dash, mhzScriptYellow).toHaveCounters(1, "steam"); // ungated
  });
});
