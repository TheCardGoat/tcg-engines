import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { fryRed } from "../actions/fry.ts";
import { snatchRed } from "../actions/snatch.ts";
import { fateForeseenRed } from "./fate-foreseen.ts";

/**
 * Fate Foreseen (1HP405) — Generic Defense Reaction, 3{d}.
 * Printed: "Opt 1" — look at the top card of your deck; you may put it on the
 * bottom of your deck.
 */

describe("Fate Foreseen family AAA", () => {
  it("happy: Opt 1 while defending can send the deck top to the bottom", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [fateForeseenRed],
        deck: [fryRed, snatchRed, fryRed, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    // Deck top is the seeded last entry (snatch); Opt 1 puts it on the bottom.
    Dash.play(fateForeseenRed);
    game.advanceUntil({
      stopAt: "idle",
      optionals: "decline",
      ordering: "listed",
      entityTargets: "minimum",
      optBottom: 1,
    });

    expect(Dash.zone("deck").at(-1)).toBe(fryRed.canonicalId);
    expect(Dash.zone("deck")[0]).toBe(snatchRed.canonicalId);
    expectFabCard(Dash, fateForeseenRed).toBeIn("graveyard");
  });

  it("boundary: declining the opt leaves the deck top in place", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [fateForeseenRed],
        deck: [fryRed, snatchRed, fryRed, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    Dash.play(fateForeseenRed);
    game.advanceUntil({
      stopAt: "idle",
      optionals: "decline",
      ordering: "listed",
      entityTargets: "minimum",
      optBottom: 0,
    });

    expect(Dash.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
    expectFabCard(Dash, fateForeseenRed).toBeIn("graveyard");
  });

  it("timing: cannot be played outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [fateForeseenRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(bravo).play(fateForeseenRed),
      /cannot be played|not legal|reaction/i,
    );
    expectFabCard(game.as(bravo), fateForeseenRed).toBeIn("hand");
  });
});
