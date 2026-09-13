import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { sloggismRed } from "./sloggism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { layDownTheLawRed } from "./lay-down-the-law.ts";

/**
 * Lay Down the Law (TCC035) — Guardian Attack.
 *
 * Printed: Tower - If this has 13 or more {p}, non-equipment cards get -1{d}
 * while defending this.
 */

describe("Lay Down the Law (TCC035) AAA", () => {
  it("happy: Sloggism takes this to 13{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [sloggismRed, layDownTheLawRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(sloggismRed);
    game.helpers.resolveUntilIdle();
    Bravo.must.playAttack(layDownTheLawRed);
    game.advanceCombatTo("defend");

    // Printed 7 + Sloggism +6 = 13.
    expectCombat(game).toHaveAttackPower(13);
    expectFabCard(Bravo, layDownTheLawRed).toBeIn("combatChain");
  });

  it("boundary: at printed 7{p} Tower does not reduce defending {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [layDownTheLawRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.must.playAttack(layDownTheLawRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // 7{p} vs Nimblism 2{d} = 5. Tower would leak 6 if it fired at 7{p}.
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("timing: at 13{p} a non-equipment defender gets -1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [sloggismRed, layDownTheLawRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(sloggismRed);
    game.helpers.resolveUntilIdle();
    Bravo.must.playAttack(layDownTheLawRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(13);
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // 13{p} vs Nimblism 2{d} − 1 Tower = 12 damage (life 8).
    expectFabPlayer(Dash).toHaveLife(8);
  });
});
