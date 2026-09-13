import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { hammerheadHarpoonCannon } from "../weapons/hammerhead-harpoon-cannon.ts";
import { snatchRed } from "./snatch.ts";
import { redLureHarpoonBlue } from "./red-lure-harpoon.ts";

/**
 * Red Lure Harpoon (OMN241) — Pirate Ranger Arrow Attack.
 * Printed: If you've activated a cannon this turn, this gets “When this hits
 * a hero, banish a red action card from their graveyard. You may play it
 * until the end of your next turn.”
 */

describe("Red Lure Harpoon (OMN241) AAA", () => {
  it("happy: after activating a cannon, a hit banishes a red action from their GY", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [hammerheadHarpoonCannon],
        arsenal: [{ card: redLureHarpoonBlue, state: { faceDown: false } }],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], graveyard: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.activate(hammerheadHarpoonCannon);
    game.helpers.resolveUntilIdle();
    Azalea.playAttack(redLureHarpoonBlue, { from: "arsenal" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "maximum" });

    expectFabCard(Dash, snatchRed).toBeIn("banished");
  });

  it("boundary: without a cannon activation this turn, a hit does not banish", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: redLureHarpoonBlue, state: { faceDown: false } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], graveyard: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(redLureHarpoonBlue, { from: "arsenal" });
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });

  it("timing: defending with this does not throw, and does not grant the hit rider", () => {
    const game = FabTestEngine.start(
      { hero: azalea, hand: [redLureHarpoonBlue], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Azalea.defendWith([redLureHarpoonBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Azalea, redLureHarpoonBlue).toBeIn("graveyard");
  });
});
