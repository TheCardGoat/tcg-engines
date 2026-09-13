import { describe, expect, it } from "vitest";
import { FabTestEngine, FAB_MANUAL_HARNESS } from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { disableRed } from "./disable.ts";

describe("Disable family AAA", () => {
  it("happy: unblocked 9 dmg → crush moves arsenal card to deck bottom", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [disableRed], resourcePoints: 5, deck: 6 },
      { hero: dash, life: 40, arsenal: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(disableRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Dash.life()).toBe(31); // 40 - 9
    // Arsenal card moved to bottom of deck
    expect(Dash.zone("arsenal")).toHaveLength(0);
  });

  it("boundary: blocked below 4 dmg → arsenal card stays", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [disableRed], resourcePoints: 5, deck: 6 },
      {
        hero: dash,
        life: 40,
        arsenal: [nimblismBlue],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(disableRed);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arsenal")).toHaveLength(1);
  });

  it("timing: crushed arsenal card is at the bottom of the deck", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [disableRed], resourcePoints: 5, deck: 6 },
      {
        hero: dash,
        life: 40,
        arsenal: [nimblismBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(disableRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Dash.zone("arsenal")).toHaveLength(0);
    // Deck arrays are bottom-first (index 0 = bottom; draw pops the last index).
    expect(Dash.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
  });
});
