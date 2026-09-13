import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { chokeslamRed } from "../actions/chokeslam.ts";
import { staunchResponseRed } from "./staunch-response.ts";

describe("Staunch Response family AAA", () => {
  it("optional payment grants +3{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [chokeslamRed], resourcePoints: 4, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [staunchResponseRed], resourcePoints: 6, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.as(bravo).attackWith(chokeslamRed);
    game.toReaction("defender");
    Dash.must.playReaction(staunchResponseRed, { modeIndexes: [0] });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: declining the optional {r}{r}{r}{r} keeps the printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [chokeslamRed], resourcePoints: 4, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [staunchResponseRed], resourcePoints: 6, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.as(bravo).attackWith(chokeslamRed);
    game.toReaction("defender");
    Dash.must.playReaction(staunchResponseRed, { modeIndexes: [] });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(19); // 5{p} vs printed 4{d}
  });
});
