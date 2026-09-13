import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { snatchRed } from "./snatch.ts";
import { rustyHarpoonBlue } from "./rusty-harpoon.ts";
import { witheringShotRed as witheringShot } from "./withering-shot.ts";
import { toxicityRed } from "./toxicity.ts";

/**
 * Toxicity, Red (OUT165) — printed go again + next Assassin/Ranger hit drain 5.
 */

describe("Toxicity (OUT165) AAA", () => {
  it("happy: the next Ranger attack that hits also drains 5{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [toxicityRed],
        arsenal: [witheringShot],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(toxicityRed);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(witheringShot, { from: "arsenal" });
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(10);
  });

  it("boundary: a Generic attack gains nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [toxicityRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(toxicityRed);
    game.helpers.resolveUntilIdle();
    Azalea.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: the grant expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [toxicityRed],
        arsenal: [rustyHarpoonBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(toxicityRed);
    game.helpers.resolveUntilIdle();
    Azalea.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.untilIdle();

    Azalea.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
