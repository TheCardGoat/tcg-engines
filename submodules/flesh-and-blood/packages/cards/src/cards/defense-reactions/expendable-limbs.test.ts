import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kayoBerserkerRunt } from "../heroes/kayo-berserker-runt.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { goreBelchingRed } from "../actions/gore-belching.ts";
import { expendableLimbsBlue } from "./expendable-limbs.ts";

/**
 * Expendable Limbs, Blue (DTD110) — Shadow Brute Defense Reaction.
 *
 * Printed: "As an additional cost to play this, banish a random card from
 * your hand. If a card with 6 or more {p} is banished this way, you may play
 * it from your banished zone during your next action phase." (cost 0, 4{d})
 *
 * "You may play it" is a duration play-card grant on the banished-this-way
 * card (EVR053), never a play-static permission on this DR itself.
 */

describe("Expendable Limbs (DTD110) AAA", () => {
  it("happy: a 6{p} card banished as cost may be played from banished during the next action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kayoBerserkerRunt,
        hand: [expendableLimbsBlue, goreBelchingRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kayo = game.as(kayoBerserkerRunt);

    Dash.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    if (Dash.hasPriority()) Dash.pass();

    Kayo.play(expendableLimbsBlue);
    expectFabCard(Kayo, goreBelchingRed).toBeBanished();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kayo).toHaveLife(20);
    expectCombat(game).toBeClosed();

    Dash.endTurn();
    game.untilIdle();

    Kayo.playAttack(goreBelchingRed, { from: "banished", optionals: "decline" });
    expectFabCard(Kayo, goreBelchingRed).toBeIn("combatChain");
    expectCombat(game).toBeOpen();
  });

  it("boundary: a card with less than 6{p} banished as cost cannot be played from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kayoBerserkerRunt,
        hand: [expendableLimbsBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kayo = game.as(kayoBerserkerRunt);

    Dash.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    if (Dash.hasPriority()) Dash.pass();

    Kayo.play(expendableLimbsBlue);
    expectFabCard(Kayo, nimblismBlue).toBeBanished();
    game.helpers.resolveRestOfCombat();

    Dash.endTurn();
    game.untilIdle();

    expectFabUnplayable(() => Kayo.play(nimblismBlue, { from: "banished" }), /migrated permission/);
    expectFabCard(Kayo, nimblismBlue).toBeBanished();
  });

  it("timing: skipping the next action phase expires the banished-play grant", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kayoBerserkerRunt,
        hand: [expendableLimbsBlue, goreBelchingRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kayo = game.as(kayoBerserkerRunt);

    Dash.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    if (Dash.hasPriority()) Dash.pass();

    Kayo.play(expendableLimbsBlue);
    expectFabCard(Kayo, goreBelchingRed).toBeBanished();
    game.helpers.resolveRestOfCombat();

    Dash.endTurn();
    game.untilIdle();
    Kayo.endTurn();
    game.untilIdle();
    Dash.endTurn();
    game.untilIdle();

    expectFabUnplayable(
      () => Kayo.play(goreBelchingRed, { from: "banished" }),
      /migrated permission/,
    );
    expectFabCard(Kayo, goreBelchingRed).toBeBanished();
  });

  it("boundary: with no other card in hand the required banish cost cannot be paid", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kayoBerserkerRunt,
        hand: [expendableLimbsBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kayo = game.as(kayoBerserkerRunt);

    Dash.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    if (Dash.hasPriority()) Dash.pass();

    expectFabUnplayable(() => Kayo.play(expendableLimbsBlue));
    expectFabCard(Kayo, expendableLimbsBlue).toBeIn("hand");
  });
});
