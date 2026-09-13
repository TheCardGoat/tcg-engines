import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { holdTheLineBlue } from "./hold-the-line.ts";

describe("Hold the Line (DTD228) AAA", () => {
  it("happy: if the attacking hero has drawn 2+ this turn, prevent the next 3", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed, snatchRed],
        actionPoints: 3,
        deck: 6,
      },
      { hero: bravo, hand: [holdTheLineBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const snatches = Dash.cardsIn("hand", snatchRed);

    Dash.playAttack(snatches[0]!);
    Bravo.defendWith();
    game.closeCombat();
    Dash.playAttack(snatches[1]!);
    Bravo.defendWith();
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveLife(12);

    Dash.playAttack(snatches[2]!);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Bravo.play(holdTheLineBlue);
    game.closeCombat();

    expectFabCard(Bravo, holdTheLineBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(12);
  });

  it("boundary: if the attacking hero has not drawn 2 this turn, printed 2{d} only", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [holdTheLineBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Bravo.play(holdTheLineBlue);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("timing: cannot play this outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [holdTheLineBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(bravo).play(holdTheLineBlue),
      /not legal in the current reaction step/i,
    );
    expectFabCard(game.as(bravo), holdTheLineBlue).toBeIn("hand");
  });
});
