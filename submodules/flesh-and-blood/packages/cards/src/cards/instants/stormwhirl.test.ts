import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { heavenSClawsBlue } from "../actions/heaven-s-claws.ts";
import { snatchRed } from "../actions/snatch.ts";
import { stormwhirlBlue } from "./stormwhirl.ts";

/**
 * Stormwhirl (OMN192) — target Lightning attack gets go again.
 */

describe("Stormwhirl (OMN192) AAA", () => {
  it("happy: target Lightning attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [heavenSClawsBlue, stormwhirlBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(heavenSClawsBlue);
    game.advanceCombatTo("reaction");
    Briar.must.playInstant(stormwhirlBlue);
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: a Generic attack is not a legal Lightning target", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [snatchRed, stormwhirlBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Briar.must.playInstant(stormwhirlBlue)).toThrow(
      /no legal target|couldn't be played|not legal/i,
    );
  });

  it("boundary: cannot play without an attack on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stormwhirlBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    expect(() => Briar.must.playInstant(stormwhirlBlue)).toThrow(
      /no legal target|couldn't be played|not legal/i,
    );
  });
});
