import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { reapingBlade } from "./reaping-blade.ts";

/**
 * Reaping Blade (CRU140) — Runeblade Weapon Sword 2H, power 3.
 *
 * Printed: Once per Turn Action - {r}: Attack
 */

describe("Reaping Blade (CRU140) AAA", () => {
  it("happy: activateAttack opens combat at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [reapingBlade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(viserai).activateAttack(reapingBlade);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [reapingBlade],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(viserai).expectActivationRejected(reapingBlade);
    expectCombat(game).toBeClosed();
  });

  it("timing: once-per-turn rejects a second activation this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [reapingBlade],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.activateAttack(reapingBlade);
    game.closeCombat({ optionals: "decline" });
    Viserai.expectActivationRejected(reapingBlade);
  });

  it("prevents the uniquely highest-life hero from gaining life with Sigil of Solace", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [reapingBlade],
        life: 10,
        deck: 6,
      },
      { hero: dash, hand: [sigilOfSolaceRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.pass();
    Dash.play(sigilOfSolaceRed);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("allows the lower-life hero to gain life while Reaping Blade is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [reapingBlade],
        hand: [sigilOfSolaceRed],
        life: 10,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sigilOfSolaceRed);
    game.untilIdle();

    expectFabPlayer(Viserai).toHaveLife(13);
  });

  it("allows either hero to gain life when their life totals are tied", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [reapingBlade],
        hand: [sigilOfSolaceRed],
        life: 10,
        deck: 6,
      },
      { hero: dash, life: 10, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sigilOfSolaceRed);
    game.untilIdle();

    expectFabPlayer(Viserai).toHaveLife(13);
  });
});
