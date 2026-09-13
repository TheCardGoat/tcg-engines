import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { snatchRed } from "../actions/snatch.ts";
import { steelbladeShuntRed } from "./steelblade-shunt.ts";

/**
 * Steelblade Shunt Red (TEA011) — Warrior Defense Reaction.
 *
 * Printed: If Steelblade Shunt defends a weapon attack, deal 1 damage to the
 * attacking hero.
 */

describe("Steelblade Shunt family AAA", () => {
  it("happy: defending a Dawnblade weapon attack deals 1 to the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kassai,
        hand: [steelbladeShuntRed],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Kassai = game.as(kassai);

    Dori.activate(dawnblade);
    game.advanceCombatTo("reaction");
    Dori.pass();
    Kassai.play(steelbladeShuntRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dori).toHaveLife(19);
    expectFabPlayer(Kassai).toHaveLife(20);
    expectFabCard(Kassai, steelbladeShuntRed).toBeIn("graveyard");
  });

  it("boundary: defending an attack-action deals no bounce damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: kassai,
        hand: [steelbladeShuntRed],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kassai = game.as(kassai);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Kassai.play(steelbladeShuntRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Kassai).toHaveLife(20);
  });
});
