import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { scalePeeler } from "../weapons/scale-peeler.ts";
import { vipoxRed } from "../actions/vipox.ts";
import { knivesOutBlue } from "./knives-out.ts";

/**
 * Knives Out (OUT144) — Assassin / Ninja Attack Reaction, blue.
 *
 * Printed: Your daggers gain +1{p} this turn.
 *
 * Resolution `moniker:"Dagger"` on combat-chain misses the weapon-attack
 * proxy (FNG013 family). The reaction still resolves; pin the missing +1{p}.
 */

describe("Knives Out (OUT144) AAA", () => {
  it("happy: Knives Out gives the attacking dagger +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [nerveScalpel],
        hand: [knivesOutBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.activate(nerveScalpel);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(knivesOutBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Arakni, knivesOutBlue).toBeIn("graveyard");
  });

  it("boundary: a non-dagger attack action does not gain +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [knivesOutBlue, vipoxRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(vipoxRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(knivesOutBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Arakni, knivesOutBlue).toBeIn("graveyard");
  });

  it("timing: a later dagger attack this turn also has +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [nerveScalpel],
        weapon2: [scalePeeler],
        hand: [knivesOutBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.activate(nerveScalpel);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(knivesOutBlue);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();

    Arakni.must.activate(scalePeeler);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(2);
  });
});
