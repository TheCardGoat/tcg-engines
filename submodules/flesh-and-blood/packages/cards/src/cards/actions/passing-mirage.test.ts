import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { dash } from "../heroes/dash.ts";
import { spearsOfSurrealityBlue } from "./spears-of-surreality.ts";
import { spearsOfSurrealityRed } from "./spears-of-surreality.ts";
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";
import { snatchRed } from "./snatch.ts";
import { passingMirageBlue } from "./passing-mirage.ts";

/**
 * Passing Mirage (EVR142) — Illusionist Action - Aura, cost 0, Spectra.
 *
 * Printed: Your first Illusionist attack each turn loses and can't get
 * phantasm. Spectra.
 */

describe("Passing Mirage (EVR142) AAA", () => {
  it("happy: the first Illusionist attack loses phantasm so a p6 block does not pop it", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [passingMirageBlue, spearsOfSurrealityBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(passingMirageBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Prism, passingMirageBlue).toBeIn("arena");

    Prism.playAttack(spearsOfSurrealityBlue);
    expectCombat(game).notToHaveKeyword("phantasm");
    Dash.defendWith(regurgitatingSlogRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: the second Illusionist attack this turn still has phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [passingMirageBlue, spearsOfSurrealityBlue, spearsOfSurrealityRed],
        resourcePoints: 2,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(passingMirageBlue);
    game.helpers.resolveUntilIdle();
    Prism.playAttack(spearsOfSurrealityBlue);
    expectCombat(game).notToHaveKeyword("phantasm");
    game.helpers.resolveRestOfCombat();

    Prism.playAttack(spearsOfSurrealityRed);
    expectCombat(game).toHaveKeyword("phantasm");
    Dash.defendWith(regurgitatingSlogRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, spearsOfSurrealityRed).toBeIn("graveyard");
    expectCombat(game).toBeClosed();
    // First Spears Blue was undefended (3 damage); the second popped.
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("timing: Spectra — destroying the aura as the attack target closes combat without damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: prism, arena: [passingMirageBlue], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Prism = game.as(prism);
    const spectraId = Prism.findCardInZone("arena", passingMirageBlue);

    Dash.play(snatchRed, { target: spectraId });
    expectFabCard(Prism, passingMirageBlue).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();
    expectCombat(game).toBeClosed();
    expectFabPlayer(Prism).toHaveLife(40);
  });
});
