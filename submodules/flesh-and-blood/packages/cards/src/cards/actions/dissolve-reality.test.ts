import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { dissolveRealityYellow } from "./dissolve-reality.ts";

describe("Dissolve Reality (HVY253) AAA", () => {
  it("happy: each hero puts their arsenal on the bottom and creates a Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [dissolveRealityYellow],
        arsenal: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arsenal: [snatchRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(dissolveRealityYellow);
    game.helpers.resolveUntilIdle();

    expect(Prism.zone("arsenal")).toHaveLength(0);
    expect(Dash.zone("arsenal")).toHaveLength(0);
    expect(Prism.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
    expect(Dash.zone("deck")[0]).toBe(snatchRed.canonicalId);
    expectFabPlayer(Prism).toHaveTokenCount("ponder", 1);
    expectFabPlayer(Dash).toHaveTokenCount("ponder", 1);
    expectFabToken(game, "ponder").toHaveCount(2);
    expectFabCard(Prism, dissolveRealityYellow).toBeIn("graveyard");
  });

  it("boundary: empty arsenals stay empty and cards in hand are not bottomed", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [dissolveRealityYellow, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(dissolveRealityYellow);
    game.helpers.resolveUntilIdle();

    expect(Prism.zone("arsenal")).toHaveLength(0);
    expect(Dash.zone("arsenal")).toHaveLength(0);
    expectFabCard(Prism, nimblismBlue).toBeIn("hand");
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabPlayer(Prism).toHaveTokenCount("ponder", 1);
    expectFabPlayer(Dash).toHaveTokenCount("ponder", 1);
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [dissolveRealityYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(dissolveRealityYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Prism).toHaveAP(1);
  });
});
