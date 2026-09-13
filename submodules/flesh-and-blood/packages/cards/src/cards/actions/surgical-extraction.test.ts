import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { surgicalExtractionBlue } from "./surgical-extraction.ts";

describe("Surgical Extraction (DYN122) AAA", () => {
  it("happy: hitting a hero banishes their deck top and a card from their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [surgicalExtractionBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue],
        deck: [snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(surgicalExtractionBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: nimblismBlue.canonicalId });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("banished")).toEqual(
      expect.arrayContaining([snatchRed.canonicalId, nimblismBlue.canonicalId]),
    );
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Bravo, surgicalExtractionBlue).toBeIn("graveyard");
  });

  it("boundary: a fully blocked miss does not banish deck or hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [surgicalExtractionBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deck: [snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(surgicalExtractionBlue);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("banished")).not.toContain(snatchRed.canonicalId);
  });

  it("timing: the chosen hand card is banished, not the leftover card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [surgicalExtractionBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, snatchRed],
        deck: [nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(surgicalExtractionBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: snatchRed.canonicalId });

    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveHandCount(1);
  });
});
