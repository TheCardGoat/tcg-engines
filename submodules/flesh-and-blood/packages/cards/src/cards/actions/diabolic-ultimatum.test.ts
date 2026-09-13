import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { cromai } from "../allies/cromai.ts";
import { nekria } from "../allies/nekria.ts";
import { hazeShelterRed } from "../instants/haze-shelter.ts";
import { snatchRed } from "./snatch.ts";
import { cutNCarveRed } from "./cut-n-carve.ts";
import { diabolicUltimatumRed } from "./diabolic-ultimatum.ts";

/**
 * Diabolic Ultimatum (DYN174) — Runeblade Action, cost 3.
 *
 * Printed: If an attack action card was pitched to play Diabolic Ultimatum,
 * each hero chooses and destroys an ally they control.
 * If a 'non-attack' action card was pitched to play Diabolic Ultimatum, each
 * hero chooses and destroys an aura they control.
 */

describe("Diabolic Ultimatum (DYN174) AAA", () => {
  it("happy: pitching an attack action destroys one ally per hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [cromai],
        hand: [diabolicUltimatumRed, snatchRed],
        // cost 3 with 2 RP: the third resource must come from pitching the
        // only other card in hand — the attack action Snatch.
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [nekria], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(diabolicUltimatumRed, { pitch: [snatchRed] });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dromai, cromai).toBeIn("graveyard");
    expectFabCard(game.as(dash), nekria).toBeIn("graveyard");
  });

  it("happy: pitching a non-attack action destroys one aura per hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [hazeShelterRed],
        hand: [diabolicUltimatumRed, cutNCarveRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [nekria], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(diabolicUltimatumRed, { pitch: [cutNCarveRed] });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dromai, hazeShelterRed).toBeIn("graveyard");
    // Dash controls no aura, so her side of the chooser finds nothing.
    expectFabCard(game.as(dash), nekria).toBeIn("arena");
  });

  it("boundary: no pitch (full RP cover) leaves both legs inert", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [cromai],
        hand: [diabolicUltimatumRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [nekria], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(diabolicUltimatumRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dromai, cromai).toBeIn("arena");
    expectFabCard(game.as(dash), nekria).toBeIn("arena");
  });

  it("boundary: a non-attack pitch arms the aura leg, which no-ops without auras", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [cromai],
        hand: [diabolicUltimatumRed, cutNCarveRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [nekria], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(diabolicUltimatumRed, { pitch: [cutNCarveRed] });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Neither seat controls an aura, so each chooser stages an empty cohort
    // and the allies survive; the attack-action leg stayed un-armed because
    // only the non-attack action was pitched.
    expectFabCard(Dromai, cromai).toBeIn("arena");
    expectFabCard(game.as(dash), nekria).toBeIn("arena");
  });
});
