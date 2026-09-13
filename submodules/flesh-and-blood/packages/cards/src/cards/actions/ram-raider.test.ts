import { describe, expect, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { debilitateBlue } from "./debilitate.ts";
import { snatchRed } from "./snatch.ts";
import { ramRaiderRed } from "./ram-raider.ts";

/**
 * Ram Raider, Red (DTD112) — Shadow Brute Action - Attack, cost 2, 6{p},
 * 3{d}.
 * Printed: "As an additional cost to play this, banish a random card from
 * your hand. If a card with 6 or more {p} is banished this way, this gets
 * go again."
 * Conditional grant proven by play: go again lands ONLY when a 6{p}+ card
 * is banished this way (printed-leak family closed 2026-08-26 — goAgain no
 * longer double-encoded as a printed keyword).
 */

describe("Ram Raider family AAA", () => {
  it("happy: banishing a 6{p}+ card this way grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [ramRaiderRed, debilitateBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(ramRaiderRed);
    game.advanceCombatTo("defend");

    expect(Chane.zone("banished")).toContain(debilitateBlue.canonicalId);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: banishing a sub-6{p} card leaves the attack without go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [ramRaiderRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(ramRaiderRed);
    game.advanceCombatTo("defend");

    expect(Chane.zone("banished")).toContain(snatchRed.canonicalId);
    // Printed: go again only when a 6{p}+ card is banished this way.
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: the random banish is paid before the attack event", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [ramRaiderRed, debilitateBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(ramRaiderRed, { stopAt: "on-attack" });

    expect(Chane.zone("banished")).toContain(debilitateBlue.canonicalId);
  });
});
