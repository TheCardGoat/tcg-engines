import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { snatchRed } from "./snatch.ts";
import { forTheRealmRed } from "./for-the-realm.ts";
import { bloodDropRed } from "./blood-drop.ts";

/**
 * Blood Drop (HNT062) — "This costs {r} less to play for each Draconic chain
 * link you control." Cost 1, 2{p}.
 */

describe("Blood Drop (HNT062) AAA", () => {
  it("happy: one Draconic chain link reduces the 1{r} cost to 0", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [forTheRealmRed, bloodDropRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(forTheRealmRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(bloodDropRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(2);
    expectFabPlayer(Fai).toHaveResourceCount(0); // 2 - 2 (realm) - 0 (drop)
  });

  it("boundary: with no Draconic links the full 1{r} is paid", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bloodDropRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(bloodDropRed);
    expectFabPlayer(Fai).toHaveResourceCount(0);
  });

  it("timing: a non-Draconic prior link does not discount", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, bloodDropRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(bloodDropRed);
    expectFabPlayer(Fai).toHaveResourceCount(0);
  });

  it("boundary: 0{r} cannot pay the undiscounted cost", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bloodDropRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(fai).playAttack(bloodDropRed)).toThrow();
  });
});
