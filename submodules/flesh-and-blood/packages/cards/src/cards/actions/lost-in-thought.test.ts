import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { lostInThoughtRed } from "./lost-in-thought.ts";

/**
 * Lost in Thought (DTD219) — Illusionist Action, cost 1, 2{d}, go again.
 *
 * Printed: "Look at target hero's hand. Choose an attack action card and
 * reveal it. If you do, they put it on the bottom of their deck and create a
 * Ponder token.\nGo again"
 *
 * The look step never stamps `looked-hero` / `it`, so choose-card and reveal
 * fail closed. Pin the unresolved-target throw; do not half-fix.
 */

describe("Lost in Thought (DTD219) AAA", () => {
  it("happy: look, choose an attack action, they put it on the bottom, create Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [lostInThoughtRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(lostInThoughtRed, { target: Dash.id });
    game.passBoth();
    Prism.target(snatchRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Prism).toHaveTokenCount("ponder", 1);
  });

  it("boundary: with no attack action in hand, no Ponder and the card stays", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [lostInThoughtRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(lostInThoughtRed, { target: Dash.id });
    game.passBoth();
    Prism.target();
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Prism).toHaveTokenCount("ponder", 1);
  });

  it("timing: go again refunds the action point spent", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [lostInThoughtRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(lostInThoughtRed, { target: game.as(dash).id });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expect(Prism.actionPoints()).toBe(1);
    expectFabCard(Prism, lostInThoughtRed).toBeIn("graveyard");
  });
});
