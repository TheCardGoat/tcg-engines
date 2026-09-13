import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "./bravo.ts";
import { boomGrenadeYellow } from "../actions/boom-grenade.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dashDatabase } from "./dash-database.ts";

/**
 * Dash Database (EVO002) — Mechanologist Hero Young 18hp.
 *
 * Printed: You may look at the top card of your deck at any time. You may
 * play a Mechanologist item with cost 0 or 1 from the top of your deck as
 * though it were an instant. It costs an additional {r} to play.
 *
 * The look-at-any-time static is viewer-facing. The in-match proof is the
 * deck-top Instant item permission (`play(..., { from: "deck" })`).
 */

describe("Dash Database (EVO002) AAA", () => {
  it("happy: play a cost-0 Mechanologist item from the top of the deck as an Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: dashDatabase,
        hand: [],
        resourcePoints: 1,
        actionPoints: 0,
        deckTop: [boomGrenadeYellow],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dashDatabase);

    Dash.play(boomGrenadeYellow, { from: "deck" });
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, boomGrenadeYellow).toBeIn("arena");
  });

  it("boundary: the extra {r} must be paid, and a non-item cannot come off the top", () => {
    const game = FabTestEngine.start(
      {
        hero: dashDatabase,
        hand: [],
        resourcePoints: 0,
        actionPoints: 0,
        deckTop: [boomGrenadeYellow],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dashDatabase);

    expectFabUnplayable(
      () => Dash.play(boomGrenadeYellow, { from: "deck" }),
      /resource cost cannot be paid|couldn't be played/i,
    );

    const noItem = FabTestEngine.start(
      {
        hero: dashDatabase,
        hand: [],
        resourcePoints: 1,
        actionPoints: 0,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabUnplayable(
      () => noItem.as(dashDatabase).play(snatchRed, { from: "deck" }),
      /migrated permission|cannot be played|couldn't be played/i,
    );
  });

  it("timing: the deck-top item may be played as an Instant on the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dashDatabase,
        hand: [],
        resourcePoints: 1,
        actionPoints: 0,
        deckTop: [boomGrenadeYellow],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dashDatabase);

    Bravo.pass();
    Dash.play(boomGrenadeYellow, { from: "deck" });
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, boomGrenadeYellow).toBeIn("arena");
  });
});
