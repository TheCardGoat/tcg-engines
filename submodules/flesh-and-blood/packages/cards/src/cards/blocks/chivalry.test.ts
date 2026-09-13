import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { chumFriendlyFirstMateYellow } from "../actions/chum-friendly-first-mate.ts";
import { brevantCivicProtector } from "../heroes/brevant-civic-protector.ts";
import { chivalryBlue } from "./chivalry.ts";

// Printed: "Protect" — Guardian Block card, blue (pitch 3), 3{d}. Block cards
// are never played; Chivalry defends from hand, and against an attack on a
// non-hero entity its Protect keyword satisfies the CR 8.3.31 gate (and trips
// Brevant's "whenever you protect another hero" — the printed deck synergy).
describe("Chivalry (TCC048) AAA", () => {
  it("happy: protects an attacked ally from hand — 3{d} and Brevant's Might token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: brevantCivicProtector,
        arena: [chumFriendlyFirstMateYellow],
        hand: [chivalryBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Brevant = game.as(brevantCivicProtector);
    const allyId = Brevant.findCardInZone("arena", chumFriendlyFirstMateYellow);

    Bravo.attackWith(snatchRed, { target: allyId });
    Brevant.defendWith(chivalryBlue);
    game.helpers.resolveRestOfCombat();

    expect(Brevant.zone("arena").some((id) => /token:might/i.test(id))).toBe(true);
    expectFabCard(Brevant, chivalryBlue).toBeIn("graveyard");
  });

  it("boundary: a Block card cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: brevantCivicProtector, hand: [chivalryBlue], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Brevant = game.as(brevantCivicProtector);

    expect(() => Brevant.play(chivalryBlue)).toThrow();
    expectFabCard(Brevant, chivalryBlue).toBeIn("hand");
  });

  it("timing: against a hero attack it is a plain 3{d} hand block — no Might token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: brevantCivicProtector, hand: [chivalryBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Brevant = game.as(brevantCivicProtector);

    Bravo.attackWith(snatchRed);
    Brevant.defendWith(chivalryBlue);
    game.helpers.resolveRestOfCombat();

    // 4 - 3{d} = 1 damage; no protect event, no Might.
    expectFabPlayer(Brevant).toHaveLife(19);
    expect(Brevant.zone("arena").some((id) => /token:might/i.test(id))).toBe(false);
  });
});
