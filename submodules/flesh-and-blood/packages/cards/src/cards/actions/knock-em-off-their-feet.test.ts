import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { knockEmOffTheirFeetRed } from "./knock-em-off-their-feet.ts";

/**
 * Knock 'Em Off Their Feet (BDD008) — Guardian Action Attack, 8{p}/3{d}.
 * Printed: Crush — When this deals 4 or more damage to a hero, {t} them.
 */

describe("Knock 'Em Off Their Feet (BDD008) AAA", () => {
  it("happy: dealing 4 or more damage taps the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [knockEmOffTheirFeetRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(knockEmOffTheirFeetRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabCard(game.as(dash), dash).toBeTapped();
  });

  it("boundary: dealing fewer than 4 damage does not tap them", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [knockEmOffTheirFeetRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(knockEmOffTheirFeetRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabCard(game.as(dash), dash).toBeReady();
  });

  it("timing: two 3{d} blockers leave 2 damage and do not tap", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [knockEmOffTheirFeetRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(knockEmOffTheirFeetRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(18);
    expectFabCard(game.as(dash), dash).toBeReady();
  });
});
