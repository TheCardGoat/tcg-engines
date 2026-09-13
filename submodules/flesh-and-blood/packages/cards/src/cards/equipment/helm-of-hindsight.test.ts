import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { helmOfHindsight } from "./helm-of-hindsight.ts";

describe("Helm of Hindsight (SUP211) AAA", () => {
  it("happy: Instant 3{r} destroy this to put a GY AAC on top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [helmOfHindsight],
        graveyard: [snatchRed, nimblismBlue],
        resourcePoints: 3,
        hand: [],
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(helmOfHindsight);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, helmOfHindsight).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(0);
    expect(Dash.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
  });

  it("boundary: 2{r} cannot pay the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [helmOfHindsight],
        graveyard: [snatchRed],
        resourcePoints: 2,
        hand: [],
        deck: 4,
      },
      { hero: bravo, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(helmOfHindsight);
    expectFabCard(Dash, helmOfHindsight).toBeIn("head");
  });

  it("timing: a non-attack in graveyard is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [helmOfHindsight],
        graveyard: [nimblismBlue],
        resourcePoints: 3,
        hand: [],
        deck: 4,
      },
      { hero: bravo, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(helmOfHindsight);
    expectFabCard(Dash, helmOfHindsight).toBeIn("head");
  });
});
