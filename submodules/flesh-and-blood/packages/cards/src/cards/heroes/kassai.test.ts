import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { kassai } from "./kassai.ts";
import { hotStreak } from "../weapons/hot-streak.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

/**
 * Hero behavior acceptance test — Kassai (HVY091).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic (a): drawn a card this turn → sword attacks cost {r} less
 * - Core mechanic (b): banish 2 red + 2 yellow from GY → Gold on next weapon hit
 * - Boundaries: no draw → no discount; insufficient GY → can't activate
 *
 * Signature weapon: Hot Streak (HVY095)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

describe("kassai (HVY091)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero: kassai, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(kassai)).toHaveLife(20);
  });

  it("core mechanic: drawing a card this turn discounts sword attacks by {r}", () => {
    // Tome of Fyendal draws → sword cost reduced from 1 to 0.
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [hotStreak],
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1, // 1 for Tome; sword becomes free after discount
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kassai = game.as(kassai);

    // Play Tome of Fyendal → draws a card → sets "drawn-a-card-this-turn".
    Kassai.must.play(tomeOfFyendalYellow);
    game.passBoth();
    expectFabPlayer(Kassai).toHaveResourceCount(0); // the draw cost the last {r}

    // Now activate Hot Streak — should cost {r} less = 0 despite 0 RP.
    Kassai.activate(hotStreak);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(2); // Hot Streak base power
    expectFabPlayer(Kassai).toHaveResourceCount(0);
  });

  it("boundaries: without drawing this turn, the sword costs its normal {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [hotStreak],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kassai = game.as(kassai);

    // No draw this turn → no discount → the sword's {r} is still owed.
    Kassai.activate(hotStreak);
    expectWait(game).toHaveDecision("payment");
    expectCombat(game).toBeClosed();
  });

  it("boundary: the Gold ability is rejected without 2 red AND 2 yellow in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [hotStreak],
        graveyard: [
          snatchRed, // red
          snatchRed, // red
          tomeOfFyendalYellow, // yellow
          nimblismBlue, // blue — not either required color
        ],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Kassai = game.as(kassai);

    // 2 red but only 1 yellow → the banish cost cannot be paid.
    Kassai.expectActivationRejected(kassai);
  });

  it("core mechanic: banish 2 red + 2 yellow from graveyard → Gold on the next weapon hit", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [hotStreak],
        graveyard: [
          snatchRed, // red
          snatchRed, // red
          tomeOfFyendalYellow, // yellow
          tomeOfFyendalYellow, // yellow
        ],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kassai = game.as(kassai);

    Kassai.activate(kassai);
    game.passBoth();
    Kassai.activate(hotStreak);
    game.helpers.resolveRestOfCombat();

    // The first weapon hit that turn pays the delayed trigger with a Gold.
    expectFabPlayer(Kassai).toHaveTokenCount("gold", 1);
  });

  it("signature weapon: Hot Streak (HVY095) attacks for 1{r} at power 2", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [hotStreak],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kassai = game.as(kassai);

    Kassai.activate(hotStreak);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(2);
  });
});
