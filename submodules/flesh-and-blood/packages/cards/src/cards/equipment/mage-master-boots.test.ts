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
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { mageMasterBoots } from "./mage-master-boots.ts";

describe("Mage Master Boots (ARC154) AAA", () => {
  it("happy: destroy this so the next non-attack action gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [mageMasterBoots],
        hand: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(mageMasterBoots);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, mageMasterBoots).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: an attack action played after this is not the granted recipient", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [mageMasterBoots],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(mageMasterBoots);
    game.helpers.resolveUntilIdle();
    Dash.attackWith(snatchRed);
    game.passBoth();

    expectCombat(game).notToHaveKeyword("go-again");
  });
});
