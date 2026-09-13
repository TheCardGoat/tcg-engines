import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { aggressivePounceRed } from "./aggressive-pounce.ts";
import { nimblismBlue } from "./nimblism.ts";
import { tradeInBlue } from "./trade-in.ts";
import { riledUpRed } from "./riled-up.ts";

/**
 * Riled Up (CRU016) — Brute Action - Attack.
 * Printed: "If you've discarded a card with 6 or more {p} this turn, this
 * gets +1{p}."
 *
 * The discard is any discard earlier this turn (CR 1.11 turn scope), not a
 * cost of this card — Trade In (UPR214, "When this attacks, you may discard a
 * card. If you do, draw a card.") is the same-turn discard vehicle, and the
 * +1{p} reads on the attack at its Defend Step (CR 7.3.1).
 */

const nimblismDeck = [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
] as const;

describe("Riled Up (CRU016) AAA", () => {
  it("happy: a same-turn 6+{p} discard grants +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [tradeInBlue, aggressivePounceRed, riledUpRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: [...nimblismDeck],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    // Discard aggressivePounceRed (6{p}) this turn via Trade In's optional.
    Fai.play(tradeInBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: aggressivePounceRed.canonicalId,
    });

    Fai.attackWith(riledUpRed);
    expectCombat(game).toHaveAttackPower(8);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(11);
  });

  it("boundary: a sub-6{p} discard grants no bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [tradeInBlue, nimblismBlue, riledUpRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: [...nimblismDeck],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(tradeInBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: nimblismBlue.canonicalId,
    });

    Fai.attackWith(riledUpRed);
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12);
  });

  it("timing: a 6+{p} discard from LAST turn grants no bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [tradeInBlue, aggressivePounceRed, riledUpRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: [...nimblismDeck],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    // Turn 1: discard the 6{p} card.
    Fai.play(tradeInBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: aggressivePounceRed.canonicalId,
    });
    Fai.endTurn();
    game.as(dash).endTurn();
    game.helpers.untilIdle();

    // Turn 2: the discard history reset — base power only (CR 1.11).
    Fai.attackWith(riledUpRed, { pitch: [nimblismBlue] });
    expectCombat(game).toHaveAttackPower(7);
  });
});
