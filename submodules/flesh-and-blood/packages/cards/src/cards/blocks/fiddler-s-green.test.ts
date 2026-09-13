import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { fiddlerSGreenRed } from "./fiddler-s-green.ts";

describe("Fiddler's Green (AGB013) AAA", () => {
  it("happy: defending puts this into the graveyard and gains 3{h}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [fiddlerSGreenRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    Dash.defendWith(fiddlerSGreenRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, fiddlerSGreenRed).toBeIn("graveyard");
    // 4{p} − 1{d} = 3 damage, then the put-into-graveyard trigger gains 3{h}.
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [fiddlerSGreenRed], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(fiddlerSGreenRed)).toThrow();
    expectFabCard(game.as(dash), fiddlerSGreenRed).toBeIn("hand");
  });
});
