import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { disableRed } from "../actions/disable.ts";
import { snatchRed } from "../actions/snatch.ts";
import { gauntletOfBoulderhold } from "./gauntlet-of-boulderhold.ts";

/**
 * Gauntlet of Boulderhold (MPG007) — Guardian Arms d1 Battleworn.
 *
 * Printed: Action - {r}{r}{r}, destroy this: The next Guardian attack action
 * card you play from arsenal this turn gets +2{p}. Go again
 *
 * The latch requires BOTH the Guardian type-box and the arsenal play zone:
 * a from-hand Disable or a from-arsenal Snatch stay printed.
 */

describe("Gauntlet of Boulderhold (MPG007) AAA", () => {
  it("happy: the next Guardian attack played from arsenal gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletOfBoulderhold],
        arsenal: [{ card: disableRed, state: { faceDown: false } }],
        hand: [],
        resourcePoints: 8,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(gauntletOfBoulderhold);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, gauntletOfBoulderhold).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.playAttack(disableRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(11);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(29);
  });

  it("boundary: playing the same Guardian attack from hand is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletOfBoulderhold],
        hand: [disableRed],
        resourcePoints: 8,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(gauntletOfBoulderhold);
    game.helpers.resolveUntilIdle();

    Bravo.playAttack(disableRed);
    expectCombat(game).toHaveAttackPower(9);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(31);
  });

  it("timing: a non-Guardian attack from arsenal does not take the buff", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletOfBoulderhold],
        arsenal: [{ card: snatchRed, state: { faceDown: false } }],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(gauntletOfBoulderhold);
    game.helpers.resolveUntilIdle();

    Bravo.playAttack(snatchRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(36);
  });
});
