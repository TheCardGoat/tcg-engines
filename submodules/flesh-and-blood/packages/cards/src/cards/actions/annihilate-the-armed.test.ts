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
import { annihilateTheArmedRed } from "./annihilate-the-armed.ts";

describe("Annihilate the Armed (DYN133) AAA", () => {
  it("happy: hitting a hero banishes the top card of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [annihilateTheArmedRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(annihilateTheArmedRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expectFabCard(Bravo, annihilateTheArmedRed).toBeIn("graveyard");
  });

  it("boundary: a fully blocked miss does not banish their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [annihilateTheArmedRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: [snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(annihilateTheArmedRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("banished")).not.toContain(snatchRed.canonicalId);
  });

  it("timing: the hit banishes their deck, not yours", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [annihilateTheArmedRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(annihilateTheArmedRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("banished")).toHaveLength(0);
  });
});
