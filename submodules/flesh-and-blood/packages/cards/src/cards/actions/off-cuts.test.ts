import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { frankieMakeEndsMeat } from "../heroes/frankie-make-ends-meat.ts";
import { offCutsBlue } from "./off-cuts.ts";

describe("Off Cuts (LSS022) AAA", () => {
  it("happy: each hero destroys an equipment they control", () => {
    const game = FabTestEngine.start(
      {
        hero: frankieMakeEndsMeat,
        hand: [offCutsBlue],
        head: [ironrotHelm],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        chest: [ironrotPlate],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Frankie = game.as(frankieMakeEndsMeat);
    const Dash = game.as(dash);

    Frankie.play(offCutsBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Frankie, ironrotHelm).toBeBanished();
    expectFabCard(Dash, ironrotPlate).toBeIn("graveyard");
    expectFabCard(Frankie, offCutsBlue).toBeIn("graveyard");
  });

  it("boundary: with no equipment, the action resolves and nothing is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: frankieMakeEndsMeat,
        hand: [offCutsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Frankie = game.as(frankieMakeEndsMeat);

    Frankie.play(offCutsBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Frankie, offCutsBlue).toBeIn("graveyard");
    expectFabPlayer(Frankie).toHaveAP(1);
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: frankieMakeEndsMeat,
        hand: [offCutsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Frankie = game.as(frankieMakeEndsMeat);

    Frankie.play(offCutsBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Frankie).toHaveAP(1);
  });
});
