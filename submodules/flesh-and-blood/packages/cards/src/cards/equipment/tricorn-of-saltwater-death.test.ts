import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { barnacleYellow } from "../actions/barnacle.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tricornOfSaltwaterDeath } from "./tricorn-of-saltwater-death.ts";

/**
 * Tricorn of Saltwater Death (AGB004) — Pirate Necromancer Head, 1{d}.
 * Printed: When this defends, you may discard a card with watery grave. If you
 * do, draw a card. Blade Break.
 */

describe("Tricorn of Saltwater Death (AGB004) AAA", () => {
  it("happy: defend may discard watery-grave then draw", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        head: [tricornOfSaltwaterDeath],
        hand: [barnacleYellow],
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(tricornOfSaltwaterDeath);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(barnacleYellow);

    expectFabCard(Dash, barnacleYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, tricornOfSaltwaterDeath).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: decline discards nothing and draws nothing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        head: [tricornOfSaltwaterDeath],
        hand: [barnacleYellow],
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(tricornOfSaltwaterDeath);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, barnacleYellow).toBeIn("hand");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, tricornOfSaltwaterDeath).toBeIn("graveyard");
  });

  it("timing: a hand without watery-grave still blade-breaks without drawing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        head: [tricornOfSaltwaterDeath],
        hand: [nimblismBlue],
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(tricornOfSaltwaterDeath);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(Dash, tricornOfSaltwaterDeath).toBeIn("graveyard");
  });
});
