import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { passingMirageBlue } from "../actions/passing-mirage.ts";
import { prism } from "../heroes/prism.ts";
import { irisOfReality } from "./iris-of-reality.ts";

describe("Iris of Reality (MON088) AAA", () => {
  it("happy: controlled Illusionist auras are 4{p} weapons with a once-per-turn attack", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        weapon1: [irisOfReality],
        hand: [passingMirageBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(passingMirageBlue);
    game.passBoth();
    Prism.activate(passingMirageBlue);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: Iris itself has no attack activation", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        weapon1: [irisOfReality],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).expectActivationRejected(irisOfReality);
  });
});
