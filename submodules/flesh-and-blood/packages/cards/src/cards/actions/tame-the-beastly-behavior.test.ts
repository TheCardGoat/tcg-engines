import { describe, expect, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { kayoStrongArm } from "../heroes/kayo-strong-arm.ts";
import { tameTheBeastlyBehaviorRed } from "./tame-the-beastly-behavior.ts";

/**
 * Tame the Beastly Behavior (SUP024) — Revered Action - Attack, cost 3, 7{p}/3{d}.
 *
 * Printed: When this attacks a Reviled hero, +1{p}. When this hits a Reviled
 * hero, put a card from their arsenal on the bottom of their deck.
 */

describe("Tame the Beastly Behavior (SUP024) AAA", () => {
  it("happy: attacking a Reviled hero is 8{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [tameTheBeastlyBehaviorRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kayoStrongArm, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(tameTheBeastlyBehaviorRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: attacking a non-Reviled hero stays 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [tameTheBeastlyBehaviorRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(tameTheBeastlyBehaviorRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: hitting a Reviled hero bottoms their arsenal card", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [tameTheBeastlyBehaviorRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kayoStrongArm,
        hand: [],
        arsenal: [{ card: snatchRed, state: { faceDown: false } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Kayo = game.as(kayoStrongArm);

    Tuffnut.playAttack(tameTheBeastlyBehaviorRed);
    game.closeCombat({ optionals: "decline" });
    expect(Kayo.zone("deck")).toContain(snatchRed.canonicalId);
  });
});
