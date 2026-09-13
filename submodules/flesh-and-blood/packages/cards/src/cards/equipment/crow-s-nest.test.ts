import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { searingShotRed } from "../shared/test-recipients.ts";
import { crowSNest } from "./crow-s-nest.ts";

describe("Crow's Nest (AZL003) AAA", () => {
  it("happy: paying {r} puts an aim counter on an arrow loaded face-up from deck", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon2: [crowSNest],
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [searingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal").toHaveCounters(1, "aim");
  });

  it("boundary: declining the pay leaves the loaded arrow without aim", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon2: [crowSNest],
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [searingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal").toHaveCounters(0, "aim");
  });

  it("boundary: a non-arrow loaded from deck does not get aim", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon2: [crowSNest],
        arsenal: [{ card: searingShotRed, state: { faceDown: false } }],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Azalea, nimblismBlue).toBeIn("arsenal").toHaveCounters(0, "aim");
  });
});
