import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { aggressivePounceRed } from "./aggressive-pounce.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { nimblismBlue } from "./nimblism.ts";
import { tradeInBlue } from "./trade-in.ts";
import { savageBeatdownRed } from "./savage-beatdown.ts";

/**
 * Savage Beatdown (DYN007) — Brute Action - Attack, cost 3, 6{p}, 3{d}.
 *
 * Printed: "Play this only if you've discarded a card with 6 or more {p} this
 * turn. As an additional cost to play this, discard a random card. If the
 * discarded card has 6 or more {p}, this gets +6{p}."
 *
 * Trade In (UPR214) is the same-turn 6+{p} discard vehicle. The additional
 * cost is a required random discard — seat exactly one other hand card so the
 * pick is forced (CR 1.9.3).
 */

const nimblismDeck = [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
] as const;

describe("Savage Beatdown (DYN007) AAA", () => {
  it("happy: a same-turn 6+{p} discard plus a 6+{p} cost-discard grants +6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [tradeInBlue, aggressivePounceRed, savageBeatdownRed, alphaRampageRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: [...nimblismDeck],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(tradeInBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: aggressivePounceRed.canonicalId,
    });

    Rhinar.attackWith(savageBeatdownRed);
    expectCombat(game).toHaveAttackPower(12);
    expectFabCard(Rhinar, alphaRampageRed).toBeIn("graveyard");
  });

  it("boundary: a sub-6{p} cost-discard grants no bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [tradeInBlue, aggressivePounceRed, savageBeatdownRed, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: [...nimblismDeck],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(tradeInBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: aggressivePounceRed.canonicalId,
    });

    Rhinar.attackWith(savageBeatdownRed);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: not playable without a 6+{p} discard this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [savageBeatdownRed, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(rhinar).attackWith(savageBeatdownRed)).toThrow(
      /play condition is not satisfied/,
    );
  });

  it("timing: a 6+{p} discard from last turn does not satisfy the play restriction", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [tradeInBlue, aggressivePounceRed, savageBeatdownRed, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: [...nimblismDeck],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(tradeInBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: aggressivePounceRed.canonicalId,
    });
    Rhinar.endTurn();
    game.as(dash).endTurn();
    game.helpers.untilIdle();

    expect(() => game.as(rhinar).attackWith(savageBeatdownRed, { pitch: [nimblismBlue] })).toThrow(
      /play condition is not satisfied/,
    );
  });
});
