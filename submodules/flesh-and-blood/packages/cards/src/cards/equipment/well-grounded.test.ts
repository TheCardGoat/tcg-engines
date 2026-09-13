import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { autumnSTouchYellow } from "../actions/autumn-s-touch.ts";
import { earthFormBlue, earthFormRed, earthFormYellow } from "../actions/earth-form.ts";
import { wellGrounded } from "./well-grounded.ts";

/**
 * Well Grounded (FAB299) — Earth Equipment - Legs.
 *
 * Printed: Instant - Destroy this: Prevent the next 2 damage that would be
 * dealt to you this turn. Activate this only if there are 4 or more Earth
 * cards in your banished zone.
 */

const fourEarthBanished = [earthFormRed, earthFormYellow, earthFormBlue, autumnSTouchYellow];
const threeEarthBanished = [earthFormRed, earthFormYellow, earthFormBlue];

describe("Well Grounded (FAB299) AAA", () => {
  it("happy: with 4 Earth cards banished, destroying this prevents the next 2 damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        legs: [wellGrounded],
        banished: fourEarthBanished,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith();
    game.toReaction("defender");
    Bravo.activate(wellGrounded);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4{p} attack minus the prevented 2 = 2 damage.
    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, wellGrounded).toBeIn("graveyard");
  });

  it("boundary: with only 3 Earth cards banished the Instant cannot be activated", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        legs: [wellGrounded],
        banished: threeEarthBanished,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith();
    game.toReaction("defender");
    Bravo.expectActivationRejected(wellGrounded);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // No prevention: the full 4 damage carries.
    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, wellGrounded).toBeIn("legs");
  });
});
