import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { surgingStrikeRed } from "./surging-strike.ts";
import { snatchRed } from "./snatch.ts";
import { tempestPalmGustwaveYellow } from "./tempest-palm-gustwave.ts";

/**
 * Tempest Palm Gustwave (SUP246) — Ninja Action - Attack, cost 0, 3{p}, 3{d}.
 * Printed: "Combo - If Surging Strike was the last attack this combat chain,
 * this gets +2{p}. If this is played at chain link 3 or higher, this gets
 * go again."
 */

describe("Tempest Palm Gustwave (SUP246) AAA", () => {
  it("happy: Combo after Surging Strike gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [surgingStrikeRed, tempestPalmGustwaveYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(surgingStrikeRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(tempestPalmGustwaveYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("boundary: a non-Surging Strike last attack does not get +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, tempestPalmGustwaveYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(snatchRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(tempestPalmGustwaveYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: played at chain link 3 this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [zeroToSixtyRed, snatchRed, tempestPalmGustwaveYellow],
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(zeroToSixtyRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(snatchRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(tempestPalmGustwaveYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("go-again");
  });
});
