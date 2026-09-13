import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { toughness } from "../tokens/toughness.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { snatchRed } from "./snatch.ts";
import { stadiumSecurityRed } from "./stadium-security.ts";

/**
 * Stadium Security (PEN294) — Revered Action Attack.
 *
 * Printed: While this is in your arsenal, if you've controlled a Toughness
 * token this turn, this gets ambush.
 *
 * Ambush is granted, never `keywords:[ambush]`. Nested `conditional` on a
 * while-static is inert (CE collector); flatten to and + grant like SUP020.
 */

describe("Stadium Security family AAA", () => {
  it("happy: arsenal + Toughness this turn grants ambush so it can defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: tuffnut,
        arsenal: [stadiumSecurityRed],
        arena: [toughness],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).playAttack(snatchRed);
    expectFabCard(Tuffnut, stadiumSecurityRed).toHaveKeyword("ambush");
    Tuffnut.defendWith(stadiumSecurityRed);
    expectFabCard(Tuffnut, stadiumSecurityRed).toBeIn("combatChain");
  });

  it("boundary: arsenal without Toughness this turn has no ambush and cannot defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, arsenal: [stadiumSecurityRed], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    game.as(dash).playAttack(snatchRed);
    expectFabCard(Tuffnut, stadiumSecurityRed).notToHaveKeyword("ambush");
    expectFabUnplayable(() => Tuffnut.defendWith(stadiumSecurityRed), /arsenal card needs ambush/);
    expectFabCard(Tuffnut, stadiumSecurityRed).toBeIn("arsenal");
  });

  it("timing: Toughness this turn does not grant ambush while this is in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [stadiumSecurityRed],
        arena: [toughness],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(tuffnut), stadiumSecurityRed).notToHaveKeyword("ambush");
    expectFabCard(game.as(tuffnut), stadiumSecurityRed).toBeIn("hand");
  });
});
