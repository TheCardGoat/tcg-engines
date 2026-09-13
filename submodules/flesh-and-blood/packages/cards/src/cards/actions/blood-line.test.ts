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
import { bloodLineRed } from "./blood-line.ts";

/**
 * Blood Line (HNT063) — {r} less per Draconic chain link. Cost 2, 3{p}.
 */

describe("Blood Line (HNT063) AAA", () => {
  it("happy: one Draconic chain link reduces the 2{r} cost to 1", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [forTheRealmRed, bloodLineRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(forTheRealmRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(bloodLineRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Fai).toHaveResourceCount(0); // 3 - 2 - 1
  });

  it("boundary: with no Draconic links the full 2{r} is paid", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [bloodLineRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(bloodLineRed);
    expectFabPlayer(Fai).toHaveResourceCount(0);
  });

  it("timing: a non-Draconic prior link does not discount", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, bloodLineRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(bloodLineRed);
    expectFabPlayer(Fai).toHaveResourceCount(0);
  });
});
