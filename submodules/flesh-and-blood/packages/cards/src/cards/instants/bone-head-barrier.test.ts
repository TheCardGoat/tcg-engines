import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { boneHeadBarrierYellow } from "./bone-head-barrier.ts";

/**
 * Bone Head Barrier (WTR010) — Brute Instant, cost 1.
 *
 * Printed: "Roll a 6 sided die. Prevent the next X damage that would be
 * dealt to your hero this turn, where X is the number rolled."
 *
 * Roll is not seedable via public API — do not fake RNG. Any legal d6 (1–6)
 * prevents at least 1 of Snatch's 4 damage (`{ type: "roll-result" }`).
 */

describe("Bone Head Barrier (WTR010) AAA", () => {
  it("happy: the d6 shields Rhinar so Snatch's 4 does not fully land", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: rhinar,
        hand: [boneHeadBarrierYellow],
        resourcePoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Rhinar.play(boneHeadBarrierYellow);
    game.closeCombat({ optionals: "decline" });

    const life = Rhinar.life();
    expect(life).toBeGreaterThanOrEqual(17);
    expect(life).toBeLessThanOrEqual(20);
    expectFabCard(Rhinar, boneHeadBarrierYellow).toBeIn("graveyard");
  });

  it("boundary: without Bone Head Barrier, Snatch deals the full 4", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Rhinar).toHaveLife(16);
  });

  it("timing: the prevention expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [boneHeadBarrierYellow],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.play(boneHeadBarrierYellow);
    game.helpers.resolveUntilIdle();
    Rhinar.endTurn();
    Dash.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Rhinar).toHaveLife(16);
    expectFabCard(Rhinar, boneHeadBarrierYellow).toBeIn("graveyard");
  });
});
