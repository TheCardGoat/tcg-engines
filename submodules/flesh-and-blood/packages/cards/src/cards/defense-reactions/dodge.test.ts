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
import { dodgeBlue } from "./dodge.ts";

describe("Dodge (RVD026) AAA", () => {
  it("happy: plays as a 2{d} defense reaction", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [dodgeBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Bravo.play(dodgeBlue);
    game.passBoth();

    expectFabCard(Bravo, dodgeBlue).toHaveDefense(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("boundary: cannot play this outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [dodgeBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(bravo).play(dodgeBlue),
      /not legal in the current reaction step/i,
    );
    expectFabCard(game.as(bravo), dodgeBlue).toBeIn("hand");
  });

  it("timing: after combat this is in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [dodgeBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Bravo.play(dodgeBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, dodgeBlue).toBeIn("graveyard");
  });
});
