import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dropletBlue } from "../actions/droplet.ts";
import { nuu } from "../heroes/nuu.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { venomousBiteRed } from "./venomous-bite.ts";

/**
 * Venomous Bite, Red (MST020) — Mystic Assassin Attack Reaction, cost 1, 3{d}.
 *
 * Printed: "Target Assassin or Mystic attack action card gets +3{p}.
 * If you've pitched a blue card this turn, create a Fang Strike in your hand."
 */

describe("Venomous Bite (MST020) AAA", () => {
  it("happy: resolving on a Mystic attack grants +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [dropletBlue, venomousBiteRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.attackWith(dropletBlue);
    game.advanceCombatTo("reaction");
    Nuu.must.playReaction(venomousBiteRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Nuu, venomousBiteRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack action is not a legal +3{p} target", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [snatchRed, venomousBiteRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Nuu.must.playReaction(venomousBiteRed));
    expectFabCard(Nuu, venomousBiteRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: pitching a blue this turn creates a Fang Strike in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [dropletBlue, venomousBiteRed],
        pitch: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.attackWith(dropletBlue);
    game.advanceCombatTo("reaction");
    Nuu.must.playReaction(venomousBiteRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    expect(Nuu.zone("hand")).toContain("token:fang-strike");
  });

  it("boundary: a weapon attack is not an attack action card", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        weapon1: [nerveScalpel],
        hand: [venomousBiteRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.must.activate(nerveScalpel);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Nuu.must.playReaction(venomousBiteRed));
    expectFabCard(Nuu, venomousBiteRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(1);
  });
});
