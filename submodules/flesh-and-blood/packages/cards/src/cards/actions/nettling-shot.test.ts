import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { cintariSellsword } from "../tokens/cintari-sellsword.ts";
import { nimblismBlue } from "./nimblism.ts";
import { nettlingShotRed } from "./nettling-shot.ts";

describe("Nettling Shot (SEA108) AAA", () => {
  it("happy: loading this face-up into arsenal may tap an ally", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deckTop: [nettlingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], arena: [cintariSellsword], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Azalea, nettlingShotRed).toBeIn("arsenal");
    // The accepted optional taps the targeted ally.
    const allyId = game.as(dash).cardIn("arena", cintariSellsword).instanceId;
    const tapped = game.getState().objects[allyId]?.markers.some((m) => m.kind === "tapped");
    expect(tapped).toBe(true);
  });

  it("boundary: declining the tap leaves the ally untapped", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deckTop: [nettlingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], arena: [cintariSellsword], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Azalea, nettlingShotRed).toBeIn("arsenal");
    expectFabCard(game.as(dash), cintariSellsword).toBeReady();
  });

  it("boundary: no ally means the optional does not tap a hero", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deckTop: [nettlingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Azalea, nettlingShotRed).toBeIn("arsenal");
    expectFabCard(game.as(dash), dash).toBeReady();
  });
});
