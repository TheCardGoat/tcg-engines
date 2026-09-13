import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { wreckerRompRed } from "../actions/wrecker-romp.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { boneseerSkullcap } from "./boneseer-skullcap.ts";

/**
 * Boneseer Skullcap (IAR038) — Brute Equipment - Head. Temper.
 *
 * Printed: When this defends, reveal the top card of your deck. If it has
 * 6 or more base {p}, put it on top. Otherwise, put it on the bottom.
 */

describe("Boneseer Skullcap (IAR038) AAA", () => {
  it("happy: defending keeps a 6+ base {p} reveal on top of the deck", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: rhinar,
        head: [boneseerSkullcap],
        deckTop: [wreckerRompRed],
        deck: 6,
        life: 40,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Rhinar.defendWith(boneseerSkullcap);
    game.passBoth();

    expect(Rhinar.zone("deck").at(-1)).toBe(wreckerRompRed.canonicalId);
  });

  it("boundary: a low-power reveal is put on the bottom", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: rhinar,
        head: [boneseerSkullcap],
        deckTop: [nimblismBlue],
        deck: 6,
        life: 40,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Rhinar.defendWith(boneseerSkullcap);
    game.passBoth();

    expect(Rhinar.zone("deck").at(0)).toBe(nimblismBlue.canonicalId);
    expect(Rhinar.zone("deck").at(-1)).not.toBe(nimblismBlue.canonicalId);
    expectFabPlayer(Rhinar).toHaveLife(40);
  });
});
