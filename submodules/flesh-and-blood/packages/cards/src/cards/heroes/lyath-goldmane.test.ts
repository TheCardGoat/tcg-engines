import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { lyathGoldmane } from "./lyath-goldmane.ts";
import { snatchRed } from "../actions/snatch.ts";
import { disableRed } from "../actions/disable.ts";
import { concealedObjectBlue } from "../instants/concealed-object.ts";

/**
 * Hero behavior acceptance test — Lyath Goldmane (SUP072).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: base {p} and {d} halved (rounded up)
 * - Core interaction: activated Instant crowd-boos → +1{d} defending actions + Might token
 * - Boundaries: odd-stat ceil rounding, no boo → no Might, activation cost
 *
 * Lyath Goldmane (SUP072) — Reviled Guardian Young — 20hp
 * Printed: "The base {p} and {d} of cards you control are halved, rounded up.
 * Instant - {r}{r}, {t}: The crowd boos you. Defending action cards you
 * control get +1{d} this turn. Whenever the crowd boos you, create a Might
 * token."
 *
 * No signature weapon (check confirmed).
 */

const opponentHero = dash;

describe("lyath-goldmane (SUP072)", () => {
  it("core mechanic: base power of cards you control is halved (rounded up)", () => {
    // SUP072-a1: continuous divide/2 round-up on {p} and {d}.
    // snatch-red has base 4{p} → halved to 2.
    const game = FabTestEngine.start(
      { hero: lyathGoldmane, hand: [snatchRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Lyath = game.as(lyathGoldmane);

    expectFabCard(Lyath, snatchRed).toHavePower(2);
  });

  it("core mechanic: base defense of cards you control is halved", () => {
    // snatch-red has base 2{d} → halved to 1. Defense is read through the
    // rules view (no `toHaveDefense` fluent matcher exists).
    const game = FabTestEngine.start(
      { hero: lyathGoldmane, hand: [snatchRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Lyath = game.as(lyathGoldmane);

    expectFabCard(Lyath, snatchRed).toHaveDefense(1);
  });

  it("core interaction: activating the Instant boos you and creates a Might token", () => {
    // SUP072-a2: Instant - {r}{r}, {t} → crowd boos + defending actions +1{d}.
    // SUP072-a3: whenever crowd boos → create Might token (b→c composition).
    // The activate helper drains {r}{r} payment and {t} tap-self decisions.
    const game = FabTestEngine.start(
      { hero: lyathGoldmane, deck: 6, resourcePoints: 2 },
      { hero: opponentHero, deck: 6 },
    );
    const Lyath = game.as(lyathGoldmane);

    // Act — activate the hero Instant.
    Lyath.activate(lyathGoldmane);

    // Assert — {r}{r} paid, self-boo fired (history flag), Might token created.
    expectFabPlayer(Lyath).toHaveResourceCount(0);
    expectFabPlayer(Lyath).toHaveCrowdBooedThisTurn();
    expectFabToken(game, "might").toHaveCount(1);
  });

  it("core mechanic: external crowd boo (Concealed Object) also creates a Might token", () => {
    // SUP072-a3 triggers on ANY crowd-boos event, not just the hero's own.
    // Concealed Object (SUP097) has an enter-arena trigger that boos.
    const game = FabTestEngine.start(
      { hero: lyathGoldmane, hand: [concealedObjectBlue], deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Lyath = game.as(lyathGoldmane);

    // Act — play Concealed Object; its enter-arena trigger dispatches crowd-boos.
    Lyath.must.play(concealedObjectBlue);
    game.passBoth();

    // Assert — crowd-boos event triggered SUP072-a3 to create a Might token.
    expectFabPlayer(Lyath).toHaveCrowdBooedThisTurn();
    expectFabToken(game, "might").toHaveCount(1);
  });

  it("boundaries: odd base stats halve ROUNDED UP (ceil, not floor)", () => {
    // HEROES.md lyath boundary — "halved, rounded up".
    // disable-red has base 9{p} / 3{d}. Floor would yield 4/1; ceil yields 5/2.
    const game = FabTestEngine.start(
      { hero: lyathGoldmane, hand: [disableRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Lyath = game.as(lyathGoldmane);

    // Power: 9 → 5 (ceil).
    expectFabCard(Lyath, disableRed).toHavePower(5);
    expectFabCard(Lyath, disableRed).toHaveDefense(2);
  });

  it("boundaries: without a crowd-boo event, no Might token is created", () => {
    // No boo source: no enter-arena trigger, no activation.
    // SUP072-a3 must not fire.
    const game = FabTestEngine.start(
      { hero: lyathGoldmane, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Lyath = game.as(lyathGoldmane);

    // Assert — no boo → no Might.
    expectFabPlayer(Lyath).notToHaveCrowdBooedThisTurn();
    expectFabToken(game, "might").toHaveCount(0);
  });
});
