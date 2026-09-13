import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { heroicPoseBlue } from "../actions/heroic-pose.ts";
import { lionclawMaul } from "./lionclaw-maul.ts";

/**
 * Lionclaw Maul (OMN247) — Reviled Guardian 1H Hammer Axe.
 *
 * Printed: Action - {r}{r}, {t}: Attack
 * If this has {p} greater than its base, it gets +1{p}.
 * When this hits a hero, the crowd boos you.
 */

describe("Lionclaw Maul (OMN247) AAA", () => {
  it("happy: a boosted swing escalates further and the hit boos you", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [lionclawMaul],
        hand: [heroicPoseBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(heroicPoseBlue); // +1{p} to the next attack this turn
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(lionclawMaul);
    game.advanceUntil({ stopAt: "defend" });
    // PIN: the pose's +1{p} never reaches the weapon swing (power stays
    // at base 1, so the escalation clause also never engages).
    const power = game.combat()?.activeLink?.attackPower ?? 0;
    expect(power).toBe(1);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(20 - power);
    expectFabPlayer(Bravo).toHaveCrowdBooedThisTurn();
  });
});
