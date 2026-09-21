import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabCard,
  expectWait,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { florian } from "../heroes/florian.ts";
import { florianRotwoodHarbinger } from "../heroes/florian-rotwood-harbinger.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { envelopInDarknessRed } from "./envelop-in-darkness.ts";
import { nimblismBlue } from "./nimblism.ts";
import { nastySurpriseBlue } from "./nasty-surprise.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { readTheRunesRed, readTheRunesYellow, readTheRunesBlue } from "./read-the-runes.ts";
import { rippleAwayBlue } from "./ripple-away.ts";

/**
 * Ripple Away Blue (HVY209) — Instant discard this: action-card creates get
 * that many minus 1 of each token type this turn.
 */

const padding = [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue];

describe("Ripple Away (HVY209) AAA", () => {
  it("happy: discard this so an action that would create 1 Runechant instead creates 0", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [rippleAwayBlue, envelopInDarknessRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: padding,
      },
      { hero: dash, deck: padding },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.activate(rippleAwayBlue);
    game.untilIdle();
    expectFabCard(Vynnset, rippleAwayBlue).toBeIn("graveyard");

    Vynnset.play(envelopInDarknessRed);
    game.untilIdle({ optionals: "decline" });
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 0);
  });

  it("boundary: without Ripple Away, Envelop in Darkness still creates 1 Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [envelopInDarknessRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: padding,
      },
      { hero: dash, deck: padding },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(envelopInDarknessRed);
    game.untilIdle({ optionals: "decline" });
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 1);
  });
});

describe("Ripple Away global action-effect scope", () => {
  it("reduces an opposing action effect from one Runechant to zero", () => {
    const game = FabTestEngine.start(
      { hero: vynnset, hand: [envelopInDarknessRed], deck: padding, resourcePoints: 1 },
      { hero: dash, hand: [rippleAwayBlue], deck: padding },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.pass();
    Dash.activate(rippleAwayBlue);
    game.untilIdle();
    Vynnset.play(envelopInDarknessRed);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 0);
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabPlayer(Vynnset).toHaveAP(1);
  });
});

it("Ripple Away preserves hero-created Runechants while reducing opposing action-created Runechants", () => {
  const game = FabTestEngine.start(
    {
      hero: viserai,
      hand: [envelopInDarknessRed, envelopInDarknessRed],
      deck: padding,
      resourcePoints: 2,
    },
    { hero: dash, hand: [rippleAwayBlue], deck: padding },
    FAB_MANUAL_HARNESS,
  );
  const Viserai = game.as(viserai);
  const Dash = game.as(dash);
  Viserai.pass();
  Dash.activate(rippleAwayBlue);
  game.untilIdle();

  Viserai.play(envelopInDarknessRed);
  game.untilIdle();
  expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
  // Playing the second Runeblade non-attack triggers the hero's own effect.
  // Its Runechant survives; the resolving action's Runechant is reduced to zero.
  Viserai.play(envelopInDarknessRed);
  game.untilIdle();

  expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
  expectFabPlayer(Viserai).toHaveAP(1);
  expectFabPlayer(Dash).toHaveTokenCount("runechant", 0);
});

it("Ripple Away subtracts one from a three-token batch and expires on turn handoff", () => {
  const game = FabTestEngine.start(
    { hero: vynnset, hand: [rippleAwayBlue, readTheRunesRed], deck: padding },
    { hero: viserai, hand: [readTheRunesRed], deck: padding },
    FAB_MANUAL_HARNESS,
  );
  const Vynnset = game.as(vynnset);
  const Viserai = game.as(viserai);

  Vynnset.activate(rippleAwayBlue);
  game.untilIdle();
  Vynnset.play(readTheRunesRed);
  game.untilIdle();
  expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 2).toHaveAP(0);

  Vynnset.endTurn();
  Viserai.play(readTheRunesRed);
  game.untilIdle();

  expectFabPlayer(Viserai).toHaveTokenCount("runechant", 3).toHaveAP(0);
  expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 2);
});

