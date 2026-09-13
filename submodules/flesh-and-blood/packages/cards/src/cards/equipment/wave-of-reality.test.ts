import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { arcanicCrackleBlue } from "../actions/arcanic-crackle.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { waveOfReality } from "./wave-of-reality.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";

/**
 * Wave of Reality (DYN214) — Illusionist Equipment - Arms, ward(1).
 * Printed: "When Wave of Reality is destroyed, create a Spectral Shield
 * token."
 * Engine gap: ward's prevention destroys the source on ANY hero damage,
 * not arcane only (engine/ward-destroys-on-non-arcane-damage).
 */

void spectralShield;

describe("Wave of Reality (DYN214) AAA", () => {
  it("pin: ward-negating an arcane hit destroys this but the token never lands", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [arcanicCrackleBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arms: [waveOfReality], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(arcanicCrackleBlue, { stopAt: "on-attack" });
    Chane.target(game.as(dash));
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), waveOfReality).toBeIn("graveyard");
    // Printed: a Spectral Shield token is created. PIN: the trigger fires
    // on combat-path destroys (see pin below) but the prevention-pipeline
    // destroy publishes no event this trigger observes — identical
    // PEN silken triggers DO fire on both paths
    // (engine/ward-prevention-destroy-eventless).
    expectFabPlayer(game.as(dash)).toHaveTokenCount("spectral-shield", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("pin: a non-arcane attack should spare this, but ward destroys on any damage", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arms: [waveOfReality], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Printed: ward prevents ARCANE damage only. PIN: the ward prevention
    // destroys its source on any hero damage
    // (engine/ward-destroys-on-non-arcane-damage).
    expectFabCard(game.as(dash), waveOfReality).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveTokenCount("spectral-shield", 1);
  });

  it("timing: a fully blocked arcane attack still trips the ward destroy", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [arcanicCrackleBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], arms: [waveOfReality], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(arcanicCrackleBlue, { stopAt: "on-attack" });
    Chane.target(game.as(dash));
    game.advanceUntil({ stopAt: "defend", optionals: "accept" });
    game.as(dash).defendWith([nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), waveOfReality).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveTokenCount("spectral-shield", 1);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
