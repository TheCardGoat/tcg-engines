import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kayo } from "../heroes/kayo.ts";
import { dash } from "../heroes/dash.ts";
import { tradeInBlue } from "../actions/trade-in.ts";
import { debilitateBlue } from "../actions/debilitate.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { ballBreaker } from "./ball-breaker.ts";

/**
 * Ball Breaker (HVY006) — Brute Weapon - Flail - 1H, base 3{p}.
 * Printed: "Once per Turn Action - {r}{r}: Attack. If you've discarded a
 * card with 6 or more {p} this turn, this gets +1{p}."
 */

describe("Ball Breaker (HVY006) AAA", () => {
  it("happy: discarding a 6{p}+ card this turn raises this to 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        weapon1: [ballBreaker],
        hand: [tradeInBlue, debilitateBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.playAttack(tradeInBlue, { stopAt: "on-attack" });
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: debilitateBlue.canonicalId,
      ordering: "listed",
    });
    game.closeCombat({ ordering: "listed" });
    Kayo.activateAttack(ballBreaker);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: without a big discard this stays 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        weapon1: [ballBreaker],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.activateAttack(ballBreaker);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: discarding a sub-6{p} card does not raise this", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        weapon1: [ballBreaker],
        hand: [tradeInBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.playAttack(tradeInBlue, { stopAt: "on-attack" });
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: nimblismBlue.canonicalId,
      ordering: "listed",
    });
    game.closeCombat({ ordering: "listed" });
    Kayo.activateAttack(ballBreaker);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });
});
