import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { solitaryCompanionRed } from "./solitary-companion.ts";
import { singleMindedDeterminationRed } from "./single-minded-determination.ts";

describe("Single Minded Determination (MST146) AAA", () => {
  it("happy: entering with no other Illusionist aura puts three +1{p} counters on this", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [singleMindedDeterminationRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(singleMindedDeterminationRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, singleMindedDeterminationRed).toBeIn("arena");
    expectFabCard(Prism, singleMindedDeterminationRed).toHaveCounters(3);
  });

  it("boundary: controlling another Illusionist aura puts no counter on this", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [solitaryCompanionRed],
        hand: [singleMindedDeterminationRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(singleMindedDeterminationRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, singleMindedDeterminationRed).toBeIn("arena");
    expectFabCard(Prism, singleMindedDeterminationRed).toHaveCounters(0);
  });

  it("boundary: Ward 2 sits in the arena after it resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [singleMindedDeterminationRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(singleMindedDeterminationRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, singleMindedDeterminationRed).toHaveKeyword("ward");
  });
});
