import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { sicEmShotBlue } from "../actions/sic-em-shot.ts";
import { skullboneCrosswrap } from "./skullbone-crosswrap.ts";

/**
 * Skullbone Crosswrap (ARC041) — Ranger Head d1, Arcane Barrier 1, Blade Break.
 *
 * Printed: "Once per Turn Action - Turn a face down card in your arsenal face
 * up: Opt 1. Go again. Arcane Barrier 1. Blade Break"
 */

describe("Skullbone Crosswrap (ARC041) AAA", () => {
  it("happy: turning the face-down arsenal card face up opts and refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [skullboneCrosswrap],
        arsenal: [{ card: sicEmShotBlue, state: { faceDown: true } }],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(skullboneCrosswrap);
    game.untilIdle({ optBottom: 1 });

    expectFabCard(Azalea, sicEmShotBlue).toBeIn("arsenal");
    expectFabCard(Azalea, sicEmShotBlue).toBeFaceUp();
    expectFabCard(Azalea, skullboneCrosswrap).toBeIn("head");
    expectFabPlayer(Azalea).toHaveAP(1); // go again pays the action point back
  });

  it("boundary: the once-per-turn limit blocks a second activation", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [skullboneCrosswrap],
        arsenal: [{ card: sicEmShotBlue, state: { faceDown: true } }],
        hand: [],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(skullboneCrosswrap);
    game.untilIdle({ optBottom: 1 });
    Azalea.expectActivationRejected(skullboneCrosswrap);
    expectFabCard(Azalea, skullboneCrosswrap).toBeIn("head");
  });

  it("boundary: with no face-down arsenal card the Action cannot be activated", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [skullboneCrosswrap],
        arsenal: [],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.expectActivationRejected(skullboneCrosswrap);
    expectFabCard(Azalea, skullboneCrosswrap).toBeIn("head");
  });
});
