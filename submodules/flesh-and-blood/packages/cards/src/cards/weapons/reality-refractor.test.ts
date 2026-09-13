import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { realityRefractor } from "./reality-refractor.ts";

describe("Reality Refractor (DTD216) AAA", () => {
  it("happy: an Illusionist aura is a 5{p} weapon you can attack with", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        weapon1: [realityRefractor],
        arena: [spectralShield],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).activateAttack(spectralShield);
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: without Reality Refractor the aura has no Attack activation", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [spectralShield],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(prism).expectActivationRejected(spectralShield);
    expectCombat(game).toBeClosed();
  });

  it("timing: the aura attack costs 2 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        weapon1: [realityRefractor],
        arena: [spectralShield],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(prism).expectActivationRejected(spectralShield);
    expectCombat(game).toBeClosed();
  });
});
