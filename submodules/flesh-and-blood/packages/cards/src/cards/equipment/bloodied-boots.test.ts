import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { bloodiedBoots } from "./bloodied-boots.ts";

/**
 * Bloodied Boots (SMP017) — Event Equipment - Legs.
 * Printed: "You may equip this. / Action - Destroy this: Gain 2 action
 * points."
 * The optional event-window "You may equip this" leg has no in-match runtime
 * (same engine verdict as Bloodied Shield SMP018); the operative clause is
 * the Action ability.
 */

describe("Bloodied Boots (SMP017) AAA", () => {
  it("happy: destroying the boots gains 2 action points", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [bloodiedBoots], hand: [], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(bloodiedBoots);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, bloodiedBoots).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(2);
  });

  it("boundary: with no action points the Action cannot be activated", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [bloodiedBoots], hand: [], actionPoints: 0, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(bloodiedBoots);
    expectFabCard(Dash, bloodiedBoots).toBeIn("legs");
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
