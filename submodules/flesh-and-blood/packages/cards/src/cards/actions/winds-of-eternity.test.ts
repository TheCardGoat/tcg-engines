import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { hundredWindsRed } from "./hundred-winds.ts";
import { windsOfEternityBlue } from "./winds-of-eternity.ts";

/**
 * Winds of Eternity (EVR040) — Ninja Action - Attack, cost 0, 2{p}, 3{d}.
 *
 * Printed: Combo - If Winds of Eternity was the last attack this combat
 * chain, Winds of Eternity gains +2{p} and "If this hits, shuffle all cards
 * named Hundred Winds you control on this combat chain into your deck."
 */

describe("Winds of Eternity (EVR040) AAA", () => {
  it("happy: after another Winds of Eternity on the same chain this gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [windsOfEternityBlue, windsOfEternityBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const [lead, combo] = Bravo.cardsIn("hand", windsOfEternityBlue);

    Bravo.must.playAttack(lead!);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(combo!);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: as the first link it stays printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [windsOfEternityBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(windsOfEternityBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: a combo chain of Winds of Eternity closes without a shuffle-destination throw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hundredWindsRed, windsOfEternityBlue, windsOfEternityBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(hundredWindsRed);
    game.advanceCombatTo("resolution");
    const [lead, combo] = Bravo.cardsIn("hand", windsOfEternityBlue);
    Bravo.must.playAttack(lead!);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(combo!);
    game.closeCombat({ optionals: "decline" });
    expect(game.combat()).toBeNull();
  });

  it("boundary: Snatch as the last attack does not grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, windsOfEternityBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Bravo.must.playAttack(windsOfEternityBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(2);
  });
});
