import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { anothos } from "../weapons/anothos.ts";
import { snatchRed } from "../actions/snatch.ts";
import { shatterYellow } from "./shatter.ts";

/**
 * Shatter (EVR054) — target 2H weapon gains a damage-to-destroy-defending-equipment replacement.
 */

describe("Shatter (EVR054) AAA", () => {
  it("happy: can target a 2H weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [anothos],
        hand: [shatterYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.activate(anothos);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(shatterYellow);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.zone("graveyard")).toContain(shatterYellow.canonicalId);
  });

  it("boundary: cannot play without a 2H weapon attack on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, shatterYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(shatterYellow);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.zone("graveyard")).toContain(shatterYellow.canonicalId);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [shatterYellow],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([shatterYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
