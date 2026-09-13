import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { flightPath } from "./flight-path.ts";

/**
 * Flight Path (AAZ007) — Ranger Equipment Legs.
 *
 * Printed AR: Destroy this: Target arrow attack with an aim counter gets go
 * again.
 *
 * Snapdragon Scalers already proves destroy-self AR grant-go-again onto a chain
 * AAC. This trio proves the extra Arrow + aim-counter filter, then the AP refund.
 */

describe("Flight Path (AAZ007) AAA", () => {
  it("happy: destroy this so an aimed arrow attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        legs: [flightPath],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { aimCounters: 1, faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    game.advanceCombatTo("reaction");
    Azalea.activate(flightPath);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Azalea, flightPath).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("boundary: an arrow without an aim counter cannot be the target", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        legs: [flightPath],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    game.advanceCombatTo("reaction");
    Azalea.expectActivationRejected(flightPath);
    expectCombat(game).notToHaveKeyword("go-again");
    expectFabCard(Azalea, flightPath).toBeIn("legs");
  });

  it("boundary: a non-arrow attack cannot be the target", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        legs: [flightPath],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Azalea.expectActivationRejected(flightPath);
    expectFabPlayer(Azalea).toHaveAP(0);
    expectFabCard(Azalea, flightPath).toBeIn("legs");
  });
});
