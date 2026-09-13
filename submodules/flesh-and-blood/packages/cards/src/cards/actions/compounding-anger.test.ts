import { describe, it } from "vitest";
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
import { compoundingAngerRed } from "./compounding-anger.ts";

/**
 * Compounding Anger (HNT151) — {r} less per Draconic chain link. Cost 3, 5{p}.
 */

describe("Compounding Anger (HNT151) AAA", () => {
  it("happy: one Draconic chain link reduces the 3{r} cost to 2", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [forTheRealmRed, compoundingAngerRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(forTheRealmRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(compoundingAngerRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Fai).toHaveResourceCount(0); // 4 - 2 - 2
  });

  it("boundary: with no Draconic links the full 3{r} is paid", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [compoundingAngerRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(compoundingAngerRed);
    expectFabPlayer(Fai).toHaveResourceCount(0);
  });

  it("timing: a non-Draconic prior link does not discount", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, compoundingAngerRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(compoundingAngerRed);
    expectFabPlayer(Fai).toHaveResourceCount(0);
  });
});
