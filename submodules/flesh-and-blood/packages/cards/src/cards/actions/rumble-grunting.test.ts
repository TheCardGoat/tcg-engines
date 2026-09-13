import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { aggressivePounceRed } from "./aggressive-pounce.ts";
import { nimblismBlue } from "./nimblism.ts";
import { packHuntBlue } from "./pack-hunt.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { tradeInBlue } from "./trade-in.ts";
import { rumbleGruntingRed, rumbleGruntingYellow } from "./rumble-grunting.ts";

/**
 * Rumble Grunting (DYN022) — Brute Action, cost 0, go again.
 *
 * Printed: "Play Rumble Grunting only if you've discarded a card with 6 or
 * more {p} this turn. Your next Brute attack this turn gains +4{p}. Go again"
 *
 * Trade In (UPR214) is the same-turn 6+{p} discard vehicle. Pack Hunt Blue
 * is a 4{p} Brute attack; Brutal Assault is Generic and must not consume the
 * latch.
 */

const nimblismDeck = [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
] as const;

describe("Rumble Grunting (DYN022) AAA", () => {
  it("happy: a same-turn 6+{p} discard lets the next Brute attack gain +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [tradeInBlue, aggressivePounceRed, rumbleGruntingRed, packHuntBlue],
        resourcePoints: 2,
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

    Rhinar.play(rumbleGruntingRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Rhinar).toHaveAP(1);

    Rhinar.attackWith(packHuntBlue);
    expectCombat(game).toHaveAttackPower(8);
  });

  it("color variant: the yellow member grants +3{p} after the same-turn discard", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [tradeInBlue, aggressivePounceRed, rumbleGruntingYellow, packHuntBlue],
        resourcePoints: 2,
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
    Rhinar.play(rumbleGruntingYellow);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(packHuntBlue);

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: not playable without a 6+{p} discard this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [rumbleGruntingRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(rhinar).play(rumbleGruntingRed)).toThrow(
      /play condition is not satisfied/,
    );
  });

  it("timing: a Generic attack does not consume the latch", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [
          tradeInBlue,
          aggressivePounceRed,
          rumbleGruntingRed,
          brutalAssaultBlue,
          packHuntBlue,
        ],
        resourcePoints: 4,
        actionPoints: 3,
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

    Rhinar.play(rumbleGruntingRed);
    game.helpers.resolveUntilIdle();

    Rhinar.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    Rhinar.attackWith(packHuntBlue);
    expectCombat(game).toHaveAttackPower(8);
  });
});
