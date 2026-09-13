import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { springboardSomersaultYellow } from "./springboard-somersault.ts";

describe("Springboard Somersault (IRA012) AAA", () => {
  it("happy: played from arsenal this gets +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [],
        arsenal: [springboardSomersaultYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Bravo.play(springboardSomersaultYellow, { from: "arsenal" });
    game.passBoth();
    game.passBoth();

    expectFabCard(Bravo, springboardSomersaultYellow).toHaveDefense(4);
  });

  it("boundary: played from hand it stays printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [springboardSomersaultYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Bravo.play(springboardSomersaultYellow);

    expectFabCard(Bravo, springboardSomersaultYellow).toHaveDefense(2);
  });

  it("timing: cannot play Springboard Somersault outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [springboardSomersaultYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(bravo).play(springboardSomersaultYellow),
      /not legal in the current reaction step/i,
    );
    expectFabCard(game.as(bravo), springboardSomersaultYellow).toBeIn("hand");
  });
});
