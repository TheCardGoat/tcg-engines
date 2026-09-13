import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { sicEmShotBlue } from "../actions/sic-em-shot.ts";
import { sharpShooters } from "./sharp-shooters.ts";

/**
 * Sharp Shooters (AAZ006) — Ranger Arms d1, Battleworn.
 *
 * Printed: "Action - Destroy this: Put an arrow from your hand face-up into
 * your arsenal with an aim counter. Go again. Battleworn"
 */

describe("Sharp Shooters (AAZ006) AAA", () => {
  it("happy: destroying the arms stocks the chosen arrow face-up with an aim counter and refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [sharpShooters],
        hand: [sicEmShotBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(sharpShooters);
    Azalea.target(sicEmShotBlue);
    game.untilIdle();

    expectFabCard(Azalea, sharpShooters).toBeIn("graveyard");
    expectFabCard(Azalea, sicEmShotBlue).toBeIn("arsenal");
    expectFabCard(Azalea, sicEmShotBlue).toBeFaceUp();
    expectFabCard(Azalea, sicEmShotBlue).toHaveCounters(1, "aim");
    expectFabPlayer(Azalea).toHaveAP(1); // go again pays the action point back
  });

  it("boundary: with no arrow in hand the Action cannot be activated and the arms stay", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [sharpShooters],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.expectActivationRejected(sharpShooters);
    expectFabCard(Azalea, sharpShooters).toBeIn("arms");
  });
});
