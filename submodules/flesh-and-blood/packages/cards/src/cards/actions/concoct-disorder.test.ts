import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { concoctDisorderRed } from "./concoct-disorder.ts";

describe("Concoct Disorder family AAA", () => {
  it("happy: when this attacks each hero arsenals the top of their deck face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [concoctDisorderRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deckTop: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(concoctDisorderRed);
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("go-again");
    expect(Bravo.zone("arsenal")).toContain(nimblismBlue.canonicalId);
    expect(Dash.zone("arsenal")).toContain(nimblismBlue.canonicalId);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: a hero with an empty deck does not put a card into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [concoctDisorderRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [],
      },
      { hero: dash, hand: [], deck: [], deckTop: [] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(concoctDisorderRed);
    expectCombat(game).toHaveAttackPower(4);
    expect(Bravo.zone("arsenal")).toHaveLength(0);
    expect(game.as(dash).zone("arsenal")).toHaveLength(0);
  });

  it("timing: 2+ cards put into arsenals this way grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [concoctDisorderRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deckTop: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(concoctDisorderRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
