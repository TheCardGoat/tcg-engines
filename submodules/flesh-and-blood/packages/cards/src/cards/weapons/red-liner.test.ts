import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { searingShotRed } from "../actions/searing-shot.ts";
import { redLiner } from "./red-liner.ts";

describe("Red Liner (CRU121) AAA", () => {
  it("happy: empty arsenal loads a face-up arrow from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [redLiner],
        hand: [searingShotRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(redLiner);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("boundary: occupied arsenal does not load a second arrow", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [redLiner],
        arsenal: [{ card: searingShotRed, state: { faceDown: false } }],
        hand: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(redLiner);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Azalea).toHaveHandCount(1);
    expect(Azalea.zone("arsenal")).toHaveLength(1);
  });
});
