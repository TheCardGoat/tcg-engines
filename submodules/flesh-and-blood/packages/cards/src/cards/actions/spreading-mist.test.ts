import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zen } from "../heroes/zen.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { spreadingMistBlue } from "./spreading-mist.ts";

/**
 * Spreading Mist (PEN274) — next attack this turn gets go again.
 */

describe("Spreading Mist (PEN274) AAA", () => {
  it("happy: the next attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [spreadingMistBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(spreadingMistBlue);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(snatchRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveAP(1);
  });

  it("boundary: without Spreading Mist, Snatch does not have go again", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveAP(0);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [spreadingMistBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Zen = game.as(zen);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Zen.defendWith([spreadingMistBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveLife(18);
  });
});
