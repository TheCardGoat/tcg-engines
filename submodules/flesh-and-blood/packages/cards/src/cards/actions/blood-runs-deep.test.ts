import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { roninRenegadeRed } from "./ronin-renegade.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { bloodRunsDeepRed } from "./blood-runs-deep.ts";

/**
 * Blood Runs Deep (HNT057) — Draconic Ninja Action - Attack, cost 2, 2{p}/3{d}.
 *
 * Printed: This costs {r} less for each Draconic chain link you control.
 * When this attacks a hero, each dagger you control deals 1 damage to them
 * (then destroy those daggers).
 */

describe("Blood Runs Deep (HNT057) AAA", () => {
  it("happy: one Draconic chain link reduces the cost so 1{r} pays this", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [roninRenegadeRed, bloodRunsDeepRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(roninRenegadeRed);
    game.advanceCombatTo("resolution");
    expectFabCard(Fai, bloodRunsDeepRed).toHaveCost(1);
    expect(() => Fai.playAttack(bloodRunsDeepRed, { stopAt: "on-attack" })).toThrow(
      /damage source is unresolved/,
    );
  });

  it("boundary: with no Draconic links, 1{r} cannot pay the printed cost 2", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bloodRunsDeepRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    expect(() => Fai.playAttack(bloodRunsDeepRed)).toThrow();
    expectFabCard(Fai, bloodRunsDeepRed).toBeIn("hand");
  });

  it("timing: on-attack, a controlled dagger deals 1 then is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bloodRunsDeepRed],
        weapon1: [nerveScalpel],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(bloodRunsDeepRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(2);
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
