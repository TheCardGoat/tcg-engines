import { describe, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { rejuvenateRed } from "../actions/rejuvenate.ts";
import { rejuvenateYellow } from "../actions/rejuvenate.ts";
import { vestigeOfFlagellation } from "./vestige-of-flagellation.ts";

describe("Vestige of Flagellation (PEN191) AAA", () => {
  it("happy: the opponent's first gain is redirected as your loss plus Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [rejuvenateRed],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, chest: [vestigeOfFlagellation], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(rejuvenateRed);

    expectFabPlayer(Blaze).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 3);
  });

  it("boundary: only the first gain each turn is replaced", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [rejuvenateRed, rejuvenateYellow],
        resourcePoints: 2,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, chest: [vestigeOfFlagellation], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(rejuvenateRed);
    Blaze.play(rejuvenateYellow);

    // First gain redirected (Dash 17); yellow's printed 2{h} applies to Blaze.
    expectFabPlayer(Blaze).toHaveLife(22);
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 3);
  });
});
