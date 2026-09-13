import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { headJabBlue } from "./head-jab.ts";
import { snatchRed } from "./snatch.ts";
import { oneTwoPunchRed } from "./one-two-punch.ts";

describe("One Two Punch (OUT080) AAA", () => {
  it("happy: after Head Jab, a hit deals printed combat plus 2 extra", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabBlue, oneTwoPunchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(headJabBlue);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(oneTwoPunchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: without Head Jab as the last attack, a hit deals only printed 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [oneTwoPunchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(oneTwoPunchRed);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [oneTwoPunchRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([oneTwoPunchRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
