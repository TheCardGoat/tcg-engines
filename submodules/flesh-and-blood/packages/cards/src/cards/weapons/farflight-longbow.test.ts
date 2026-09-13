import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { searingShotRed } from "../actions/searing-shot.ts";
import { farflightLongbow } from "./farflight-longbow.ts";

describe("Farflight Longbow (PEN078) AAA", () => {
  it("happy: Instant loads a face-up arrow from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [farflightLongbow],
        hand: [searingShotRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    Azalea.activate(farflightLongbow);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
  });

  it("boundary: without an arrow the bow stays seated", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [farflightLongbow],
        hand: [],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    Azalea.activate(farflightLongbow);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabCard(Azalea, farflightLongbow).toBeIn("weapon1");
  });
});
