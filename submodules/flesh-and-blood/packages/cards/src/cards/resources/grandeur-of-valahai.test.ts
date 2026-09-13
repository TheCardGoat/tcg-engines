import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimbleStrikeRed } from "../actions/nimble-strike.ts";
import { grandeurOfValahaiBlue } from "./grandeur-of-valahai.ts";

describe("Grandeur of Valahai (EVR000) AAA", () => {
  it("happy: pitches for 3 resources and creates a Seismic Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, grandeurOfValahaiBlue],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimbleStrikeRed, { pitch: [grandeurOfValahaiBlue] });
    game.passBoth();

    expectFabCard(Bravo, grandeurOfValahaiBlue).toBeIn("pitch");
    expectFabPlayer(Bravo).toHaveResourceCount(2);
    expect(Bravo.zone("arena")).toContain("token:seismic-surge");
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [grandeurOfValahaiBlue], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).play(grandeurOfValahaiBlue)).toThrow();
    expectFabCard(game.as(bravo), grandeurOfValahaiBlue).toBeIn("hand");
  });

  it("timing: pitching a different card does not create a Seismic Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimbleStrikeRed);
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain("token:seismic-surge");
  });
});
