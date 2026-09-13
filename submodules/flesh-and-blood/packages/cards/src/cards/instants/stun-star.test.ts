import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { stunStarBlue } from "./stun-star.ts";

/**
 * Stun Star (OMN234) — Ninja Legendary Shuriken Item, 1{p}/2{d}.
 *
 * Printed:
 *   Action - {r}, {t}, destroy this when the combat chain closes: Attack.
 *   Go again
 *   When this hits a hero, {t} them.
 */

describe("Stun Star (OMN234) AAA", () => {
  it("timing: survives its own attack, taps the hit hero at resolution, and is destroyed at close", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [stunStarBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    // Act
    Dash.play(stunStarBlue);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, stunStarBlue).toBeIn("arena");
    Dash.activateAttack(stunStarBlue);

    // Defect proof — the star is the live attack and still standing; a paid
    // destroy-self cost would have removed it before combat even opened.
    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Dash, stunStarBlue).toBeIn("arena");
    game.closeCombat({ ordering: "listed" });

    // Assert — hit + tap rider resolved, close-destroy fired after, go again
    // refunded the spent action point.
    expectFabPlayer(Azalea).toHaveLife(19);
    expectFabCard(Azalea, azalea).toBeTapped();
    // Item plays spend no action point (not an Action): seed 2 − attack 1
    // + Go again refund 1 = 2. A missing refund would read 1.
    expectFabPlayer(Dash).toHaveAP(2);
    expectFabCard(Dash, stunStarBlue).toBeIn("graveyard");
  });

  it("boundary: an unactivated Stun Star is untouched by another chain closing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [stunStarBlue, snatchRed],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: azalea, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    // Act — Snatch closes its own chain while the star never attacked.
    Dash.play(stunStarBlue);
    game.untilIdle({ ordering: "listed" });
    Dash.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    // Assert — star still armed in the arena and nobody got tapped.
    expectFabPlayer(Azalea).toHaveLife(16); // 20 − 4{p}
    expectFabCard(Azalea, azalea).toBeReady();
    expectFabCard(Dash, stunStarBlue).toBeIn("arena");
  });
});
