import { describe, it } from "vitest";
import { expectCombat, expectFabCard, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { barnacleYellow } from "./barnacle.ts";

/**
 * Barnacle (AGB015) — Pirate Necromancer Ally, 4{p} 3{h}.
 *
 * Printed: Action - {t}: Attack
 */

describe("Barnacle (AGB015) AAA", () => {
  it("happy: activateAttack opens combat at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [barnacleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, barnacleYellow).toBeIn("arena");
    Bravo.activateAttack(barnacleYellow);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: extra activation this turn is rejected after the ally taps", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [barnacleYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(barnacleYellow);
    game.closeCombat({ optionals: "decline" });
    Bravo.expectActivationRejected(barnacleYellow);
    expectFabCard(Bravo, barnacleYellow).toBeTapped();
  });

  it("timing: 0 AP cannot pay the Action activation", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [barnacleYellow],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).expectActivationRejected(barnacleYellow);
    expectCombat(game).toBeClosed();
  });
});
