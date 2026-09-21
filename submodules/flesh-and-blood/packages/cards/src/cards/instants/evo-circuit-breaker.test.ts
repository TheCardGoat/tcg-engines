import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { hyperDriverRed, hyperDriverYellow } from "../actions/hyper-driver.ts";
import { scarForAScarRed } from "../actions/scar-for-a-scar.ts";
import { throttleRed } from "../actions/throttle.ts";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { evoCircuitBreakerRed } from "./evo-circuit-breaker.ts";

describe("Evo Circuit Breaker (EVO030) AAA", () => {
  it("with no Hyper Drivers, transforms the base under the equipped head", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [evoCircuitBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoCircuitBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoCircuitBreakerRed).toBeIn("head");
    expectFabCard(Teklo, tekloBaseHead).toBeUnder(evoCircuitBreakerRed);
  });

  for (const drivers of [[hyperDriverRed], [hyperDriverRed, hyperDriverYellow]]) {
    it(`transforms ${drivers.length} Hyper Drivers and prevents twice that much only on the next damage event`, () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossen,
          head: [tekloBaseHead],
          // Prior-turn Drivers each retain one steam counter.
          arena: drivers.map((card) => ({ card, state: { steamCounters: 1 } })),
          hand: [evoCircuitBreakerRed],
          deck: [nimblismBlue, nimblismBlue],
        },
        {
          hero: bravo,
          life: 10,
          hand: [scarForAScarRed, snatchRed],
          deck: [nimblismBlue, nimblismBlue],
        },
        { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
      );
      const Teklo = game.as(teklovossen);
      game.as(bravo).playAttack(scarForAScarRed);
      game.toReaction("defender");
      Teklo.play(evoCircuitBreakerRed);
      game.untilIdle({ entityTargets: "pause" });
      Teklo.target(...drivers);
      game.untilIdle();
      expectFabCard(Teklo, evoCircuitBreakerRed).toBeIn("head");
      expectFabCard(Teklo, tekloBaseHead).toBeUnder(evoCircuitBreakerRed);
      for (const driver of drivers) expectFabCard(Teklo, driver).toBeUnder(evoCircuitBreakerRed);
      game.closeCombat();
      expectFabPlayer(Teklo).toHaveLife(20 - Math.max(0, 4 - 2 * drivers.length));
      expectFabPlayer(game.as(bravo)).toHaveAP(1);
      game.as(bravo).playAttack(snatchRed);
      game.closeCombat();
      expectFabPlayer(Teklo).toHaveLife(16 - Math.max(0, 4 - 2 * drivers.length));
    });
  }

  it("chooses zero even with an eligible Hyper Driver available", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        hand: [evoCircuitBreakerRed],
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoCircuitBreakerRed);
    game.untilIdle({ entityTargets: "pause" });
    Teklo.target();
    game.untilIdle();
    expectFabCard(Teklo, evoCircuitBreakerRed).toBeIn("head");
    expectFabCard(Teklo, tekloBaseHead).toBeUnder(evoCircuitBreakerRed);
    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena").toHaveCounters(1, "steam");
  });

  for (const accept of [true, false]) {
    it(`boost destruction choice accepted = ${accept}`, () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossen,
          head: [tekloBaseHead],
          hand: [evoCircuitBreakerRed, throttleRed],
          resourcePoints: 2,
          banished: [snatchRed, brutalAssaultRed],
          deck: [nimblismBlue, nimblismBlue, grindingGearsBlue],
        },
        { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
        FAB_MANUAL_HARNESS,
      );
      const Teklo = game.as(teklovossen);
      const shuffledSnatch = Teklo.ref(snatchRed);
      const shuffledAssault = Teklo.ref(brutalAssaultRed);
      Teklo.play(evoCircuitBreakerRed);
      game.untilIdle();
      Teklo.play(throttleRed, { boost: true });
      game.passBoth();
      expectWait(game).toHaveDecision("boolean");
      if (accept) Teklo.accept();
      else Teklo.decline();
      if (accept) {
        game.untilIdle({ entityTargets: "pause" });
        Teklo.target(snatchRed, brutalAssaultRed);
      }
      game.untilIdle();
      expectFabCard(Teklo, shuffledSnatch).toBeIn(accept ? "deck" : "banished");
      expectFabCard(Teklo, shuffledAssault).toBeIn(accept ? "deck" : "banished");
      expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
      if (accept) expectFabCard(Teklo, tekloBaseHead).toBeIn("graveyard");
      else expectFabCard(Teklo, tekloBaseHead).toBeUnder(evoCircuitBreakerRed);
      game.closeCombat();
      expectFabPlayer(game.as(bravo)).toHaveLife(14);
    });
  }

  it("unused prevention expires before the opponent's next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        hand: [evoCircuitBreakerRed],
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [snatchRed], deck: [nimblismBlue, nimblismBlue] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: teklovossen },
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoCircuitBreakerRed);
    game.untilIdle({ entityTargets: "pause" });
    Teklo.target(hyperDriverRed);
    game.untilIdle();
    expectFabCard(Teklo, hyperDriverRed).toBeUnder(evoCircuitBreakerRed);
    Teklo.endTurn();
    game.as(bravo).playAttack(snatchRed);
    game.closeCombat();
    expectFabPlayer(Teklo).toHaveLife(16);
  });

  it("boundary: without a base head equipped this does not enter the head slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoCircuitBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoCircuitBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoCircuitBreakerRed).toBeIn("graveyard");
  });
});
