import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { barnacleYellow } from "./barnacle.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { burlyBonesRed } from "./burly-bones.ts";

describe("Burly Bones family AAA", () => {
  it("happy: discarding a watery-grave card grants overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [burlyBonesRed, barnacleYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(burlyBonesRed, { stopAt: "on-attack" });
    Gravy.accept();
    Gravy.choose("discard");
    Gravy.target(barnacleYellow);
    expectCombat(game).toHaveKeyword("overpower");
    game.closeCombat({ ordering: "listed" });
  });

  it("boundary: declining leaves printed 6{p} without extra overpower from the rider", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [burlyBonesRed, barnacleYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(burlyBonesRed, { stopAt: "on-attack" });
    Gravy.decline();
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ ordering: "listed" });
    expectFabCard(Gravy, barnacleYellow).toBeIn("hand");
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: gravyBones, hand: [burlyBonesRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(gravyBones).play(burlyBonesRed)).toThrow();
    expectFabCard(game.as(gravyBones), burlyBonesRed).toBeIn("hand");
  });
});
