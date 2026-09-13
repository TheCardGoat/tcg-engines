import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { brandWithCinderclawRed } from "./brand-with-cinderclaw.ts";
import { dragonPowerRed } from "./dragon-power.ts";

/**
 * Dragon Power (HNT077) — Ninja Action - Attack, cost 1, 4{p}/3{d}.
 *
 * Printed: When this attacks, if it is Draconic, it gets +3{p}.
 * Seat Fai. Brand with Cinderclaw grants Draconic on the next attack this chain.
 */

describe("Dragon Power (HNT077) AAA", () => {
  it("happy: Brand makes this Draconic so it is 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, dragonPowerRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(dragonPowerRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).toHaveAttackSupertype("Draconic");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without Draconic this stays 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [dragonPowerRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(dragonPowerRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).notToHaveAttackSupertype("Draconic");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +3{p} is on attack, not while this is still in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [dragonPowerRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(dragonPowerRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(4);
  });
});
