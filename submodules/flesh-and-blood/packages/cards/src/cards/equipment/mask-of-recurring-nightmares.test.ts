import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { nuuAlluringDesire } from "../heroes/nuu-alluring-desire.ts";
import { dash } from "../heroes/dash.ts";
import { kissOfDeathRed } from "../actions/kiss-of-death.ts";
import { snatchRed } from "../actions/snatch.ts";
import { maskOfRecurringNightmares } from "./mask-of-recurring-nightmares.ts";

/**
 * Mask of Recurring Nightmares — Mystic Assassin Head d2 Blade Break.
 *
 * Printed: "Once per Turn Attack Reaction - {c}{c}{c}: Target defending hero
 * banishes a card from their hand. Blade Break"
 */

describe("Mask of Recurring Nightmares AAA", () => {
  it("happy: the attack reaction makes the defending hero banish from their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: nuuAlluringDesire,
        head: [maskOfRecurringNightmares],
        hand: [kissOfDeathRed],
        chiPoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuuAlluringDesire);
    const Dash = game.as(dash);

    Nuu.playAttack(kissOfDeathRed);
    Dash.defendWith(); // decline blocks; the AR still plays
    game.toReaction("attacker");
    Nuu.activate(maskOfRecurringNightmares);
    game.passBoth(); // resolve the AR layer
    Dash.target(snatchRed); // the defending hero picks what to banish
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, Dash.cardIn("banished", snatchRed)).toBeIn("banished");
    expectFabCard(Nuu, maskOfRecurringNightmares).toBeIn("head");
  });

  it("timing: once per turn — a second banish reaction is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: nuuAlluringDesire,
        head: [maskOfRecurringNightmares],
        hand: [kissOfDeathRed],
        chiPoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuuAlluringDesire);
    const Dash = game.as(dash);

    Nuu.playAttack(kissOfDeathRed);
    Dash.defendWith();
    game.toReaction("attacker");
    Nuu.activate(maskOfRecurringNightmares);
    game.passBoth();
    Dash.target(snatchRed);
    game.helpers.resolveRestOfCombat();

    Nuu.expectActivationRejected(maskOfRecurringNightmares);
    expectFabCard(Nuu, maskOfRecurringNightmares).toBeIn("head");
  });
});
