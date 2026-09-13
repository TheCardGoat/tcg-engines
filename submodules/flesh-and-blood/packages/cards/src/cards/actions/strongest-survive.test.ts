import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { frightmareRed } from "./frightmare.ts";
import { snatchRed } from "./snatch.ts";
import { strongestSurviveRed } from "./strongest-survive.ts";

/**
 * Strongest Survive Red (SUP135) — Brute Attack Action.
 *
 * Printed: When this hits a hero, they discard a card unless they reveal a
 * card from their hand with {p} greater than the damage dealt this way.
 */

describe("Strongest Survive (SUP135) AAA", () => {
  it("happy: a 7-damage hit forces a discard when no reveal qualifies", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [strongestSurviveRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(strongestSurviveRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(13); // 20 - 7
    expectFabCard(Dash, snatchRed).toBeIn("graveyard"); // 4{p} reveal cannot beat 7
  });

  it("boundary: revealing a 13{p} card beats the 7 damage and keeps the hand", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [strongestSurviveRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [frightmareRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(strongestSurviveRed);
    Dash.defendWith();
    // A 13{p} reveal beats the 7 damage: the target is exempt.
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: frightmareRed.canonicalId,
    });
    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Dash, snatchRed).toBeIn("hand"); // exempt
  });
});