// Runtime interaction excludes cross-talent deck construction for Envelop.
describe("Ripple Away competing aura replacements", () => {
  for (const { label, hero, threshold } of [
    { label: "Florian", hero: florian, threshold: 4 },
    { label: "Florian, Rotwood Harbinger", hero: florianRotwoodHarbinger, threshold: 8 },
  ]) {
    for (const { first, expected } of [
      { first: "Ripple", expected: 0 },
      { first: "Florian", expected: 1 },
    ]) {
      it(`${label}: turn player chooses ${first} first, resulting in ${expected} Runechants`, () => {
        const game = FabTestEngine.start(
          {
            hero,
            hand: [envelopInDarknessRed],
            deck: padding,
            resourcePoints: 1,
            banished: Array.from({ length: threshold }, () => autumnSTouchBlue),
          },
          { hero: dash, hand: [rippleAwayBlue], deck: padding },
          FAB_MANUAL_HARNESS,
        );
        const Florian = game.as(hero);
        const Dash = game.as(dash);
        Florian.pass();
        Dash.activate(rippleAwayBlue);
        game.untilIdle();
        Florian.play(envelopInDarknessRed);
        game.advanceUntil({ stopAt: "idle", entityTargets: "pause" });
        expectWait(game).toHaveDecision("option");
        Florian.choose(first === "Ripple" ? Dash.id : Florian.id);
        game.untilIdle();

        expectFabPlayer(Florian).toHaveTokenCount("runechant", expected).toHaveAP(1);
        expectFabPlayer(Dash).toHaveTokenCount("runechant", 0);
        expectWait(game).toBeIdle();
      });
    }
  }
});

for (const zone of ["arsenal", "graveyard", "banished"] as const) {
  it(`Ripple Away cannot discard itself from ${zone} or install its replacement`, () => {
    const game = FabTestEngine.start(
      { hero: vynnset, hand: [readTheRunesRed], [zone]: [rippleAwayBlue], deck: padding },
      { hero: dash, hand: [], deck: padding },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const ripple = Vynnset.cardIn(zone, rippleAwayBlue);
    expect(Vynnset.expectActivationRejected(ripple).errorCode).toBe("invalid_activation_source");
    expectFabCard(Vynnset, ripple).toBeIn(zone);
    expectFabPlayer(Vynnset).toHaveHandCount(1).toHaveAP(1);
    Vynnset.play(readTheRunesRed);
    game.untilIdle();
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 3).toHaveAP(0);
  });
}

for (const reduced of [false, true]) {
  it(`Nasty Surprise creates ${reduced ? "zero" : "one"} of each token type ${reduced ? "with" : "without"} Ripple Away`, () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: reduced ? [rippleAwayBlue, commandAndConquerRed] : [commandAndConquerRed],
        resourcePoints: 2,
        deck: padding,
      },
      { hero: viserai, hand: [], arsenal: [nastySurpriseBlue], life: 20, deck: padding },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);
    if (reduced) {
      Dash.activate(rippleAwayBlue);
      game.untilIdle();
    }
    Dash.playAttack(commandAndConquerRed);
    game.closeCombat();

    expectFabCard(Viserai, nastySurpriseBlue).toBeIn("graveyard");
    expectFabPlayer(Viserai)
      .toHaveLife(14)
      .toHaveTokenCount("agility", reduced ? 0 : 1)
      .toHaveTokenCount("might", reduced ? 0 : 1)
      .toHaveTokenCount("vigor", reduced ? 0 : 1);
    expectCombat(game).toBeClosed();
    expectWait(game).toBeIdle();
  });
}

for (const { label, card, expected } of [
  { label: "red", card: readTheRunesRed, expected: 1 },
  { label: "yellow", card: readTheRunesYellow, expected: 0 },
  { label: "blue", card: readTheRunesBlue, expected: 0 },
]) {
  it(`two Ripple Away responses reduce unresolved ${label} Read the Runes to ${expected}`, () => {
    const game = FabTestEngine.start(
      { hero: vynnset, hand: [card], deck: padding },
      { hero: dash, hand: [rippleAwayBlue, rippleAwayBlue], deck: padding },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);
    const [first, second] = Dash.cardsIn("hand", rippleAwayBlue);
    if (!first || !second) throw new Error("Expected two explicitly arranged Ripple Away copies");
    Vynnset.play(card);
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 0);
    Vynnset.pass();
    Dash.must.activate(first);
    expectFabCard(Dash, first).toBeIn("graveyard");
    expectFabCard(Dash, second).toBeIn("hand");
    Dash.must.activate(second);
    expectFabCard(Dash, second).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(0);
    // Identical subtract-one effects commute; either same-controller order is valid.
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", expected).toHaveAP(0);
    expectWait(game).toBeIdle();
  });
}

it("Ripple Away activated after creation does not remove existing Runechants", () => {
  const game = FabTestEngine.start(
    { hero: vynnset, hand: [readTheRunesRed], deck: padding },
    { hero: dash, hand: [rippleAwayBlue], deck: padding },
    FAB_MANUAL_HARNESS,
  );
  const Vynnset = game.as(vynnset);
  const Dash = game.as(dash);
  Vynnset.play(readTheRunesRed);
  game.untilIdle();
  expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 3);
  Vynnset.pass();
  Dash.activate(rippleAwayBlue);
  game.untilIdle();
  expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 3);
  expectFabCard(Dash, rippleAwayBlue).toBeIn("graveyard");
  expectWait(game).toBeIdle();
});
