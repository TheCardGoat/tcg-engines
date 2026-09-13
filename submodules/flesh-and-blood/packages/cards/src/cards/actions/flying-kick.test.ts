import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { snatchRed } from "./snatch.ts";
import { flyingKickRed } from "./flying-kick.ts";

/**
 * Flying Kick (IRA007) — Ninja Action - Attack, cost 2, 5{p}, 3{d}.
 * Printed: "If this was played as chain link 3 or higher, it gets +2{p}."
 */

describe("Flying Kick (IRA007) AAA", () => {
  it("happy: chain link 1 stays at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [flyingKickRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(fai).attackWith(flyingKickRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("happy: chain link 3 gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [zeroToSixtyRed, snatchRed, flyingKickRed],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(zeroToSixtyRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(snatchRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(flyingKickRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: chain link 2 stays at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, flyingKickRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(snatchRed);
    game.advanceCombatTo("resolution");
    Fai.attackWith(flyingKickRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });
});
