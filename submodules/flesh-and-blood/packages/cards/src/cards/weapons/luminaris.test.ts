import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { luminaris } from "./luminaris.ts";

describe("Luminaris (MON003) AAA", () => {
  it("happy: an Illusionist aura is a 1{p} weapon you can attack with", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        weapon1: [luminaris],
        arena: [spectralShield],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).activateAttack(spectralShield);
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(1);
  });

  it("boundary: without Luminaris the aura has no Attack activation", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [spectralShield],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(prism).expectActivationRejected(spectralShield);
    expectCombat(game).toBeClosed();
  });

  it("timing: the aura Attack is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        weapon1: [luminaris],
        arena: [spectralShield],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.activateAttack(spectralShield);
    expectCombat(game).toBeOpen();
    game.closeCombat({ optionals: "decline" });
    Prism.expectActivationRejected(spectralShield);
  });
});
