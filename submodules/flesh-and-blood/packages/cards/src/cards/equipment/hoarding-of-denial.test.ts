import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { disableRed } from "../actions/disable.ts";
import { snatchRed } from "../actions/snatch.ts";
import { hoardingOfDenial } from "./hoarding-of-denial.ts";

/**
 * Hoarding of Denial (MPG009) — Off-Hand. "+X{d} while defending, where X is
 * the number of cards with cost 3 or more defending this combat chain."
 */

describe("Hoarding of Denial (MPG009) AAA", () => {
  it("happy: a cost-5 defender makes this +1{d} (0 → 1)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        weapon2: [hoardingOfDenial],
        hand: [disableRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(disableRed, hoardingOfDenial);
    expectFabCard(Bravo, hoardingOfDenial).toHaveDefense(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(20); // 3 + 1 vs 4
  });

  it("boundary: defending alone (no cost-3+ cards) stays 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        weapon2: [hoardingOfDenial],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(hoardingOfDenial);
    expectFabCard(Bravo, hoardingOfDenial).toHaveDefense(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(16); // 20 - 4
  });

  it("timing: a cost-0 defender does not raise this", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        weapon2: [hoardingOfDenial],
        hand: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(snatchRed, hoardingOfDenial);
    expectFabCard(Bravo, hoardingOfDenial).toHaveDefense(0);
  });
});
