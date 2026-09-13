import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { hypothermiaBlue } from "../actions/hypothermia.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { ollinIceCap } from "./ollin-ice-cap.ts";

/**
 * Ollin Ice Cap (AJV004) — Ice Guardian Equipment - Head. (Blade Break)
 * Printed: "When this defends together with an Ice card, create a
 * Frostbite token under the attacking hero's control."
 */

describe("Ollin Ice Cap (AJV004) AAA", () => {
  it("happy: defending together with an Ice card Frostbites the attacker", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [hypothermiaBlue], head: [ollinIceCap], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([ollinIceCap, hypothermiaBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("frostbite", 1);
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);
  });

  it("boundary: a non-Ice co-defender creates nothing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], head: [ollinIceCap], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([ollinIceCap, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("frostbite", 0);
  });

  it("timing: the Frostbite lands under the attacker even when the hit is fully blocked", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [hypothermiaBlue, nimblismBlue], head: [ollinIceCap], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([ollinIceCap, hypothermiaBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("frostbite", 1);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
