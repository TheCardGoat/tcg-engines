import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { enigma } from "../heroes/enigma.ts";
import { cosmoScrollOfAncestralTapestry } from "./cosmo-scroll-of-ancestral-tapestry.ts";

describe("Cosmo, Scroll of Ancestral Tapestry (ENG002) AAA", () => {
  it("happy: a Ward aura is a weapon with base {p} equal to Ward", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        weapon1: [cosmoScrollOfAncestralTapestry],
        arena: [spectralShield],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(enigma).activateAttack(spectralShield);
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(1);
  });

  it("boundary: without Cosmo the aura has no Attack activation", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arena: [spectralShield],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(enigma).expectActivationRejected(spectralShield);
    expectCombat(game).toBeClosed();
  });

  it("timing: the aura Attack is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        weapon1: [cosmoScrollOfAncestralTapestry],
        arena: [spectralShield],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.activateAttack(spectralShield);
    expectCombat(game).toBeOpen();
    game.closeCombat({ optionals: "decline" });
    Enigma.expectActivationRejected(spectralShield);
  });
});
