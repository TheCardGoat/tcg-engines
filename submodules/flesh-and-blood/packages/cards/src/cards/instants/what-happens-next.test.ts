import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { whatHappensNextBlue } from "./what-happens-next.ts";

/**
 * What Happens Next? Blue (APS029) — Guardian Instant Aura (Suspense).
 *
 * Printed: The first card with cost 1 or more you play each turn costs {r} less to play.
 */

describe("What Happens Next? (APS029) AAA", () => {
  it("happy: the first cost-1+ card this turn plays for 1{r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [whatHappensNextBlue, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(whatHappensNextBlue);
    game.passBoth();
    expectFabCard(Bravo, whatHappensNextBlue).toBeIn("arena");

    Bravo.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: a cost-0 card does not consume the discount", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [whatHappensNextBlue, snatchRed, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(whatHappensNextBlue);
    game.passBoth();
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    Bravo.attackWith(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("timing: a second cost-1+ card the same turn pays full cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [whatHappensNextBlue, brutalAssaultBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(whatHappensNextBlue);
    game.passBoth();
    Bravo.attackWith(Bravo.cardsIn("hand", brutalAssaultBlue)[0]!);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveResourceCount(1);

    expect(() => Bravo.attackWith(brutalAssaultBlue)).toThrow();
  });
});
