import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { jarlVetreiI } from "../heroes/jarl-vetrei-i.ts";
import { summitTheUnforgiving } from "./summit-the-unforgiving.ts";

/**
 * Summit the Unforgiving (AJV002) — Earth Ice Guardian Weapon Polearm 1H, 4{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}{r}{r}{r}{r}: Attack
 *   When this hits a hero, create a Frostbite token in their exposed head,
 *   chest, arms, or legs zone.
 *   Heavy: If this is the only card equipped to your weapon zones, +2{p}.
 */

describe("Summit the Unforgiving (AJV002) AAA", () => {
  it("happy: an unblocked hit creates a Frostbite token in the defender's exposed head zone", () => {
    // Arrange — all of the defender's equipment zones are empty, so head is
    // the first exposed seat amongExposed picks.
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        weapon1: [summitTheUnforgiving],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    // Act — pay the six-resource attack. Heavy applies (only weapon).
    Jarl.activateAttack(summitTheUnforgiving);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ ordering: "listed" });

    // Assert — 20 − 6 = 14 and the Frostbite sits in the defender's head
    // slot, not in any arena zone or on the attacker.
    expectFabPlayer(Dash).toHaveLife(14);
    expect(Dash.zone("head")).toContain("token:frostbite");
    expect(Dash.zone("arena")).not.toContain("token:frostbite");
    expect(Jarl.zone("arena")).not.toContain("token:frostbite");
  });

  it("boundary: a fully defended miss places no Frostbite anywhere", () => {
    // Arrange — three 2{d} actions block for the full 6{p}.
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        weapon1: [summitTheUnforgiving],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    // Act — the defender absorbs the whole attack.
    Jarl.activateAttack(summitTheUnforgiving);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed" });

    // Assert — no damage, no hit event, no Frostbite in any exposed zone.
    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("head")).not.toContain("token:frostbite");
    expect(Dash.zone("chest")).not.toContain("token:frostbite");
    expect(Dash.zone("arms")).not.toContain("token:frostbite");
    expect(Dash.zone("legs")).not.toContain("token:frostbite");
    expect(Dash.zone("arena")).not.toContain("token:frostbite");
    expect(Jarl.zone("arena")).not.toContain("token:frostbite");
  });
});
