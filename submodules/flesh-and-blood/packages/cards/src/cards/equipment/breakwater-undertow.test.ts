import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { barnacleYellow } from "../actions/barnacle.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { breakwaterUndertow } from "./breakwater-undertow.ts";

/**
 * Breakwater Undertow (AGB007) — printed:
 * "Attack Reaction - Destroy this: Target Pirate ally attack gets go again.
 * When the combat chain closes, destroy the ally. Blade Break"
 *
 * Mode B (fab-rules): CR 5.2 activated abilities; CR 7.4 attack reactions are
 * activatable only during the Reaction Step by the attack's controller;
 * CR 8.3.5 go again refunds an action point when the chain link resolves;
 * the delayed destroy fires on combat-chain close, not at grant time.
 */
describe("Breakwater Undertow (AGB007) AAA", () => {
  it("happy: destroy this to give a Pirate ally attack go again, then the ally is destroyed when the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        legs: [breakwaterUndertow],
        arena: [barnacleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(barnacleYellow);
    game.advanceCombatTo("reaction");
    Gravy.activate(breakwaterUndertow);
    game.passBoth();

    // Cost paid: the legs equipment is destroyed into the graveyard.
    expectFabCard(Gravy, breakwaterUndertow).toBeIn("graveyard");
    // Printed result: the Pirate ally attack has go again while the link is open.
    expectCombat(game).toHaveKeyword("go-again");

    game.helpers.resolveRestOfCombat();

    // Go again refunded the action point spent on the ally's attack ability.
    expectFabPlayer(Gravy).toHaveAP(1);
    // Chain-close delayed trigger: the attacking ally is destroyed.
    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
  });

  it("boundary: a non-Pirate-ally attack is not a legal target and the reaction is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        legs: [breakwaterUndertow],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("reaction");

    // A Generic attack action fails the Pirate-Ally target filter.
    Gravy.expectActivationRejected(breakwaterUndertow);
    expectFabCard(Gravy, breakwaterUndertow).toBeIn("legs");

    game.helpers.resolveRestOfCombat();

    // No go again was granted: the spent action point is not refunded.
    expectFabPlayer(Gravy).toHaveAP(0);
    expect(game.combat()).toBeNull();
  });

  it("timing: the ally is not destroyed at grant time — it survives on the open chain until close", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        legs: [breakwaterUndertow],
        arena: [barnacleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(barnacleYellow);
    game.advanceCombatTo("reaction");
    Gravy.activate(breakwaterUndertow);
    game.passBoth();

    // While the link stays open, go again is live but the ally has not been
    // destroyed yet — it is the attack proxy on the combat chain.
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Gravy, barnacleYellow).toBeIn("combatChain");

    game.helpers.resolveRestOfCombat();

    expect(game.combat()).toBeNull();
    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
  });
});
