import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { kickTheHornetSNestYellow } from "./kick-the-hornet-s-nest.ts";

describe("Kick the Hornet's Nest (SUP217) AAA", () => {
  it("happy: attacking deals 6", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [kickTheHornetSNestYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(kickTheHornetSNestYellow);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: putting this into the graveyard yourself creates no tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [kickTheHornetSNestYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(kickTheHornetSNestYellow);
    game.helpers.resolveRestOfCombat();
    expectFabToken(game, "confidence").toHaveCount(0);
    expectFabToken(game, "might").toHaveCount(0);
  });

  it("timing: an opponent's Command and Conquer discarding this creates the four tokens", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [commandAndConquerRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [],
        arsenal: [kickTheHornetSNestYellow],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).playAttack(commandAndConquerRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabToken(game, "confidence").toHaveCount(1);
    expectFabToken(game, "might").toHaveCount(1);
    expectFabToken(game, "toughness").toHaveCount(1);
    expectFabToken(game, "vigor").toHaveCount(1);
  });
});
