import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { staticShockRed } from "../actions/static-shock.ts";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { markOfLightning } from "./mark-of-lightning.ts";

/**
 * Mark of Lightning — Lightning Arms d0.
 *
 * Printed: Whenever a Lightning or Elemental attack you control is defended
 * by a card from hand, you may destroy this. If you do, the attack deals 1
 * damage to the defending hero.
 */

describe("Mark of Lightning AAA", () => {
  it("happy: a hand-blocked Elemental attack may destroy this and deal 1", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        arms: [markOfLightning],
        hand: [staticShockRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.playAttack(staticShockRed);
    Dash.defendWith(nimblismBlue);
    Kano.pass();
    Dash.pass();
    game.closeCombat({ optionals: "accept" });

    expectFabCard(Kano, markOfLightning).toBeIn("graveyard");
    // Static Shock 4 vs Nimblism 2{d} = 2, plus the Mark's 1.
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: a non-Elemental attack does not fire the Mark", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        arms: [markOfLightning],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.playAttack(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "accept" });

    expectFabCard(Kano, markOfLightning).toBeIn("arms");
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
