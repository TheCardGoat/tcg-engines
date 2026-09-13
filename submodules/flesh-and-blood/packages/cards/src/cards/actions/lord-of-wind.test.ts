import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { lordOfWindBlue } from "./lord-of-wind.ts";

/**
 * Lord of Wind, Blue (WTR081) — Ninja Attack Action. Katsu Specialization.
 *
 * Printed: Combo — If Mugenshi: RELEASE was the last attack this combat chain,
 * as an additional cost you may pay any amount of {r}. If you do, shuffle that
 * many named combo cards from GY into deck, then this gains that much {p}.
 * (cost 0, 2{p}, 3{d})
 */

describe("Lord of Wind (WTR081) AAA", () => {
  it("happy: declining the optional X still attacks at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [lordOfWindBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.attackWith(lordOfWindBlue);
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(18);
    expectFabCard(Katsu, lordOfWindBlue).toBeIn("graveyard");
  });

  it("boundary: specialization is deckbuilding-only — Dash can still play it in-match", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lordOfWindBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: katsu, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(lordOfWindBlue);
    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Dash, lordOfWindBlue).toBeIn("combatChain");
  });

  it("timing: Katsu specialization — the attack is legal for Katsu at 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [lordOfWindBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.attackWith(lordOfWindBlue);
    expectCombat(game).toHaveAttackPower(2);
  });
});
