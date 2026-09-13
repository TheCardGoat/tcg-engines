import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { manifestationOfMiragaiBlue } from "./manifestation-of-miragai.ts";

/**
 * Manifestation of Miragai (MST031) — Illusionist Instant Aura.
 *
 * Printed: This enters the arena with two +1{p} counters. If a Chi was
 * pitched to play this, instead this enters the arena with four +1{p}
 * counters. Ward X, where X is the number of +1{p} counters on this.
 */

describe("Manifestation of Miragai (MST031) AAA", () => {
  it("happy: pitching Inner Chi enters with four +1{p} counters", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [manifestationOfMiragaiBlue, innerChiBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    Enigma.must.pitch(innerChiBlue).playInstant(manifestationOfMiragaiBlue);
    game.passBoth();
    expectFabCard(Enigma, manifestationOfMiragaiBlue).toBeIn("arena");
    expectFabCard(Enigma, manifestationOfMiragaiBlue).toHaveCounters(4);
  });

  it("boundary: without Chi this enters with two +1{p} counters", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [manifestationOfMiragaiBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    Enigma.must.pitch(nimblismBlue).playInstant(manifestationOfMiragaiBlue);
    game.passBoth();
    expectFabCard(Enigma, manifestationOfMiragaiBlue).toBeIn("arena");
    expectFabCard(Enigma, manifestationOfMiragaiBlue).toHaveCounters(2);
  });

  it("timing: the aura stays in arena after the instant resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [manifestationOfMiragaiBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    Enigma.must.playInstant(manifestationOfMiragaiBlue);
    game.passBoth();
    expectFabCard(Enigma, manifestationOfMiragaiBlue).toBeIn("arena");
    expectFabCard(Enigma, manifestationOfMiragaiBlue).toHaveCounters(2);
  });
});
