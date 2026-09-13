import { describe, it } from "vitest";
import { expectCombat, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nitroMechanoid } from "./nitro-mechanoid.ts";

/**
 * Nitro Mechanoid (DYN092) — Mechanologist Weapon Equipment Item, 5{p} 5{d}.
 *
 * Printed: Action - Banish a card from under Nitro Mechanoid: Attack
 *
 * The weapon is created by Construct Nitro Mechanoid (same collector). The
 * public harness cannot seed cards under this, so Attack is unpayable until
 * transform-into-resolving-card puts cards under it.
 */

describe("Nitro Mechanoid (DYN092) AAA", () => {
  it("boundary: 0 AP cannot pay the Action activation even if the weapon is seated", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [nitroMechanoid],
        actionPoints: 0,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );

    game.as(dash).expectActivationRejected(nitroMechanoid);
  });

  it("timing: extra Action AP does not invent an under-this banish cost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [nitroMechanoid],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );

    game.as(dash).expectActivationRejected(nitroMechanoid);
    expectCombat(game).toBeClosed();
  });
});
