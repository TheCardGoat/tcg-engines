import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { energyPotionBlue } from "../actions/energy-potion.ts";
import { snatchRed } from "../actions/snatch.ts";
import { proclamationOfCombat } from "./proclamation-of-combat.ts";

/**
 * Proclamation of Combat (JDG025) — Adjudicator Equipment Off-Hand.
 *
 * Printed: Action - Destroy this: Until the start of your next turn, the only
 * actions heroes may play or activate are weapon and attack actions.
 */

describe("Proclamation of Combat (JDG025) AAA", () => {
  it("happy: attack actions may still be played", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [proclamationOfCombat],
        hand: [snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(proclamationOfCombat);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Bravo, proclamationOfCombat).toBeIn("graveyard");

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
  });

  it("boundary: a non-attack action cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [proclamationOfCombat],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [energyPotionBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(proclamationOfCombat);
    game.untilIdle({ ordering: "listed" });
    Bravo.endTurn();

    expectFabUnplayable(
      () => Dash.play(energyPotionBlue),
      /restricts this object from being played/,
    );
    expectFabCard(Dash, energyPotionBlue).toBeIn("hand");
  });

  it("timing: the restriction expires at the start of your next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [proclamationOfCombat],
        hand: [energyPotionBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(proclamationOfCombat);
    game.untilIdle({ ordering: "listed" });
    Bravo.endTurn();
    Dash.endTurn();

    Bravo.play(energyPotionBlue);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Bravo, energyPotionBlue).toBeIn("arena");
  });
});
