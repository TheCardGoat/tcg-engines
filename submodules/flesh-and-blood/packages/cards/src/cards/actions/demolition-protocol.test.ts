import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "./hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { demolitionProtocolRed } from "./demolition-protocol.ts";

/**
 * Demolition Protocol (EVO057) — Mechanologist Attack, 7{p}/3{d}.
 * Printed: Evo Upgrade — when this attacks a hero, remove all steam counters
 * from up to X equipment, items, and/or weapons they control, where X is the
 * number of Evos you have equipped.
 */

describe("Demolition Protocol (EVO057) AAA", () => {
  it("happy: attacking a hero with an Evo equipped strips steam from their item", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoCircuitBreakerRed],
        hand: [demolitionProtocolRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [{ card: hyperDriverRed, state: { steamCounters: 3 } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(demolitionProtocolRed, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ entityTargets: "minimum" });

    expectFabCard(game.as(dash), hyperDriverRed).toHaveCounters(3, "steam");
  });

  it("boundary: with no Evo equipped the defender's steam stays", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [demolitionProtocolRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [{ card: hyperDriverRed, state: { steamCounters: 3 } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(teklovossen).playAttack(demolitionProtocolRed, { stopAt: "defend" });

    expectFabCard(game.as(dash), hyperDriverRed).toHaveCounters(3, "steam");
  });

  it("timing: an unblocked 7{p} hit deals 7 after the steam strip", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoCircuitBreakerRed],
        hand: [demolitionProtocolRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [{ card: hyperDriverRed, state: { steamCounters: 3 } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(teklovossen).playAttack(demolitionProtocolRed);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
