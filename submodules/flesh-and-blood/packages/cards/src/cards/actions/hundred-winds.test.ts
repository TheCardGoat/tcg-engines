import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { hundredWindsYellow } from "./hundred-winds.ts";
import { hundredWindsRed } from "./hundred-winds.ts";

/**
 * Hundred Winds (EVR041) — Combo: if Hundred Winds was the last attack,
 * +1{p} for each other Hundred Winds you control on this chain. Printed 3{p}.
 * Seat Bravo so Ira/Benji latches do not stack (KSU016).
 */

describe("Hundred Winds (EVR041) AAA", () => {
  it("happy: last Hundred Winds after another gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hundredWindsYellow, hundredWindsRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(hundredWindsYellow);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(hundredWindsRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: as the first link this stays printed 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [hundredWindsRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(hundredWindsRed);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: Snatch as the last attack does not grant the combo +{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, hundredWindsRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(hundredWindsRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });
});
