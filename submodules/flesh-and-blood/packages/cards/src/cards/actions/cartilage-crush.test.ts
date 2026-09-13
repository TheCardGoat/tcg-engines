import { describe, expect, it } from "vitest";
import { FabTestEngine, FAB_MANUAL_HARNESS } from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { nimblismRed } from "./nimblism.ts";
import { disableRed } from "./disable.ts";
import { cartilageCrushRed } from "./cartilage-crush.ts";

describe("Cartilage Crush family AAA", () => {
  it("happy: unblocked 7 dmg → crush fires (≥4 dealt to hero)", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [cartilageCrushRed], resourcePoints: 3, deck: 6 },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(cartilageCrushRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(33); // 40 - 7
  });

  it("boundary: blocked so 0 dmg to hero → no crush trigger", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [cartilageCrushRed], resourcePoints: 3, deck: 6 },
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

    Bravo.attackWith(cartilageCrushRed);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(40); // no damage → no crush
  });

  it("timing: crushed hero's first action next turn costs +1{r}; a later action does not", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [cartilageCrushRed], resourcePoints: 3, deck: 6 },
      {
        hero: dash,
        life: 40,
        hand: [nimblismBlue, nimblismRed, disableRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(cartilageCrushRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    Dash.must.pitch(disableRed).play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    expect(Dash.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Dash.resourcePoints()).toBe(0);

    Dash.play(nimblismRed);
    game.helpers.resolveUntilIdle();
    // Turn 1 refills Dash from 3 to 4 under CR 4.4.3f.
    expect(Dash.zone("hand")).toHaveLength(1);
  });
});
