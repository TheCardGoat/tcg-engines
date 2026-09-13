import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, nimblismBlue, snatchRed, swingBigRed } from "../../../fixtures.ts";

import { stonewallImpasse } from "../../../../../../cards/src/cards/equipment/stonewall-impasse.ts";
import { bravo } from "../../../../../../cards/src/cards/heroes/bravo.ts";

describe("stonewall-impasse (HVY052)", () => {
  it("clashes when it defends and gains +1 defense for a winning clash", () => {
    // Deck arrays are [bottom … top]. Dash reveals Swing Big (8) against
    // Bravo's Nimblism (0), so the printed conditional grants +1 defense.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        arms: [stonewallImpasse],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, swingBigRed],
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.attackWith(snatchRed);
    Dash.defendWith(stonewallImpasse);
    game.passBoth();
    expect(game.getState().lastClashWinnerId).toBe(Dash.id);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − Stonewall Impasse (1 + the winning-clash bonus 1) = 2.
    expect(Dash.life()).toBe(lifeBefore - 2);
  });

  it("does not receive the defense bonus when it loses the clash", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, swingBigRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        arms: [stonewallImpasse],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.attackWith(snatchRed);
    Dash.defendWith(stonewallImpasse);
    game.helpers.resolveRestOfCombat();

    // The clash loss leaves the printed base defense of 1: 4 − 1 = 3.
    expect(Dash.life()).toBe(lifeBefore - 3);
  });

  it("does not clash when a different card defends", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, swingBigRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        arms: [stonewallImpasse],
        hand: [nimblismBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, swingBigRed],
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.attackWith(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // Stonewall did not defend, so its trigger must not create a clash.
    expect(game.getState().lastClashWinnerId).toBeNull();
    expect(Dash.life()).toBe(lifeBefore - 2);
  });
});
