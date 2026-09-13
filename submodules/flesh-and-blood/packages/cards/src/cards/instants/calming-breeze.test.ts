import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { flashBoltRed } from "./flash-bolt.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { calmingBreezeRed } from "./calming-breeze.ts";

describe("Calming Breeze (HNT230) AAA", () => {
  it("happy: the next 3 damage instances this turn each prevent 1", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [flashBoltRed, flashBoltRed, flashBoltRed],
        resourcePoints: 6,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [calmingBreezeRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);
    const bolts = Blaze.cardsIn("hand", flashBoltRed);

    Blaze.play(bolts[0]!, { target: Dash.id });
    Blaze.pass();
    Dash.play(calmingBreezeRed);
    game.passBoth();
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(18);

    Blaze.play(bolts[1]!, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(16);

    Blaze.play(bolts[2]!, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, calmingBreezeRed).toBeIn("graveyard");
  });

  it("boundary: a 4th damage instance this turn is not reduced", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [flashBoltRed, flashBoltRed, flashBoltRed, flashBoltRed],
        resourcePoints: 8,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [calmingBreezeRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);
    const bolts = Blaze.cardsIn("hand", flashBoltRed);

    Blaze.play(bolts[0]!, { target: Dash.id });
    Blaze.pass();
    Dash.play(calmingBreezeRed);
    game.passBoth();
    game.passBoth();
    Blaze.play(bolts[1]!, { target: Dash.id });
    game.passBoth();
    Blaze.play(bolts[2]!, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(14);

    Blaze.play(bolts[3]!, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(11);
  });

  it("timing: prevention does not persist into the next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [flashBoltRed, nimblismBlue],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [calmingBreezeRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.pass();
    Dash.play(calmingBreezeRed);
    game.passBoth();
    Blaze.endTurn();
    Dash.endTurn();
    Blaze.play(flashBoltRed, { pitch: nimblismBlue, target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(17);
  });
});
