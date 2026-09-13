import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { waxingSpecterRed } from "./waxing-specter.ts";

describe("Waxing Specter (ENG010/MST044/045) AAA", () => {
  it("happy: pitching blue this turn enters with a +1{p} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [waxingSpecterRed, nimblismBlue],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.must.pitch(nimblismBlue).play(waxingSpecterRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, waxingSpecterRed).toBeIn("arena");
    expectFabCard(Prism, waxingSpecterRed).toHaveCounters(1);
  });

  it("boundary: a resource-paid play enters without a power counter", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [waxingSpecterRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(waxingSpecterRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, waxingSpecterRed).toBeIn("arena");
    expectFabCard(Prism, waxingSpecterRed).toHaveCounters(0);
  });
});
