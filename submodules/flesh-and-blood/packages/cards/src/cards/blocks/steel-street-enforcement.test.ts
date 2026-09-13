import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { evoSteelSoulMemoryBlue } from "../actions/evo-steel-soul-memory.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { snatchRed } from "../actions/snatch.ts";
import { steelStreetEnforcementBlue } from "./steel-street-enforcement.ts";

describe("Steel Street Enforcement (EVO060) AAA", () => {
  it("happy: defends for printed 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [steelStreetEnforcementBlue],
        head: [evoSteelSoulMemoryBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    Dash.defendWith(steelStreetEnforcementBlue);
    game.helpers.resolveRestOfCombat();

    // Printed 1{d} + Evo Upgrade +1{d} (one equipped evo, CR 8.4.11) soaks 2
    // of the 4{p} — the evos-equipped count now resolves at runtime.
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, steelStreetEnforcementBlue).toBeIn("graveyard");
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [steelStreetEnforcementBlue], head: [tekloBaseHead], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(steelStreetEnforcementBlue)).toThrow();
    expectFabCard(game.as(dash), steelStreetEnforcementBlue).toBeIn("hand");
  });
});
