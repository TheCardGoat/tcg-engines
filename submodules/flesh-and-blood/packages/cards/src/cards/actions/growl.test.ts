import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { fai } from "../heroes/fai.ts";
import { growlRed } from "./growl.ts";
import { growlYellow } from "./growl.ts";

/**
 * Growl (TCC086) — Ninja Action - Attack, cost 0, 3{p}/2{d}, go again.
 *
 * Printed: When this attacks, the next Crouching Tiger you play this combat
 * chain gets +1{p}. Seat Katsu (not Benji/Ira).
 */

describe("Growl (TCC086) AAA", () => {
  it("happy: the next Crouching Tiger this chain is 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [growlRed, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(fai);

    Katsu.playAttack(growlRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
    game.advanceCombatTo("resolution");
    Katsu.playAttack(crouchingTiger, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(1);
  });

  it("boundary: a Crouching Tiger without Growl stays 0{p}", () => {
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

  it("timing: Growl itself is still 3{p} on its own link", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [growlRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(fai);

    Katsu.playAttack(growlRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(3);
  });
});

/**
 * Growl (TCC094) — Ninja Action - Attack, cost 0, 2{p}/2{d}, go again.
 *
 * Printed: When this attacks, the next Crouching Tiger you play this combat
 * chain gets +1{p}.
 */

describe("Growl (TCC094) AAA", () => {
  it("happy: the next Crouching Tiger this chain is 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [growlYellow, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(fai);

    Katsu.playAttack(growlYellow, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(2).toHaveKeyword("go-again");
    game.advanceCombatTo("resolution");
    Katsu.playAttack(crouchingTiger, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(1);
  });

  it("boundary: a Crouching Tiger without Growl stays 0{p}", () => {
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

  it("timing: Growl itself is still 2{p} on its own link", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [growlYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(fai);

    Katsu.playAttack(growlYellow, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(2);
  });
});
