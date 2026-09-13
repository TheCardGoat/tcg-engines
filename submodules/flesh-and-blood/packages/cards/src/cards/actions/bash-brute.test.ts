import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { poundTownBlue } from "./pound-town.ts";
import { snatchRed } from "./snatch.ts";
import { bashBruteRed } from "./bash-brute.ts";

describe("Bash Brute (SUP184) AAA", () => {
  it("happy: defended by a Brute action gets +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [bashBruteRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [poundTownBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(bashBruteRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(poundTownBlue);
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a Generic action defender does not add {p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [bashBruteRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(bashBruteRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
  });
});
