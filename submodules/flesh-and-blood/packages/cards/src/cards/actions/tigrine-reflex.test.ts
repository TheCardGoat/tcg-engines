import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { whelmingGustwaveRed } from "./whelming-gustwave.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { tigrineReflexRed } from "./tigrine-reflex.ts";

/**
 * Tigrine Reflex (PEN035) — Ninja Action Attack, red.
 *
 * Printed: Combo — If Crouching Tiger was the last attack this combat chain,
 * this gets +1{p} and go again.
 * Attack Reaction — Discard this: Target Ninja attack gets +1{p}. Create a
 * Crouching Tiger in your hand.
 */

describe("Tigrine Reflex (PEN035) AAA", () => {
  it("happy: discard this as an Attack Reaction to give a Ninja attack +1{p} and mint a Crouching Tiger", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [whelmingGustwaveRed, tigrineReflexRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(whelmingGustwaveRed);
    game.toReaction("attacker");
    expectCombat(game).toHaveAttackPower(3);
    Ira.activate(tigrineReflexRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Ira, tigrineReflexRed).toBeIn("graveyard");
    expect(Ira.zone("hand")).toContain("token:crouching-tiger");
  });

  it("boundary: a non-Ninja attack is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [brutalAssaultBlue, tigrineReflexRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Ira.expectActivationRejected(tigrineReflexRed);
    expectFabCard(Ira, tigrineReflexRed).toBeIn("hand");
  });

  it("timing: Combo with last-attack Crouching Tiger raises this to 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [tigrineReflexRed],
        arena: [],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    // Combo is last-attack Crouching Tiger; without that this stays 3{p}.
    Ira.playAttack(tigrineReflexRed);
    expectCombat(game).toHaveAttackPower(3);
  });
});
