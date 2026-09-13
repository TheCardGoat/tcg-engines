import { describe, expect, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { deathlyDuetRed } from "./deathly-duet.ts";

/**
 * Deathly Duet, Red (DYN176) — Runeblade Action - Attack, cost 2, 4{p}.
 * Printed: "When Deathly Duet attacks, if an attack action card was
 * pitched to play it, it gains +2{p}. If a 'non-attack' action card was
 * pitched to play it, create 2 Runechant tokens."
 */

describe("Deathly Duet, Red (DYN176) AAA", () => {
  it("happy: an attack action pitched grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [deathlyDuetRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(deathlyDuetRed, { pitch: [snatchRed] });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-attack pitch mints 2 Runechants instead (no {p})", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [deathlyDuetRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(deathlyDuetRed, { pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    expect(Viserai.zone("arena").filter((id) => id === "token:runechant").length).toBe(2);
  });

  it("timing: no pitch leaves both riders dormant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [deathlyDuetRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(deathlyDuetRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    expect(Viserai.zone("arena").filter((id) => id === "token:runechant").length).toBe(0);
  });
});
