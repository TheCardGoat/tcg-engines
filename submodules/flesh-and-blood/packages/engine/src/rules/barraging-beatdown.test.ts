import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "../testing/index.ts";
import { barragingBeatdownRed } from "../../../cards/src/cards/actions/barraging-beatdown.ts";
import { scarForAScarRed } from "../../../cards/src/cards/actions/scar-for-a-scar.ts";
import { riledUpRed } from "../../../cards/src/cards/actions/riled-up.ts";
import { nimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import { rhinar } from "../../../cards/src/cards/heroes/rhinar.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";

// Generic next-matching-object lifetime rules. The card's per-pitch bonus and
// non-equipment defender threshold are covered in its adjacent card suite.
describe("Continuous next-attack applicability and expiry", () => {
  function setup() {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        life: 10,
        hand: [barragingBeatdownRed, scarForAScarRed, riledUpRed],
        resourcePoints: 3,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: rhinar },
    );
    return { game, Rhinar: game.as(rhinar), Dash: game.as(dash) };
  }

  it("an ineligible Generic attack does not consume the next Brute attack grant", () => {
    const { game, Rhinar, Dash } = setup();
    Rhinar.play(barragingBeatdownRed);
    game.untilIdle();
    Rhinar.playAttack(scarForAScarRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(Rhinar).toHaveAP(1);
    Rhinar.playAttack(riledUpRed);
    expectCombat(game).toHaveAttackPower(11);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(5);
  });

  it("an unused this-turn grant expires before the next turn's matching attack", () => {
    const { game, Rhinar, Dash } = setup();
    Rhinar.play(barragingBeatdownRed);
    game.untilIdle();
    Rhinar.playAttack(scarForAScarRed);
    game.closeCombat();
    Rhinar.endTurn();
    Dash.endTurn();
    Rhinar.playAttack(riledUpRed, { pitch: nimblismBlue });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(9);
  });
});
