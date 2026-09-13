import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { pleiades } from "../heroes/pleiades.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bootsToTheBoards } from "./boots-to-the-boards.ts";

/**
 * Boots to the Boards (APS007) — Revered Legs d0, Temper.
 * Printed: "When this defends, you may pay up to {r}{r}{r}. Create that many
 * Toughness tokens."
 */

describe("Boots to the Boards (APS007) AAA", () => {
  it("happy: paying 3 while defending creates 3 Toughness tokens", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: pleiades,
        legs: [bootsToTheBoards],
        life: 20,
        resourcePoints: 3,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Pleiades = game.as(pleiades);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Pleiades.defendWith(bootsToTheBoards);
    game.passBoth(); // surfaces the defend trigger
    Pleiades.accept();
    Pleiades.chooseNumeric(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Pleiades).toHaveTokenCount("toughness", 3);
    expectFabPlayer(Pleiades).toHaveResourceCount(0);
  });

  it("boundary: declining pays nothing and creates no tokens", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: pleiades,
        legs: [bootsToTheBoards],
        life: 20,
        resourcePoints: 3,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Pleiades = game.as(pleiades);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Pleiades.defendWith(bootsToTheBoards);
    game.passBoth();
    Pleiades.decline();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Pleiades).toHaveTokenCount("toughness", 0);
    expectFabPlayer(Pleiades).toHaveResourceCount(3);
  });

  it("timing: the pay is capped by the resources actually held", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: pleiades,
        legs: [bootsToTheBoards],
        life: 20,
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Pleiades = game.as(pleiades);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Pleiades.defendWith(bootsToTheBoards);
    game.passBoth();
    Pleiades.accept();
    Pleiades.chooseNumeric(1);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Pleiades).toHaveTokenCount("toughness", 1);
    expectFabPlayer(Pleiades).toHaveResourceCount(0);
  });
});
