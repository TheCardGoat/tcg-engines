import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lexi } from "../heroes/lexi.ts";
import { helmOfUnity } from "../equipment/helm-of-unity.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { nimbleStrikeBlue } from "./nimble-strike.ts";
import { callDownTheLightningYellow } from "./call-down-the-lightning.ts";

/**
 * Call Down the Lightning Yellow (DTD198) — Lightning Action, Lexi
 * specialization, go again.
 *
 * Printed: Your attacks this turn get "Whenever the defending hero adds 1
 * or more defending cards from hand to this chain link, this deals 1 damage
 * to them." Go again.
 *
 * The grant is this-attack + appliesTo.next count:all (Art of War). A hand
 * block on a latched attack deals 1; an equipment-only block does not; a
 * second attack the same turn still carries the rider.
 */

describe("Call Down the Lightning Yellow (DTD198) AAA", () => {
  it("happy: a hand block on the granted attack deals 1 damage to the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [callDownTheLightningYellow, nimbleStrikeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.play(callDownTheLightningYellow);
    game.helpers.resolveUntilIdle();
    Lexi.playAttack(nimbleStrikeBlue);
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // Nimble Strike 2{p} is fully blocked by Nimblism 2{d}; the rider still
    // deals 1 for defending from hand.
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: an equipment-only block does not trigger the rider", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [callDownTheLightningYellow, nimbleStrikeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], head: [helmOfUnity], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.play(callDownTheLightningYellow);
    game.helpers.resolveUntilIdle();
    Lexi.playAttack(nimbleStrikeBlue);
    Dash.defendWith(helmOfUnity);
    game.helpers.resolveRestOfCombat();

    // 2{p} vs 1{d} equipment: 1 combat damage, no rider.
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("timing: a later attack this turn still carries the rider", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [callDownTheLightningYellow, nimbleStrikeBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.play(callDownTheLightningYellow);
    game.helpers.resolveUntilIdle();
    Lexi.playAttack(nimbleStrikeBlue);
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // First attack: 2{p} fully blocked + rider 1.
    expectFabPlayer(Dash).toHaveLife(19);

    Lexi.playAttack(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // Second attack: 4{p} vs 2{d} = 2, plus another rider 1 → 16.
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
