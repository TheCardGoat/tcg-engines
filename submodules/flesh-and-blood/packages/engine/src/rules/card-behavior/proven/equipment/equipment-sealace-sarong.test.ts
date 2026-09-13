import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { azalea, dash, deathDealer } from "../../../fixtures.ts";
import { longShotBlue } from "../../../../../../cards/src/cards/actions/long-shot.ts";
import { longShotRed } from "../../../../../../cards/src/cards/actions/long-shot.ts";
import { sealaceSarong } from "../../../../../../cards/src/cards/equipment/sealace-sarong.ts";

describe("sealace-sarong (SEA095)", () => {
  it("AAA: turns a face-down blue arrow face-up and gives that arrow go again", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        legs: [sealaceSarong],
        arsenal: [{ card: longShotBlue, state: { faceDown: true } }],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);
    const arrowId = Azalea.findCardInZone("arsenal", longShotBlue);
    expect(game.objectState(arrowId)?.faceDown).toBe(true);

    Azalea.activate(sealaceSarong);
    game.passBoth();
    expect(game.objectState(arrowId)?.faceDown).toBe(false);
    expect(Azalea.zone("legs")).toContain(sealaceSarong.canonicalId);

    Azalea.playFromArsenal(longShotBlue, { target: game.as(dash).id });
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(19);
    expect(Azalea.actionPoints()).toBe(1);
  });

  it("boundary: a face-up or red arrow cannot pay the blue face-down target cost", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        legs: [sealaceSarong],
        arsenal: [{ card: longShotBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const rejected = game.as(azalea).expectFailure({
      move: "activate",
      payload: { instanceId: game.as(azalea).findCardInZone("legs", sealaceSarong) },
    });
    expect(rejected.accepted).toBe(false);
    expect(game.as(azalea).zone("legs")).toContain(sealaceSarong.canonicalId);

    const redGame = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        legs: [sealaceSarong],
        arsenal: [{ card: longShotRed, state: { faceDown: true } }],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const redRejected = redGame.as(azalea).expectFailure({
      move: "activate",
      payload: { instanceId: redGame.as(azalea).findCardInZone("legs", sealaceSarong) },
    });
    expect(redRejected.accepted).toBe(false);
  });
});
