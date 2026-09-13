import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { dromaiAshArtist } from "./dromai-ash-artist.ts";
import { nimblismRed } from "../actions/nimblism.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { ash } from "../tokens/ash.ts";
import { aetherAshwing } from "../tokens/aether-ashwing.ts";

describe("Dromai, Ash Artist (UPR001) AAA", () => {
  it("happy: pitching a red card creates Ash", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [snatchRed, tomeOfFyendalYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(tomeOfFyendalYellow, { pitch: [snatchRed] });
    game.passBoth();

    expectFabPlayer(Dromai).toHaveTokenCount("ash", 1);
  });

  it("boundary: adult hero is 40 life", () => {
    const game = FabTestEngine.start({ hero: dromaiAshArtist, deck: 6 }, { hero: dash, deck: 6 });
    expectFabPlayer(game.as(dromaiAshArtist)).toHaveLife(40);
  });

  it("core mechanic: after playing a red card, an attacking dragon gets go again", () => {
    // red-hot condition: dragons you control get go again while attacking.
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        weapon1: [stormOfSandikai],
        arena: [aetherAshwing, ash],
        hand: [nimblismRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dromai = game.as(dromaiAshArtist);

    // Play the red non-attack action (go again refunds its own AP).
    Dromai.play(nimblismRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dromai).toHaveAP(1);

    // Storm of Sandikai grants the Dragon ally its once-per-turn attack.
    Dromai.activate(aetherAshwing);
    expectFabPlayer(Dromai).toHaveAP(0);

    // The undestroyed dragon attack resolves and its go again refunds the AP.
    game.helpers.resolveUntilIdle();
    expectCombat(game).toBeClosed();
    expectFabPlayer(Dromai).toHaveAP(1);
  });

  it("boundary: without a red card played this turn, the dragon attack does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        weapon1: [stormOfSandikai],
        arena: [aetherAshwing, ash],
        hand: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.activate(aetherAshwing);
    game.helpers.resolveUntilIdle();
    expectCombat(game).toBeClosed();
    // No red card played → the printed condition is false → no AP refund.
    expectFabPlayer(Dromai).toHaveAP(0);
  });

  it("timing: pitching a non-red card does not create Ash", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [snatchRed, tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(tomeOfFyendalYellow);
    game.passBoth();

    expect(Dromai.zone("arena")).not.toContain("token:ash");
  });
});
