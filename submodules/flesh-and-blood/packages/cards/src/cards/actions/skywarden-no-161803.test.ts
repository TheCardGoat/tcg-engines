import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "./hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { skywardenNo161803Yellow } from "./skywarden-no-161803.ts";

/**
 * Skywarden no.161803 (PEN165) — Pirate Mechanologist Action Attack, 3{p} 2{d}.
 *
 * Printed: Galvanize — When this defends, you may destroy an item you
 * control. If you do, this gets +1{d}. If a Golden Cog is destroyed this
 * way, create a Gold token.
 *
 * The cog rider is `compare-amount` of `count` `destroyed-this-way` named
 * Golden Cog, inside `optional.then` (Adaptive Plating galvanize). Never
 * `has-status destroyed-this-way-golden-cog`.
 */

describe("Skywarden no.161803 (PEN165) AAA", () => {
  it("happy: destroying a Golden Cog while defending grants +1{d} and a Gold", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [skywardenNo161803Yellow],
        arena: [fabToken("golden-cog")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(skywardenNo161803Yellow);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(fabToken("golden-cog"));

    expectFabCard(Dash, skywardenNo161803Yellow).toHaveDefense(3);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: destroying a non-Cog item grants +1{d} and no Gold", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [skywardenNo161803Yellow],
        arena: [hyperDriverRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(skywardenNo161803Yellow);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(hyperDriverRed);

    expectFabCard(Dash, skywardenNo161803Yellow).toHaveDefense(3);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
  });

  it("timing: declining galvanize leaves printed {d} and creates no Gold", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [skywardenNo161803Yellow],
        arena: [fabToken("golden-cog")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(skywardenNo161803Yellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, skywardenNo161803Yellow).toHaveDefense(2);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
