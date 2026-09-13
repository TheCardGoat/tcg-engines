import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { skullCrackRed } from "./skull-crack.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { dreadScreamerRed } from "./dread-screamer.ts";

/**
 * Dread Screamer, Red (LEV011) — go again if a 6+{p} card is banished this way.
 */

describe("Dread Screamer family AAA", () => {
  it("happy: banishing a 6{p} card this way grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [dreadScreamerRed],
        graveyard: [skullCrackRed, nimblismBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(dreadScreamerRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(Levia).toHaveAP(1);
  });

  it("boundary: three Generic 0{p} cards do not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [dreadScreamerRed],
        graveyard: [nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(dreadScreamerRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Levia).toHaveAP(0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [dreadScreamerRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Levia.defendWith([dreadScreamerRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Levia).toHaveLife(19);
  });
});
