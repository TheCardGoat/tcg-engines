import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { shiningCourageRed } from "./shining-courage.ts";

/**
 * Shining Courage (SUP034) — Revered Instant.
 *
 * Printed:
 *   Up to one target defending action card gets +3{d} this turn.
 *   The crowd cheers you.
 */

describe("Shining Courage (SUP034) AAA", () => {
  it("happy: a defending action card gets +3{d} and the crowd cheers you", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [snatchRed, shiningCourageRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith(snatchRed);
    Dash.pass();
    Tuffnut.play(shiningCourageRed, {
      targetInstanceId: Tuffnut.cardIn("combatChain", snatchRed).instanceId,
    });
    game.helpers.resolveUntilIdle();

    // Snatch printed 2{d} + 3 = 5. Crowd cheers creates Tuffnut's Toughness.
    expectFabCard(Tuffnut, snatchRed).toHaveDefense(5);
    expectFabCard(Tuffnut, shiningCourageRed).toBeIn("graveyard");
    expect(Tuffnut.zone("arena")).toContain("token:toughness");
  });

  it("boundary: up-to-one still resolves with no defending action", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [shiningCourageRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith();
    Dash.pass();
    Tuffnut.play(shiningCourageRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Tuffnut, shiningCourageRed).toBeIn("graveyard");
    expect(Tuffnut.zone("arena")).toContain("token:toughness");
  });

  it("timing: the +3{d} lasts through the damage step", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [snatchRed, shiningCourageRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith(snatchRed);
    Dash.pass();
    Tuffnut.play(shiningCourageRed, {
      targetInstanceId: Tuffnut.cardIn("combatChain", snatchRed).instanceId,
    });
    game.helpers.resolveRestOfCombat();

    // Snatch 4{p} vs 5{d} deals 0. Unbuffed 4 vs 2 would leak 2.
    expectFabPlayer(Tuffnut).toHaveLife(20);
  });
});
