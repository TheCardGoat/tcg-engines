import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { uzuri } from "../heroes/uzuri.ts";
import { dash } from "../heroes/dash.ts";
import { kissOfDeathRed } from "../actions/kiss-of-death.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { headShotBlue } from "../actions/head-shot.ts";
import { maskOfShiftingPerspectives } from "./mask-of-shifting-perspectives.ts";

/**
 * Mask of Shifting Perspectives — Assassin / Ninja Head d1 Blade Break.
 *
 * Printed: "Attack Reaction - Destroy Mask of Shifting Perspectives: Whenever
 * a dagger hits this turn, you may put a card from your hand on the bottom of
 * your deck. If you do, draw a card."
 */

describe("Mask of Shifting Perspectives AAA", () => {
  it("happy: after the AR, a dagger hit sinks a hand card to the deck bottom and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        head: [maskOfShiftingPerspectives],
        hand: [kissOfDeathRed, nimblismBlue, snatchRed],
        deck: [headShotBlue],
        actionPoints: 2,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.playAttack(kissOfDeathRed); // Dagger attack
    Dash.defendWith();
    game.toReaction("attacker");
    Uzuri.activate(maskOfShiftingPerspectives);
    game.passBoth(); // resolve the AR: mask destroyed, delayed trigger armed
    game.closeCombat({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
    Uzuri.target(nimblismBlue); // sink this card to the deck bottom
    game.helpers.resolveRestOfCombat();

    // The dagger hit: nimblism went to the deck bottom, head-shot was drawn.
    expectFabCard(Uzuri, Uzuri.cardIn("deck", nimblismBlue)).toBeIn("deck");
    expectFabCard(Uzuri, headShotBlue).toBeIn("hand");
    expectFabPlayer(Uzuri).toHaveHandCount(2); // snatch + drawn head-shot
    expectFabCard(Uzuri, maskOfShiftingPerspectives).toBeIn("graveyard");
  });

  it("boundary: declining the optional sinks nothing and draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        head: [maskOfShiftingPerspectives],
        hand: [kissOfDeathRed, nimblismBlue],
        deck: [headShotBlue],
        actionPoints: 2,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.playAttack(kissOfDeathRed);
    Dash.defendWith();
    game.toReaction("attacker");
    Uzuri.activate(maskOfShiftingPerspectives);
    game.passBoth();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Uzuri).toHaveHandCount(1); // only nimblism, no draw
    expectFabCard(Uzuri, Uzuri.cardIn("deck", headShotBlue)).toBeIn("deck");
  });
});
