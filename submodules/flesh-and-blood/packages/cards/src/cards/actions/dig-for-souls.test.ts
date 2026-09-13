import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { voxNecropolis } from "../weapons/vox-necropolis.ts";
import { snatchRed } from "./snatch.ts";
import { digForSoulsRed } from "./dig-for-souls.ts";
import { nimblismBlue } from "./nimblism.ts";
import { restlessMagisterRed } from "./restless-magister.ts";

/**
 * Dig for Souls (AMA011) — Shadow Necromancer Action, X cost, go again.
 *
 * Printed: "Look at the top X cards of your deck. You may put a zombie from
 * among them into your graveyard, then put the rest on the bottom of your deck
 * in any order.\nYour next zombie attack this turn gets +4{p} and "When this
 * hits, destroy this zombie.""
 *
 * A zombie attack is a Vox-granted attack with a Zombie ally (Zombie lives in
 * types[], not an Attack subtype).
 */

describe("Dig for Souls (AMA011) AAA", () => {
  it("happy: X=0 does not crash, and the next zombie attack gets +4{p} and destroys on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessMagisterRed],
        hand: [digForSoulsRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(digForSoulsRed, { xValue: 0 });
    game.untilIdle();
    expectFabCard(Malice, digForSoulsRed).toBeIn("graveyard");

    Malice.activateAttack(restlessMagisterRed);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expect(Malice.zone("arena")).not.toContain(restlessMagisterRed.canonicalId);
  });

  it("happy: X=1 looks at the top card and puts it on the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [digForSoulsRed],
        deckTop: [restlessMagisterRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(digForSoulsRed, { xValue: 1 });
    game.untilIdle({ entityTargets: "minimum", optionals: "decline", ordering: "listed" });

    expectFabCard(Malice, digForSoulsRed).toBeIn("graveyard");
    const deck = Malice.zone("deck");
    expect(deck[0]).toBe(nimblismBlue.canonicalId);
    expect(deck[deck.length - 1]).toBe(restlessMagisterRed.canonicalId);
  });

  it("boundary: X=2 takes the whole two-card cohort to the bottom in any order", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [digForSoulsRed],
        deckTop: [restlessMagisterRed, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(digForSoulsRed, { xValue: 2 });
    game.untilIdle({ entityTargets: "minimum", optionals: "decline", ordering: "listed" });

    expectFabCard(Malice, digForSoulsRed).toBeIn("graveyard");
    const deck = Malice.zone("deck");
    const top = deck[deck.length - 1];
    expect(top).not.toBe(nimblismBlue.canonicalId);
    expect(top).not.toBe(restlessMagisterRed.canonicalId);
    expect(deck.slice(0, 2).sort()).toEqual(
      [nimblismBlue.canonicalId, restlessMagisterRed.canonicalId].sort(),
    );
  });

  it("boundary: a non-zombie attack does not get +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [digForSoulsRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(digForSoulsRed, { xValue: 0 });
    game.untilIdle();
    Malice.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
