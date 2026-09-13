import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { yorickWeaverOfTales } from "../heroes/yorick-weaver-of-tales.ts";
import { talesOfAdventureBlue } from "./tales-of-adventure.ts";

/**
 * Tales of Adventure (LSS005) — Bard Action, Yorick Specialization.
 *
 * Printed: Each other hero chooses and creates a token that hasn't been
 * chosen from the listed set. You create a Copper, Silver, and Gold.
 *
 * CR 8.3.7 specialization is deckbuilding-only (pregame). 1v1 “each other
 * hero” is the opponent (`choose-and-create-token` chooser/controller opponent).
 */

describe("Tales of Adventure (LSS005) AAA", () => {
  it("happy: opponent creates the chosen listed token; you mint Copper, Silver, and Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: yorickWeaverOfTales,
        hand: [talesOfAdventureBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Yorick = game.as(yorickWeaverOfTales);
    const Dash = game.as(dash);

    Yorick.play(talesOfAdventureBlue);
    game.passBoth();
    Dash.choose("runechant");
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Yorick, talesOfAdventureBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("runechant", 1);
    expectFabPlayer(Yorick).toHaveTokenCount("copper", 1);
    expectFabPlayer(Yorick).toHaveTokenCount("silver", 1);
    expectFabPlayer(Yorick).toHaveTokenCount("gold", 1);
    expectFabPlayer(Yorick).toHaveTokenCount("runechant", 0);
  });

  it("boundary: specialization is deckbuilding-only — Dash can still play it", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [talesOfAdventureBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: yorickWeaverOfTales, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Yorick = game.as(yorickWeaverOfTales);

    Dash.play(talesOfAdventureBlue);
    game.passBoth();
    Yorick.choose("ponder");
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Dash, talesOfAdventureBlue).toBeIn("graveyard");
    expectFabPlayer(Yorick).toHaveTokenCount("ponder", 1);
    expectFabPlayer(Dash).toHaveTokenCount("copper", 1);
    expectFabPlayer(Dash).toHaveTokenCount("silver", 1);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 1);
  });

  it("timing: the listed token seats under the other hero, not the caster", () => {
    const game = FabTestEngine.start(
      {
        hero: yorickWeaverOfTales,
        hand: [talesOfAdventureBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Yorick = game.as(yorickWeaverOfTales);
    const Dash = game.as(dash);

    Yorick.play(talesOfAdventureBlue);
    game.passBoth();
    Dash.choose("spectral-shield");
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("spectral-shield", 1);
    expectFabPlayer(Yorick).toHaveTokenCount("spectral-shield", 0);
  });
});
