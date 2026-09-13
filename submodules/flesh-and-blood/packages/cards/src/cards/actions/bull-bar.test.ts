import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { bullBarRed } from "./bull-bar.ts";

/**
 * Bull Bar, Red (EVO147) — overpower if you control a Hyper Driver.
 */

describe("Bull Bar family AAA", () => {
  it("happy: controlling a Hyper Driver grants overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: hyperDriverRed, state: { steamCounters: 3 } }],
        hand: [bullBarRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(bullBarRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("overpower");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(15);
  });

  it("boundary: without a Hyper Driver there is no overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [bullBarRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(bullBarRed);
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("overpower");
    Bravo.defendWith([snatchRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [bullBarRed],
        life: 20,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([bullBarRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
