import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { goliathGauntlet } from "./goliath-gauntlet.ts";
import { disableRed } from "../actions/disable.ts";
import { snatchRed } from "../actions/snatch.ts";

describe("Goliath Gauntlet (BVO006) AAA", () => {
  it("happy: activate destroys self; next cost-2+ attack action gains +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        arms: [goliathGauntlet],
        hand: [disableRed],
        actionPoints: 1,
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    // Activate gauntlet (destroy-self, go again, +2{p} to next cost-2+ attack action)
    Bravo.activate(goliathGauntlet);
    game.passBoth();

    expectFabCard(Bravo, goliathGauntlet).toBeIn("graveyard");

    // Attack with disableRed (cost 5 ≥ 2)
    Bravo.attackWith(disableRed);
    expectCombat(game).toHaveAttackPower(11); // 9 + 2
  });

  it("boundary: cost-0 attack action does NOT get +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        arms: [goliathGauntlet],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.activate(goliathGauntlet);
    game.passBoth();

    // Snatch is cost 0 / power 4 — filter is cost ≥ 2, so no buff
    Bravo.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the AP spent on activation", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, arms: [goliathGauntlet], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.activate(goliathGauntlet);
    game.passBoth();

    // Go again refunded the 1 AP spent on activate
    expect(Bravo.actionPoints()).toBe(1);
  });
});
