import { describe, expect, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { ramRaiderRed } from "./ram-raider.ts";
import { nimblismBlue } from "./nimblism.ts";
import { consumingAftermathRed } from "./consuming-aftermath.ts";

/**
 * Consuming Aftermath, Red (LEV023) — Shadow Action - Attack, cost 3, 6{p},
 * 2{d}.
 * Printed: "As an additional cost to play Consuming Aftermath, you may
 * banish a card from your hand. If a Shadow card is banished this way,
 * Consuming Aftermath gains dominate."
 * Conditional grant proven by play: dominate lands ONLY when a Shadow card
 * is banished this way (printed-leak family closed 2026-08-26 — dominate no
 * longer double-encoded as a printed keyword).
 */

describe("Consuming Aftermath, Red (LEV023) AAA", () => {
  it("happy: banishing a Shadow card this way grants dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [consumingAftermathRed, ramRaiderRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(consumingAftermathRed, { modeIds: ["pay"] });
    game.passBoth();

    expect(Chane.zone("banished")).toContain(ramRaiderRed.canonicalId);
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: banishing a non-Shadow card leaves the attack without dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [consumingAftermathRed, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(consumingAftermathRed, { modeIds: ["pay"] });
    game.passBoth();

    expect(Chane.zone("banished")).toContain(nimblismBlue.canonicalId);
    // Printed: dominate only when a Shadow card is banished this way.
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("timing: declining the banish leaves the hand intact", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [consumingAftermathRed, ramRaiderRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(consumingAftermathRed, { modeIds: ["decline"] });
    game.passBoth();

    expect(Chane.zone("banished")).not.toContain(ramRaiderRed.canonicalId);
  });
});
