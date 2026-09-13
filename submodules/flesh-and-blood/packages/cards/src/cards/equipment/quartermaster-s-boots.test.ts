import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { shuckBlue } from "../actions/shuck.ts";
import { snatchRed } from "../actions/snatch.ts";
import { quartermasterSBoots } from "./quartermaster-s-boots.ts";

describe("Quartermaster's Boots (SEA185) AAA", () => {
  it("happy: pay {r}{r} and destroy this so the next non-attack action gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [quartermasterSBoots],
        hand: [shuckBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(quartermasterSBoots);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, quartermasterSBoots).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.play(shuckBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: 1{r} cannot pay the Action cost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [quartermasterSBoots],
        resourcePoints: 1,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(quartermasterSBoots);
    expectFabCard(Dash, quartermasterSBoots).toBeIn("legs");
  });

  it("timing: the next attack action does not receive the granted go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [quartermasterSBoots],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(quartermasterSBoots);
    game.helpers.resolveUntilIdle();
    Dash.attackWith(snatchRed);

    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
