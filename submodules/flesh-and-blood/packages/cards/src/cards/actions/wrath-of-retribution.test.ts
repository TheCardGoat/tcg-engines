import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { wrathOfRetributionRed } from "./wrath-of-retribution.ts";

describe("Wrath of Retribution (CIN021) AAA", () => {
  it("happy: a prior Draconic chain link reduces this cost by 1", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixFlameRed, wrathOfRetributionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(phoenixFlameRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(wrathOfRetributionRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: with no Draconic chain links, 2{r} cannot pay the printed 3", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [wrathOfRetributionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Fai = game.as(fai);

    expectFabCard(Fai, wrathOfRetributionRed).toHaveCost(3);
    expect(() => Fai.playAttack(wrathOfRetributionRed)).toThrow();
    expectFabCard(Fai, wrathOfRetributionRed).toBeIn("hand");
  });

  it("timing: when this attacks, a dagger you control gets +1{p} this combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [wrathOfRetributionRed],
        weapon1: [nerveScalpel],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(wrathOfRetributionRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.advanceCombatTo("resolution");
    Fai.activateAttack(nerveScalpel);
    expectCombat(game).toHaveAttackPower(2);
  });
});
