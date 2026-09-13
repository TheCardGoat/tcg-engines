import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { shelterFromTheStormRed } from "./shelter-from-the-storm.ts";

/**
 * Shelter from the Storm Red (HNT222) — Generic Defense Reaction.
 *
 * Printed: Instant — Discard this: The next 3 times you would be dealt damage
 * this turn, prevent 1 of that damage.
 */

describe("Shelter from the Storm (HNT222) AAA", () => {
  it("happy: discarding this as an instant prevents 1 from the next 3 damage packets", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed, snatchRed], actionPoints: 3, deck: 6 },
      { hero: dash, hand: [shelterFromTheStormRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(Bravo.cardsIn("hand", snatchRed)[0]!);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Dash.activate(shelterFromTheStormRed);
    game.helpers.resolveRestOfCombat();

    for (let i = 0; i < 2; i += 1) {
      Bravo.attackWith(Bravo.cardsIn("hand", snatchRed)[0]!);
      game.helpers.resolveRestOfCombat();
    }

    expectFabPlayer(Dash).toHaveLife(11);
    expectFabCard(Dash, shelterFromTheStormRed).toBeIn("graveyard");
  });

  it("boundary: playing this as a defense reaction does not arm the prevention", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hero: dash, hand: [shelterFromTheStormRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(Bravo.cardsIn("hand", snatchRed)[0]!);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Dash.play(shelterFromTheStormRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);

    Bravo.attackWith(Bravo.cardsIn("hand", snatchRed)[0]!);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, shelterFromTheStormRed).toBeIn("graveyard");
  });
});
