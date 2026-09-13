import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { aetherSinkYellow } from "./aether-sink.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { springALeakRed } from "./spring-a-leak.ts";

/**
 * Spring a Leak (EVO150) — Mechanologist Action - Attack, cost 2, 5{p}/3{d},
 * Boost.
 *
 * Printed: "Boost. When this hits a hero, remove all steam counters from an
 * equipment, item, or weapon they control."
 *
 * Seat Teklovossen vs Dash. Authored typeBox AND-filters Equipment+Weapon+Item
 * (System Failure uses `or`); steam is not stripped on hit (family
 * `definition/spring-a-leak-target-filter`). `untilIdle` / `closeCombat` closes
 * combat — no targeting throw.
 */

describe("Spring a Leak (EVO150) AAA", () => {
  it("happy: undefended hit deals 5; typeBox AND-filter leaves Dash's steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [springALeakRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [{ card: aetherSinkYellow, state: { steamCounters: 3 } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);

    Teklo.playAttack(springALeakRed);
    Dash.defendWith();
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, aetherSinkYellow).toHaveCounters(3, "steam");
  });

  it("boundary: a full block misses and does not strip steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [springALeakRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, nimblismBlue],
        arena: [{ card: aetherSinkYellow, state: { steamCounters: 3 } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);

    Teklo.playAttack(springALeakRed);
    Dash.defendWith(brutalAssaultBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, aetherSinkYellow).toHaveCounters(3, "steam");
    expectFabCard(Teklo, springALeakRed).toBeIn("graveyard");
  });

  it("timing: boosting a Mechanologist grants go again (untilIdle closes combat)", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [springALeakRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [],
        deckTop: [grindingGearsBlue],
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, nimblismBlue],
        arena: [{ card: aetherSinkYellow, state: { steamCounters: 3 } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);

    Teklo.playAttack(springALeakRed, { boost: true });
    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();

    Dash.defendWith(brutalAssaultBlue, nimblismBlue);
    game.untilIdle();

    expectFabPlayer(Teklo).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, aetherSinkYellow).toHaveCounters(3, "steam");
  });
});
