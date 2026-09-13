import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { ponder } from "../tokens/ponder.ts";
import { tomeOfFyendalYellow } from "./tome-of-fyendal.ts";
import { sigilOfTheMuseRed } from "./sigil-of-the-muse.ts";
describe("Sigil of the Muse preview behavior", () => {
  for (const own of [true, false]) {
    it(`replaces a two-card action-phase draw for ${own ? "its controller" : "the opponent"}`, () => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          hand: [tomeOfFyendalYellow],
          arena: own ? [sigilOfTheMuseRed] : [],
          resourcePoints: 1,
          deck: 6,
        },
        { hero: kano, hand: [], arena: own ? [] : [sigilOfTheMuseRed], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const drawer = game.as(dash);
      drawer.play(tomeOfFyendalYellow);
      game.untilIdle();
      expectFabPlayer(drawer).toHaveHandCount(0).toHaveTokenCount("ponder", 2);
      expectFabPlayer(game.as(kano)).toHaveTokenCount("ponder", 0);
    });
  }
  it("allows Ponder and intellect draws in the end phase", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [], arena: [sigilOfTheMuseRed, ponder], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(kano).endTurn();
    game.untilIdle();
    expectFabPlayer(game.as(kano)).toHaveHandCount(4).toHaveTokenCount("ponder", 0);
    expectFabCard(game.as(kano), sigilOfTheMuseRed).toBeIn("arena");
  });
  it("destroys itself and creates one Ponder at its controller's next action phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: kano, hand: [], arena: [sigilOfTheMuseRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(game.as(kano), sigilOfTheMuseRed).toBeIn("graveyard");
    expectFabPlayer(game.as(kano)).toHaveTokenCount("ponder", 1);
  });
});
