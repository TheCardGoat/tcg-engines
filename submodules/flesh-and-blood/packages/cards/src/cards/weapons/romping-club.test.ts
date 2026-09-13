import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { bloodrushBellowYellow } from "../actions/bloodrush-bellow.ts";
import { alphaRampageRed } from "../actions/alpha-rampage.ts";
import { rompingClub } from "./romping-club.ts";

describe("Romping Club (RNR003) AAA", () => {
  it("happy: discarding a 6+{p} card gives the club +1{p} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rompingClub],
        hand: [bloodrushBellowYellow, alphaRampageRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Rhinar, rompingClub).toHavePower(5);

    Rhinar.activate(rompingClub);
    game.passBoth();
    game.advanceCombatTo("defend");

    expect(game.combat()?.activeLink?.attackPower).toBeGreaterThanOrEqual(5);
  });

  it("boundary: without a 6+{p} discard the club attacks for 4", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rompingClub],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(rhinar).activate(rompingClub);
    game.passBoth();
    game.advanceCombatTo("defend");

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: once per turn — a second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rompingClub],
        hand: [],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(rompingClub);
    game.helpers.resolveRestOfCombat();

    Rhinar.expectActivationRejected(rompingClub);
  });
});
