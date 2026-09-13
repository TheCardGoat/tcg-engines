import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { warriorSValorYellow } from "../actions/warrior-s-valor.ts";
import { bracersOfBellonaSGrace } from "./bracers-of-bellona-s-grace.ts";

/**
 * Bracers of Bellona's Grace (ASB005) — Light Warrior Arms d2, Blade Break.
 * Printed: "When this defends, you may charge your hero's soul. If a yellow
 * card is charged this way, create a Courage token."
 */

describe("Bracers of Bellona's Grace (ASB005) AAA", () => {
  it("happy: charging a yellow card while defending creates a Courage token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [bracersOfBellonaSGrace],
        hand: [warriorSValorYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(bracersOfBellonaSGrace);
    game.passBoth(); // surfaces the defend trigger
    Bravo.accept();
    Bravo.target(warriorSValorYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("courage", 1);
    expectFabCard(Bravo, warriorSValorYellow).toBeIn("soul");
  });

  it("boundary: a non-yellow charge makes no Courage token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [bracersOfBellonaSGrace],
        hand: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(bracersOfBellonaSGrace);
    game.passBoth();
    Bravo.accept();
    Bravo.target(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("courage", 0);
    expectFabCard(Bravo, snatchRed).toBeIn("soul");
  });
});
