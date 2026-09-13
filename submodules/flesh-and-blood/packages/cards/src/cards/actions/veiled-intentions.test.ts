import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";
import { veiledIntentionsRed } from "./veiled-intentions.ts";

/**
 * Veiled Intentions (EVR150) — Illusionist Action, cost 1, go again.
 *
 * Printed: The next attack action card you play this turn is Illusionist in
 * addition to its other card, and gains +4{p}, phantasm, and "When this is
 * destroyed, draw a card."
 */

describe("Veiled Intentions (EVR150) AAA", () => {
  it("happy: the next attack action gains +4{p} and phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [veiledIntentionsRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(veiledIntentionsRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Prism).toHaveAP(1);

    Prism.playAttack(snatchRed);
    // Snatch 4 + 4.
    expectCombat(game).toHaveAttackPower(8);
    expectCombat(game).toHaveKeyword("phantasm");
  });

  it("timing: a p6 attack-action defender phantasm-destroys it and draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [veiledIntentionsRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, life: 20, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(veiledIntentionsRed);
    game.helpers.resolveUntilIdle();
    Prism.playAttack(snatchRed);
    Dash.defendWith(regurgitatingSlogRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, snatchRed).toBeIn("graveyard");
    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(20);
    expect(Prism.zone("hand")).toContain(nimblismBlue.canonicalId);
  });
});
