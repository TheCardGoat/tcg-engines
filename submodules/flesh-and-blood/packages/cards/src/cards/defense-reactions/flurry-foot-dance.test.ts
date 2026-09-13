import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { flurryFootDanceYellow } from "./flurry-foot-dance.ts";

/**
 * Flurry Foot Dance Yellow (AHA016) — Warrior Defense Reaction.
 *
 * Printed: While this is defending, if you control a Flurry token, this
 * gets +2{d}.
 */

describe("Flurry Foot Dance (AHA016) AAA", () => {
  it("happy: with a Flurry token seated, the block is +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: katsu,
        hand: [flurryFootDanceYellow],
        arena: [fabToken("flurry")],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Katsu = game.as(katsu);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Katsu.play(flurryFootDanceYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Katsu).toHaveLife(20); // 4 - (2 + 2) full block
  });

  it("boundary: without the token it blocks for its printed 2", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: katsu,
        hand: [flurryFootDanceYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Katsu = game.as(katsu);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Katsu.play(flurryFootDanceYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Katsu).toHaveLife(18); // 20 - (4 - 2)
  });
});
