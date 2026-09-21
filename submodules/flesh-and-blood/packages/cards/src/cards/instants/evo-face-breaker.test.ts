import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { hyperDriverRed, hyperDriverYellow } from "../actions/hyper-driver.ts";
import { scarForAScarRed } from "../actions/scar-for-a-scar.ts";
import { throttleRed } from "../actions/throttle.ts";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { tekloBaseArms } from "../equipment/teklo-base-arms.ts";
import { evoFaceBreakerRed } from "./evo-face-breaker.ts";

/**
 * Evo Face Breaker (EVO032) — Mechanologist Instant Evo Arms.
 * Printed: If you have a base arms equipped, transform it and X Hyper Drivers
 * you control into this, then equip this.
 */

describe("Evo Face Breaker (EVO032) AAA", () => {
  it("with no Hyper Drivers, transforms the base under the equipped arms", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        hand: [evoFaceBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoFaceBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoFaceBreakerRed).toBeIn("arms");
    expectFabCard(Teklo, tekloBaseArms).toBeUnder(evoFaceBreakerRed);
  });

  for (const drivers of [[hyperDriverRed], [hyperDriverRed, hyperDriverYellow]]) {
    it(`transforms ${drivers.length} Hyper Drivers and prevents twice that much only on the next damage event`, () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossen,
          arms: [tekloBaseArms],
          // Prior-turn Drivers each retain one steam counter.
          arena: drivers.map((card) => ({ card, state: { steamCounters: 1 } })),
          hand: [evoFaceBreakerRed],
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
      Teklo.play(evoFaceBreakerRed);
      game.untilIdle({ entityTargets: "pause" });
      Teklo.target(...drivers);
      game.untilIdle();
      expectFabCard(Teklo, evoFaceBreakerRed).toBeIn("arms");
      expectFabCard(Teklo, tekloBaseArms).toBeUnder(evoFaceBreakerRed);
      for (const driver of drivers) expectFabCard(Teklo, driver).toBeUnder(evoFaceBreakerRed);
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
        arms: [tekloBaseArms],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        hand: [evoFaceBreakerRed],
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoFaceBreakerRed);
    game.untilIdle({ entityTargets: "pause" });
    Teklo.target();
    game.untilIdle();
    expectFabCard(Teklo, evoFaceBreakerRed).toBeIn("arms");
    expectFabCard(Teklo, tekloBaseArms).toBeUnder(evoFaceBreakerRed);
    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena").toHaveCounters(1, "steam");
  });

  for (const accept of [true, false]) {
    it(`boost destruction choice accepted = ${accept}`, () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossen,
          arms: [tekloBaseArms],
          hand: [evoFaceBreakerRed, throttleRed],
          resourcePoints: 2,
          deck: [nimblismBlue, nimblismBlue, grindingGearsBlue],
        },
        { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
        FAB_MANUAL_HARNESS,
      );
      const Teklo = game.as(teklovossen);
      Teklo.play(evoFaceBreakerRed);
      game.untilIdle();
      Teklo.play(throttleRed, { boost: true });
      game.passBoth();
      expectWait(game).toHaveDecision("boolean");
      if (accept) Teklo.accept();
      else Teklo.decline();
      game.toReaction("attacker");
      expectCombat(game).toHaveAttackPower(accept ? 8 : 6);
      if (accept) expectFabCard(Teklo, tekloBaseArms).toBeIn("graveyard");
      else expectFabCard(Teklo, tekloBaseArms).toBeUnder(evoFaceBreakerRed);
      game.closeCombat();
      expectFabPlayer(game.as(bravo)).toHaveLife(accept ? 12 : 14);
    });
  }

  it("unused prevention expires before the opponent's next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        hand: [evoFaceBreakerRed],
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [snatchRed], deck: [nimblismBlue, nimblismBlue] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: teklovossen },
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoFaceBreakerRed);
    game.untilIdle({ entityTargets: "pause" });
    Teklo.target(hyperDriverRed);
    game.untilIdle();
    expectFabCard(Teklo, hyperDriverRed).toBeUnder(evoFaceBreakerRed);
    Teklo.endTurn();
    game.as(bravo).playAttack(snatchRed);
    game.closeCombat();
    expectFabPlayer(Teklo).toHaveLife(16);
  });

  it("boundary: without a base arms equipped this does not enter the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoFaceBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoFaceBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoFaceBreakerRed).toBeIn("graveyard");
  });
});
