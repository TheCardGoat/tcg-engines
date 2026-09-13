import { describe, it } from "vitest";
import { expectCombat, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { ursurTheSoulReaper } from "./ursur-the-soul-reaper.ts";

/**
 * Ursur, the Soul Reaper (MON220) — Shadow Token Demon Ally, 6{p} 6{h}.
 *
 * Printed: Once per Turn Action - 0: Attack
 */

describe("Ursur, the Soul Reaper (MON220) AAA", () => {
  it("happy: activateAttack opens combat at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [ursurTheSoulReaper],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(levia).activateAttack(ursurTheSoulReaper);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: 0 AP cannot pay the Action activation", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [ursurTheSoulReaper],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(levia).expectActivationRejected(ursurTheSoulReaper);
    expectCombat(game).toBeClosed();
  });

  it("timing: once-per-turn rejects a second activation this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [ursurTheSoulReaper],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Levia = game.as(levia);

    Levia.activateAttack(ursurTheSoulReaper);
    game.closeCombat({ optionals: "decline" });
    Levia.expectActivationRejected(ursurTheSoulReaper);
  });
});
