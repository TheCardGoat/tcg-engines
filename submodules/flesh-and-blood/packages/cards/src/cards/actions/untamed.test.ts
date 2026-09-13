import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { fai } from "../heroes/fai.ts";
import { untamedRed } from "./untamed.ts";

/**
 * Untamed (MST185) — Ninja Action - Attack, cost 1, 4{p}/2{d}, go again.
 *
 * Printed: When this attacks, the next Crouching Tiger you play this combat
 * chain gets +1{p}. Seat Katsu (not Benji/Ira).
 */

describe("Untamed (MST185) AAA", () => {
  it("happy: the next Crouching Tiger this chain is 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [untamedRed, crouchingTiger],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(fai);

    Katsu.playAttack(untamedRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("go-again");
    game.advanceCombatTo("resolution");
    Katsu.playAttack(crouchingTiger, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(1);
  });

  it("boundary: a Crouching Tiger without Untamed stays 0{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(fai);

    Katsu.playAttack(crouchingTiger, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(0);
  });

  it("timing: Untamed itself is still 4{p} on its own link", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [untamedRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(fai);

    Katsu.playAttack(untamedRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(4);
  });
});
