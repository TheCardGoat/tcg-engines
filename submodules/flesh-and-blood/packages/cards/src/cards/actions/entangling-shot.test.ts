import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "./nimblism.ts";
import { entanglingShotRed } from "./entangling-shot.ts";

describe("Entangling Shot (SEA107) AAA", () => {
  it("happy: loading this face-up into arsenal may tap a hero", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deckTop: [entanglingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Azalea, entanglingShotRed).toBeIn("arsenal");
    // The accepted optional taps the opposing hero.
    const dashHeroId = game.getState().containers.zonesByPlayerId[game.as(dash).id].heroZone[0];
    const tapped = game.getState().objects[dashHeroId]?.markers.some((m) => m.kind === "tapped");
    expect(tapped).toBe(true);
  });

  it("boundary: declining the tap leaves the opposing hero untapped", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deckTop: [entanglingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Azalea, entanglingShotRed).toBeIn("arsenal");
    expectFabCard(game.as(dash), dash).toBeReady();
  });

  it("timing: an already-arsenal copy does not tap when combat starts", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [{ card: entanglingShotRed, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(azalea), entanglingShotRed).toBeIn("arsenal");
    expectFabCard(game.as(dash), dash).toBeReady();
  });
});
