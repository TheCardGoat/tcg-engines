import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { pulseOfVolthavenRed } from "../instants/pulse-of-volthaven.ts";
import { shockFrock } from "./shock-frock.ts";

/**
 * Shock Frock — Lightning Chest d1, Battleworn.
 *
 * Printed: "Action - Destroy this: Gain {r}. Activate this only if you've
 * played a Lightning card this turn. Go again. Battleworn"
 */

describe("Shock Frock (AST004) AAA", () => {
  it("happy: after playing a Lightning card, destroying the frock gains {r} and go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [shockFrock],
        hand: [pulseOfVolthavenRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(pulseOfVolthavenRed); // Lightning Instant, cost 0
    game.untilIdle();

    Dash.activate(shockFrock);
    game.untilIdle();

    expectFabCard(Dash, shockFrock).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabPlayer(Dash).toHaveAP(1); // go again pays the action point back
  });

  it("boundary: without a Lightning card played this turn the Action is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [shockFrock],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(shockFrock);
    expectFabCard(Dash, shockFrock).toBeIn("chest");
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });
});
