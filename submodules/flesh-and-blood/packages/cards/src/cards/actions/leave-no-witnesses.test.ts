import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { leaveNoWitnessesRed } from "./leave-no-witnesses.ts";

describe("Leave No Witnesses (DYN120) AAA", () => {
  it("happy: hitting a hero banishes their deck top and a card in arsenal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [leaveNoWitnessesRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [],
        arsenal: [nimblismBlue],
        deck: [snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(leaveNoWitnessesRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: nimblismBlue.canonicalId,
    });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("banished")).toEqual(
      expect.arrayContaining([snatchRed.canonicalId, nimblismBlue.canonicalId]),
    );
  });

  it("boundary: a fully blocked miss does not banish deck or arsenal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [leaveNoWitnessesRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        arsenal: [nimblismBlue],
        deck: [snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(leaveNoWitnessesRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("arsenal")).toContain(nimblismBlue.canonicalId);
    expect(Dash.zone("banished")).not.toContain(snatchRed.canonicalId);
  });

  it("timing: an empty arsenal still banishes only the deck top", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [leaveNoWitnessesRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(leaveNoWitnessesRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("arsenal")).toHaveLength(0);
  });
});
