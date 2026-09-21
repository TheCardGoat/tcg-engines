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
import { throttleRed, throttleBlue } from "../actions/throttle.ts";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { tekloBaseLegs } from "../equipment/teklo-base-legs.ts";
import { evoZipLineYellow } from "./evo-zip-line.ts";
import { tekloBaseChest } from "../equipment/teklo-base-chest.ts";
import { evoAtomBreakerRed } from "./evo-atom-breaker.ts";

/**
 * Evo Atom Breaker (EVO031) — Mechanologist Instant Evo Chest.
 * Printed: If you have a base chest equipped, transform it and X Hyper Drivers
 * you control into this, then equip this.
 */

describe("Evo Atom Breaker (EVO031) AAA", () => {
  it("with no Hyper Drivers, transforms the base under the equipped chest", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        hand: [evoAtomBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoAtomBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoAtomBreakerRed).toBeIn("chest");
    expectFabCard(Teklo, tekloBaseChest).toBeUnder(evoAtomBreakerRed);
  });

  for (const drivers of [[hyperDriverRed], [hyperDriverRed, hyperDriverYellow]]) {
    it(`transforms ${drivers.length} Hyper Drivers and prevents twice that much only on the next damage event`, () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossen,
          chest: [tekloBaseChest],
          // Prior-turn Drivers each retain one steam counter.
          arena: drivers.map((card) => ({ card, state: { steamCounters: 1 } })),
          hand: [evoAtomBreakerRed],
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
      Teklo.play(evoAtomBreakerRed);
      game.untilIdle({ entityTargets: "pause" });
      Teklo.target(...drivers);
      game.untilIdle();
      expectFabCard(Teklo, evoAtomBreakerRed).toBeIn("chest");
      expectFabCard(Teklo, tekloBaseChest).toBeUnder(evoAtomBreakerRed);
      for (const driver of drivers) expectFabCard(Teklo, driver).toBeUnder(evoAtomBreakerRed);
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
        chest: [tekloBaseChest],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        hand: [evoAtomBreakerRed],
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoAtomBreakerRed);
    game.untilIdle({ entityTargets: "pause" });
    Teklo.target();
    game.untilIdle();
    expectFabCard(Teklo, evoAtomBreakerRed).toBeIn("chest");
    expectFabCard(Teklo, tekloBaseChest).toBeUnder(evoAtomBreakerRed);
    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena").toHaveCounters(1, "steam");
  });

  for (const accept of [true, false]) {
    it(`boost destruction choice accepted = ${accept}`, () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossen,
          chest: [tekloBaseChest],
          hand: [evoAtomBreakerRed, throttleRed],
          resourcePoints: 2,
          deck: [nimblismBlue, nimblismBlue, grindingGearsBlue],
        },
        { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
        FAB_MANUAL_HARNESS,
      );
      const Teklo = game.as(teklovossen);
      Teklo.play(evoAtomBreakerRed);
      game.untilIdle();
      Teklo.play(throttleRed, { boost: true });
      game.passBoth();
      expectWait(game).toHaveDecision("boolean");
      if (accept) Teklo.accept();
      else Teklo.decline();
      game.untilIdle();
      if (accept) expectFabCard(Teklo, tekloBaseChest).toBeIn("graveyard");
      else expectFabCard(Teklo, tekloBaseChest).toBeUnder(evoAtomBreakerRed);
      expectFabPlayer(Teklo).toHaveResourceCount(accept ? 2 : 0);
      game.closeCombat();
      expectFabPlayer(game.as(bravo)).toHaveLife(14);
    });
  }

  it("destroys only its own subcard when another Evo has a card underneath", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        legs: [tekloBaseLegs],
        hand: [evoAtomBreakerRed, evoZipLineYellow, throttleRed],
        resourcePoints: 2,
        deck: [nimblismBlue, nimblismBlue, grindingGearsBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoAtomBreakerRed);
    game.untilIdle();
    Teklo.play(evoZipLineYellow);
    game.untilIdle();
    expectFabCard(Teklo, tekloBaseLegs).toBeUnder(evoZipLineYellow);
    Teklo.play(throttleRed, { boost: true });
    game.passBoth();
    Teklo.accept();
    game.untilIdle({ entityTargets: "pause" });
    expectWait(game).notToHaveDecision();
    expectFabCard(Teklo, tekloBaseChest).toBeIn("graveyard");
    expectFabCard(Teklo, tekloBaseLegs).toBeUnder(evoZipLineYellow);
    expectFabPlayer(Teklo).toHaveResourceCount(2);
    game.closeCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(14);
  });

  it("unused prevention expires before the opponent's next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        hand: [evoAtomBreakerRed],
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [snatchRed], deck: [nimblismBlue, nimblismBlue] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: teklovossen },
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoAtomBreakerRed);
    game.untilIdle({ entityTargets: "pause" });
    Teklo.target(hyperDriverRed);
    game.untilIdle();
    expectFabCard(Teklo, hyperDriverRed).toBeUnder(evoAtomBreakerRed);
    Teklo.endTurn();
    game.as(bravo).playAttack(snatchRed);
    game.closeCombat();
    expectFabPlayer(Teklo).toHaveLife(16);
  });

  it("cannot gain a second boost reward after its only subcard was destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        hand: [evoAtomBreakerRed, throttleRed, throttleBlue],
        resourcePoints: 4,
        deck: [nimblismBlue, grindingGearsBlue, grindingGearsBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoAtomBreakerRed);
    game.untilIdle();
    Teklo.play(throttleRed, { boost: true });
    game.passBoth();
    Teklo.accept();
    game.closeCombat();
    expectFabCard(Teklo, tekloBaseChest).toBeIn("graveyard");
    expectFabPlayer(Teklo).toHaveResourceCount(4).toHaveAP(1);
    Teklo.play(throttleBlue, { boost: true });
    game.passBoth();
    if (game.pendingDecision()?.kind === "boolean") Teklo.accept();
    game.closeCombat();
    expectFabPlayer(Teklo).toHaveResourceCount(2);
    expectFabCard(Teklo, evoAtomBreakerRed).toBeIn("chest");
    expectFabPlayer(game.as(bravo)).toHaveLife(10);
  });

  it("boundary: without a base chest equipped this does not enter the chest slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoAtomBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: [nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoAtomBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoAtomBreakerRed).toBeIn("graveyard");
  });
});
