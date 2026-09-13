import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { snatchRed } from "../actions/snatch.ts";
import { preySpotters } from "./prey-spotters.ts";

describe("Prey Spotters (AAC004) AAA", () => {
  it("happy: destroy this as an attack reaction and mark the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        head: [preySpotters],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Arakni.activate(preySpotters);
    game.passBoth();

    expectFabCard(Arakni, preySpotters).toBeIn("graveyard");
    // CR 9.3.3: a later opposing hit removes marked. Assert during the window.
    expectFabPlayer(Dash).toBeMarked();
  });

  it("boundary: cannot activate outside an attack reaction window", () => {
    const game = FabTestEngine.start(
      { hero: arakniMarionette, head: [preySpotters], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.expectActivationRejected(preySpotters);
    expectFabCard(Arakni, preySpotters).toBeIn("head");
    expectFabPlayer(game.as(dash)).notToBeMarked();
  });

  it("timing: an opposing hit removes the marked condition", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        head: [preySpotters],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Arakni.activate(preySpotters);
    game.passBoth();
    expectFabPlayer(Dash).toBeMarked();

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).notToBeMarked();
  });
});
