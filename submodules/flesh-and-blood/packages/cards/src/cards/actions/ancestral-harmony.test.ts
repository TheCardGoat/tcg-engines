import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { blackoutKickRed } from "./blackout-kick.ts";
import { ancestralHarmonyBlue } from "./ancestral-harmony.ts";

/**
 * Ancestral Harmony (HVY247) — Ninja Action.
 *
 * Printed: "Your attacks with combo get +1{p} this turn.
 * Banish the top card of your deck. If it has combo, you may play it this turn.
 * Go again"
 */

describe("Ancestral Harmony (HVY247) AAA", () => {
  it("happy: combo attacks get +1{p} and a banished combo top may be played this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [ancestralHarmonyBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deckTop: [blackoutKickRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(ancestralHarmonyBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Bravo, ancestralHarmonyBlue).toBeIn("graveyard");
    expectFabCard(Bravo, blackoutKickRed).toBeBanished();
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.attackWith(blackoutKickRed, { from: "banished" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a non-combo top card is banished with no play permission", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [ancestralHarmonyBlue],
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(ancestralHarmonyBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, nimblismBlue).toBeBanished();
    expect(() => Bravo.attackWith(nimblismBlue, { from: "banished" })).toThrow(
      /Playing from banished requires a migrated permission effect/,
    );
  });

  it("boundary: a Generic attack without combo does not get +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [ancestralHarmonyBlue, snatchRed],
        actionPoints: 2,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(ancestralHarmonyBlue);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });
});
