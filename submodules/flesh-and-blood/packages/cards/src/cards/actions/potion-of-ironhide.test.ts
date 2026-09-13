import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { potionOfIronhideBlue } from "./potion-of-ironhide.ts";

describe("Potion of Ironhide (EVR186) AAA", () => {
  it("happy: Instant destroy this gives owned attack actions +1{d} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [potionOfIronhideBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, snatchRed).toHaveDefense(2);
    Dash.activate(potionOfIronhideBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, potionOfIronhideBlue).toBeIn("graveyard");
    expectFabCard(Dash, snatchRed).toHaveDefense(3);
  });

  it("boundary: an opposing attack action does not gain +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [potionOfIronhideBlue],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], deck: 6 },
    );

    game.as(dash).activate(potionOfIronhideBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(game.as(bravo), snatchRed).toHaveDefense(2);
  });

  it("timing: the +1{d} expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [potionOfIronhideBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(potionOfIronhideBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, snatchRed).toHaveDefense(3);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, snatchRed).toHaveDefense(2);
  });
});
