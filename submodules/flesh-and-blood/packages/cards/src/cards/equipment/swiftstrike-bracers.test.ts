import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { swiftstrikeBracers } from "./swiftstrike-bracers.ts";

describe("Swiftstrike Bracers (SEA183) AAA", () => {
  it("happy: after playing a Nimblism, destroy this so the next attack gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [swiftstrikeBracers],
        hand: [nimblismBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Dash.activate(swiftstrikeBracers);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, swiftstrikeBracers).toBeIn("graveyard");

    Dash.attackWith(snatchRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: cannot activate without playing a Nimblism this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, arms: [swiftstrikeBracers], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(swiftstrikeBracers);
    expectFabCard(Dash, swiftstrikeBracers).toBeIn("arms");
  });
});
