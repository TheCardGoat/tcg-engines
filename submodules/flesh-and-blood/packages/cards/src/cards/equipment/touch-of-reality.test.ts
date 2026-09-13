import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { touchOfReality } from "./touch-of-reality.ts";

describe("Touch of Reality (PEN122) AAA", () => {
  it("happy: ward 2 latches for the turn and absorbs 2 of 5 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, arms: [touchOfReality], resourcePoints: 2, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.pass();
    Dash.activate(touchOfReality);
    Dash.chooseNumeric(2);
    Blaze.play(volticBoltRed, { target: Dash.id });

    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: without the activation the bolt lands for the full 5", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, arms: [touchOfReality], resourcePoints: 2, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, touchOfReality).toBeIn("arms");
  });

  it("timing: the activated piece destroys itself at the beginning of the end phase", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [], deck: 6 },
      { hero: dash, arms: [touchOfReality], resourcePoints: 2, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.pass();
    Dash.activate(touchOfReality);
    Dash.chooseNumeric(1);
    Blaze.endTurn();

    expectFabCard(Dash, touchOfReality).toBeIn("graveyard");
  });
});
