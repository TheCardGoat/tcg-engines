import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { packCallRed } from "./pack-call.ts";

/**
 * Pack Call (HVY020) — Brute Action Attack, red.
 * Printed: When this defends, reveal the top card of your deck. If it has 6 or
 * more {p}, put it on top. Otherwise, put it on the bottom.
 */

describe("Pack Call (HVY020) AAA", () => {
  it("happy: a 6{p} reveal stays on top", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: rhinar,
        hand: [packCallRed],
        deck: [nimblismBlue, commandAndConquerRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).playAttack(snatchRed);
    Rhinar.defendWith(packCallRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    const deck = Rhinar.zone("deck");
    expect(deck.at(-1)).toBe(commandAndConquerRed.canonicalId);
  });

  it("boundary: a sub-6{p} reveal goes to the bottom", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: rhinar,
        hand: [packCallRed],
        deck: [commandAndConquerRed, nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).playAttack(snatchRed);
    Rhinar.defendWith(packCallRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    const deck = Rhinar.zone("deck");
    expect(deck[0]).toBe(nimblismBlue.canonicalId);
    expect(deck.at(-1)).toBe(commandAndConquerRed.canonicalId);
  });
});
