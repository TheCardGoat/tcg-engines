import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { civicGuide } from "./civic-guide.ts";

/**
 * Civic Guide (TCC032) — Guardian Equipment - Chest.
 * Printed: "Whenever this defends, create a Might token under another
 * hero's control. (Temper)"
 * In 1v1 the only other hero is the attacker.
 */

describe("Civic Guide (TCC032) AAA", () => {
  it("happy: defending with this creates a Might token under the attacker's control", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arms: [civicGuide], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(civicGuide);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
  });

  it("boundary: a hand-card defense does not create the Might token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });

  it("timing: the Might token is created even when the attack is fully blocked", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], arms: [civicGuide], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([civicGuide, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
