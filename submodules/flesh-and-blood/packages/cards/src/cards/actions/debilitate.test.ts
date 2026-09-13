import { describe, expect, it } from "vitest";
import { FabTestEngine, FAB_MANUAL_HARNESS } from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { scourTheBattlescapeYellow } from "./scour-the-battlescape.ts";
import { debilitateRed } from "./debilitate.ts";

describe("Debilitate family AAA", () => {
  it("happy: unblocked 8 dmg → crush fires (≥4 dealt to hero)", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [debilitateRed], resourcePoints: 4, deck: 6 },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(debilitateRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(32); // 40 - 8
  });

  it("boundary: blocked below 4 dmg → no crush trigger", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [debilitateRed], resourcePoints: 4, deck: 6 },
      {
        hero: dash,
        life: 40,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(debilitateRed);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(40);
  });

  it("timing: crushed hero's first attack next turn gets -2{p}; a later attack does not", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [debilitateRed], resourcePoints: 4, deck: 6 },
      {
        hero: dash,
        life: 40,
        arsenal: [scourTheBattlescapeYellow],
        hand: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(debilitateRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    Dash.attackWith(scourTheBattlescapeYellow, { from: "arsenal" });
    expect(game.combat()?.activeLink?.attackPower).toBe(0);
    game.helpers.resolveRestOfCombat();

    Dash.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
