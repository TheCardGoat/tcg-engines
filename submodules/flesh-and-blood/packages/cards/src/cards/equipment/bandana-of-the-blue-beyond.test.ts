import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { bandanaOfTheBlueBeyond } from "./bandana-of-the-blue-beyond.ts";

describe("Bandana of the Blue Beyond (SEA179) AAA", () => {
  it("happy: discard and destroy this to put a blue GY card on the deck bottom", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [bandanaOfTheBlueBeyond],
        hand: [snatchRed],
        graveyard: [nimblismBlue],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(bandanaOfTheBlueBeyond);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, bandanaOfTheBlueBeyond).toBeIn("graveyard");
    expect(Dash.zone("graveyard")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: empty hand cannot pay the discard cost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [bandanaOfTheBlueBeyond],
        hand: [],
        graveyard: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(bandanaOfTheBlueBeyond);
    expectFabCard(Dash, bandanaOfTheBlueBeyond).toBeIn("head");
  });

  it("timing: with no blue in graveyard the recycle is a no-op after the cost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [bandanaOfTheBlueBeyond],
        hand: [snatchRed],
        graveyard: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(bandanaOfTheBlueBeyond);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, bandanaOfTheBlueBeyond).toBeIn("graveyard");
    expect(Dash.zone("deck")[0]).not.toBe(snatchRed.canonicalId);
    expect(Dash.zone("graveyard")).toContain(snatchRed.canonicalId);
  });
});
