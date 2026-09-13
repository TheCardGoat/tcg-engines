import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { barnacleYellow } from "./barnacle.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { cuttySharkQuickClipYellow } from "./cutty-shark-quick-clip.ts";

describe("Cutty Shark, Quick Clip (SEA076) AAA", () => {
  it("happy: the next ally attack this turn gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [cuttySharkQuickClipYellow, barnacleYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(cuttySharkQuickClipYellow, {
      abilityId: `${cuttySharkQuickClipYellow.canonicalId}:oncePerTurnActionNextAllyAttackTurnGets`,
    });
    game.passBoth();
    Gravy.activate(barnacleYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a non-ally attack is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [cuttySharkQuickClipYellow],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(cuttySharkQuickClipYellow, {
      abilityId: `${cuttySharkQuickClipYellow.canonicalId}:oncePerTurnActionNextAllyAttackTurnGets`,
    });
    game.passBoth();
    Gravy.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the Once per Turn Action cannot fire twice", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [cuttySharkQuickClipYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(cuttySharkQuickClipYellow, {
      abilityId: `${cuttySharkQuickClipYellow.canonicalId}:oncePerTurnActionNextAllyAttackTurnGets`,
    });
    game.passBoth();
    expect(() =>
      Gravy.activate(cuttySharkQuickClipYellow, {
        abilityId: `${cuttySharkQuickClipYellow.canonicalId}:oncePerTurnActionNextAllyAttackTurnGets`,
      }),
    ).toThrow();
    expectFabCard(Gravy, cuttySharkQuickClipYellow).toBeIn("arena");
  });
});
