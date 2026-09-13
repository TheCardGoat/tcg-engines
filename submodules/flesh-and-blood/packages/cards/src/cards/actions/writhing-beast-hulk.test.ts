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
import { writhingBeastHulkRed } from "./writhing-beast-hulk.ts";

/**
 * Writhing Beast Hulk, Red (LEV016) — dominate if a 6+{p} card is banished this way.
 */

describe("Writhing Beast Hulk family AAA", () => {
  it("happy: banishing a 6{p} card this way grants dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [writhingBeastHulkRed],
        graveyard: [skullCrackRed, nimblismBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(writhingBeastHulkRed);
    expectCombat(game).toHaveKeyword("dominate");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: three Generic 0{p} cards do not grant dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [writhingBeastHulkRed],
        graveyard: [nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.attackWith(writhingBeastHulkRed);
    expectCombat(game).notToHaveKeyword("dominate");
    Dash.defendWith([snatchRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [writhingBeastHulkRed],
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
    Levia.defendWith([writhingBeastHulkRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Levia).toHaveLife(19);
  });
});
