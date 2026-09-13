import { describe, it } from "vitest";
import {
  expectFabPlayer,
  expectFabToken,
  expectFabUnplayable,
  fabToken,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { scurvStowaway } from "./scurv-stowaway.ts";
import { goldkissRum } from "../tokens/goldkiss-rum.ts";

/**
 * Scurv, Stowaway (SEA123) — Pirate Thief Hero — Young — 20hp.
 *
 * Printed: "Action - {t}, destroy a Gold you control: Create a Goldkiss Rum
 * token. Go again / Whenever you activate a Goldkiss Rum, gain {r}."
 *
 * No signature weapon.
 */

const opponentHero = dash;

describe("scurv-stowaway (SEA123) AAA", () => {
  it("happy: destroying a Gold creates a Goldkiss Rum and go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        arena: [fabToken("gold")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Scurv = game.as(scurvStowaway);

    Scurv.activate(scurvStowaway);
    game.passBoth();

    expectFabToken(game, "gold").toHaveCount(0);
    expectFabToken(game, "goldkiss-rum").toHaveCount(1).toBeIn("arena");
    // −1 AP for the action ability, +1 from go again.
    expectFabPlayer(Scurv).toHaveAP(1);
  });

  it("core mechanic: activating the Goldkiss Rum gains {r} from the hero rider", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        arena: [goldkissRum],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Scurv = game.as(scurvStowaway);

    // The rum's own activation destroys itself and grants go again to the
    // next action; Scurv's rider adds +1{r} on top.
    Scurv.activate(goldkissRum);
    game.passBoth();

    expectFabToken(game, "goldkiss-rum").toHaveCount(0);
    expectFabPlayer(Scurv).toHaveResourceCount(1);
  });

  it("boundary: without a Gold you control the activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero: scurvStowaway, actionPoints: 1, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Scurv = game.as(scurvStowaway);

    expectFabUnplayable(() => Scurv.activate(scurvStowaway), /destroy cost is unavailable/i);
    expectFabToken(game, "goldkiss-rum").toHaveCount(0);
  });
});
