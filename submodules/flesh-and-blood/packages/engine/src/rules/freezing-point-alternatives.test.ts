import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, sigilOfSolaceRed } from "./fixtures.ts";
import { freezingPointRed } from "../../../cards/src/cards/actions/freezing-point.ts";
import { winterSGraspYellow } from "../../../cards/src/cards/actions/winter-s-grasp.ts";
import { frostbite } from "../../../cards/src/cards/tokens/frostbite.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Freezing Point alternative arcane damage", () => {
  it("AAA fused: evaluates X against the chosen hero's live Frostbite count, not before targeting", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        resourcePoints: 3,
        hand: [freezingPointRed, winterSGraspYellow, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        arena: [frostbite],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    expect(Dash.zone("arena")).toContain(frostbite.canonicalId);

    Bravo.play(freezingPointRed, {
      target: Dash.id,
      fuse: true,
      fuseCards: [winterSGraspYellow],
    });
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(lifeBefore - 6);
  });
});
