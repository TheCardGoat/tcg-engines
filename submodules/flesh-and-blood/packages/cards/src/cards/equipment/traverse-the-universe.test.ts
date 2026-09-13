import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { dash } from "../heroes/dash.ts";
import { traverseTheUniverse } from "./traverse-the-universe.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Traverse the Universe (MST066) — Mystic Equipment - Head, Blade Break.
 *
 * Printed: "When this defends, search your deck for an Inner Chi, reveal it,
 * put it into your hand, then shuffle."
 */
describe("Traverse the Universe (MST066) AAA", () => {
  it("happy: defending with the head tutors an Inner Chi from deck to hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        head: [traverseTheUniverse],
        life: 20,
        deckTop: [innerChiBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    game.as(dash).playAttack(snatchRed);
    Enigma.defendWith(traverseTheUniverse);
    // Answer the search ("Search for a card.", up to 1) with the Inner Chi.
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expectFabCard(Enigma, innerChiBlue).toBeIn("hand");
    // Blade Break: the head is destroyed after defending.
    expectFabCard(Enigma, traverseTheUniverse).toBeIn("graveyard");
    // 4{p} snatch minus the head's 2{d} lands 2 on Enigma.
    expectFabPlayer(Enigma).toHaveLife(18);
  });

  it("boundary: with no Inner Chi in the deck the search fails but Blade Break still claims the head", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        head: [traverseTheUniverse],
        life: 20,
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    game.as(dash).playAttack(snatchRed);
    Enigma.defendWith(traverseTheUniverse);
    // No Inner Chi exists — the search picks nothing and fails gracefully.
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expect(Enigma.zone("hand")).toHaveLength(0);
    expectFabCard(Enigma, traverseTheUniverse).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(18);
  });
});
