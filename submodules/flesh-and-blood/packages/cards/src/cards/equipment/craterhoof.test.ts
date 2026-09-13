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
import { craterhoof } from "./craterhoof.ts";

/**
 * Craterhoof (MPG008) — Guardian Legs d1 Battleworn.
 *
 * Printed: Action - {r}{r}{r}, destroy this: The next Guardian attack action
 * card you play from arsenal this turn gets dominate. Go again
 *
 * Gauntlet of Boulderhold sibling for the keyword grant: dominate latches
 * only onto a Guardian attack played from arsenal, never from hand and never
 * onto a non-Guardian arsenal attack.
 */

describe("Craterhoof (MPG008) AAA", () => {
  it("happy: the next Guardian attack from arsenal gets dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [craterhoof],
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

    Bravo.activate(craterhoof);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, craterhoof).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.playAttack(disableRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(9);
    expectCombat(game).toHaveKeyword("dominate");
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(31);
  });

  it("boundary: playing the same Guardian attack from hand gets no dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [craterhoof],
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

    Bravo.activate(craterhoof);
    game.helpers.resolveUntilIdle();

    Bravo.playAttack(disableRed);
    expectCombat(game).toHaveAttackPower(9);
    expectCombat(game).notToHaveKeyword("dominate");
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(31);
  });

  it("timing: a non-Guardian attack from arsenal does not take dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [craterhoof],
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

    Bravo.activate(craterhoof);
    game.helpers.resolveUntilIdle();

    Bravo.playAttack(snatchRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("dominate");
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(36);
  });
});
