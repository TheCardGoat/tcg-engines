import { describe, it } from "vitest";
import { expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { willOfArcanaBlue } from "./will-of-arcana.ts";

describe("Will of Arcana (ROS000) AAA", () => {
  it("happy: pitching this amps the next arcane packet by 1", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [willOfArcanaBlue, volticBoltRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: pitching a non-Gem blue does not amp", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [nimblismBlue, volticBoltRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
