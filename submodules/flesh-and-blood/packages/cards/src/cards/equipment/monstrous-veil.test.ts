import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { monstrousVeil } from "./monstrous-veil.ts";

/**
 * Monstrous Veil (HVY010) — Brute Head battleworn, Rhinar specialization.
 *
 * Printed:
 *   Action - Destroy this: Draw a card then discard a random card. Go again
 */

describe("Monstrous Veil (HVY010) AAA", () => {
  it("happy: destroy this draws, discards random, and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        head: [monstrousVeil],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(monstrousVeil);

    expectFabCard(Rhinar, monstrousVeil).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveHandCount(1);
    expectFabPlayer(Rhinar).toHaveAP(1);
  });

  it("boundary: 0 action points cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        head: [monstrousVeil],
        hand: [snatchRed],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    expect(() => game.as(rhinar).activate(monstrousVeil)).toThrow();
    expectFabCard(game.as(rhinar), monstrousVeil).toBeIn("head");
  });

  it("timing: battleworn first defend applies −1 and the helm stays seated", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 20, head: [monstrousVeil], deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    game.as(dash).attackWith(snatchRed);
    Rhinar.defendWith(monstrousVeil);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, monstrousVeil).toBeIn("head");
    expectFabCard(Rhinar, monstrousVeil).toHaveDefenseCounters(-1);
    expectFabPlayer(Rhinar).toHaveLife(17);
  });
});
