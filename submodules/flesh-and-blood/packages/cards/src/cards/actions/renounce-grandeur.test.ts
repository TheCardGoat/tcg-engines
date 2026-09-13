import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { renounceGrandeurRed } from "./renounce-grandeur.ts";

/**
 * Renounce Grandeur Red (MPG034) — Guardian AAC, 7{p}.
 *
 * Printed: If the defending hero controls an aura token, this gets +1{p}.
 * Crush — When this deals 4 or more damage to a hero, they can't create
 * aura tokens during their next turn.
 */

describe("Renounce Grandeur (MPG034) AAA", () => {
  it("happy: an aura token they control makes this 8{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [renounceGrandeurRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [fabToken("might")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(renounceGrandeurRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: without an aura token this stays 7{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [renounceGrandeurRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(renounceGrandeurRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("timing: fully blocked, the aura-token +1{p} still applies but crush does not", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [renounceGrandeurRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [fabToken("might")],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(renounceGrandeurRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
