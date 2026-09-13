import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { dash } from "../heroes/dash.ts";
import { passingMirageBlue } from "../actions/passing-mirage.ts";
import { hazeBendingBlue } from "../actions/haze-bending.ts";
import { crownOfReflection } from "./crown-of-reflection.ts";

/**
 * Crown of Reflection — Illusionist Head d0, Arcane Barrier 1.
 * Printed: "Instant - Destroy Crown of Reflection: Destroy target Illusionist
 * aura you control. If you do, you may put an Illusionist aura card from your
 * hand into the arena with cost less than or equal the aura destroyed this
 * way. Activate Crown of Reflection only during your action phase."
 * Passing Mirage (0{r} aura) is destroyed; Haze Bending (0{r} aura) rides in.
 */

describe("Crown of Reflection AAA", () => {
  it("happy: destroying the arena aura lets a cheaper-or-equal hand aura ride in", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        head: [crownOfReflection],
        arena: [passingMirageBlue],
        hand: [hazeBendingBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.activate(crownOfReflection);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Prism, crownOfReflection).toBeIn("graveyard");
    expectFabCard(Prism, passingMirageBlue).toBeIn("graveyard");
    expectFabCard(Prism, hazeBendingBlue).toBeIn("arena");
  });

  it("boundary: declining the ride leaves the hand aura in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        head: [crownOfReflection],
        arena: [passingMirageBlue],
        hand: [hazeBendingBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.activate(crownOfReflection);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Prism, crownOfReflection).toBeIn("graveyard");
    expectFabCard(Prism, passingMirageBlue).toBeIn("graveyard");
    expectFabCard(Prism, hazeBendingBlue).toBeIn("hand");
  });
});
