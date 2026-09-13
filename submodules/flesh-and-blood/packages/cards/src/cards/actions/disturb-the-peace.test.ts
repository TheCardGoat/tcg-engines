import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { emergingPowerRed } from "./emerging-power.ts";
import { snatchRed } from "./snatch.ts";
import { disturbThePeaceRed } from "./disturb-the-peace.ts";

/**
 * Disturb the Peace (SUP130) — Brute Action Attack 6{p}.
 *
 * Printed: This can't be defended by Guardian auras. When this hits a
 * Guardian hero, destroy an aura they control.
 *
 * Restrict-defend is Lay Waste / Cut Through the Facade. Hit-destroy is
 * ROS216 without the optional, `player: attack-target`. Guardian class
 * lives in types[]; Aura identity is subtypes (unioned with types).
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Disturb the Peace (SUP130) AAA", () => {
  it("happy: an unblocked hit on a Guardian hero destroys an aura they control", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [disturbThePeaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, arena: [emergingPowerRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(rhinar).playAttack(disturbThePeaceRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(14);
    expectFabCard(Bravo, emergingPowerRed).toBeIn("graveyard");
  });

  it("boundary: a non-Guardian hero keeps their aura, and a Guardian aura cannot defend", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [disturbThePeaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, arena: [emergingPowerRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(rhinar).playAttack(disturbThePeaceRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, emergingPowerRed).toBeIn("arena");

    const defendGame = FabTestEngine.start(
      { hero: rhinar, hand: [disturbThePeaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [emergingPowerRed, snatchRed], life: 20, deck: 6 },
      manual,
    );
    defendGame.as(rhinar).playAttack(disturbThePeaceRed);
    defendGame.advanceCombatTo("defend");
    expect(() => defendGame.as(bravo).defendWith(emergingPowerRed)).toThrow(
      /continuous effect prevents this card from defending/,
    );
    defendGame.as(bravo).defendWith(snatchRed);
    defendGame.helpers.resolveRestOfCombat();
    expectFabPlayer(defendGame.as(bravo)).toHaveLife(16);
  });

  it("timing: a later combat can be defended by a Guardian aura", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [disturbThePeaceRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [emergingPowerRed], life: 20, deck: 6 },
      manual,
    );
    const Rhinar = game.as(rhinar);
    const Bravo = game.as(bravo);

    Rhinar.playAttack(disturbThePeaceRed);
    Bravo.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(14);

    Rhinar.playAttack(snatchRed);
    Bravo.defendWith(emergingPowerRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(13);
  });
});
