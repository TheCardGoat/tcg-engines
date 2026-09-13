import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kayo } from "../heroes/kayo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { spellbladeAssaultBlue } from "../actions/spellblade-assault.ts";
import { pulpingRed } from "../actions/pulping.ts";
import { boneVizier } from "./bone-vizier.ts";

/**
 * Bone Vizier (FAB106) — Brute Head d0, Blade Break.
 * Printed: "When Bone Vizier is destroyed, reveal the top card of your deck.
 * If it has 6 or more {p}, put it on top of your deck. Otherwise, put it on
 * the bottom."
 * Blade Break defends destroy the vizier; the deck order is then proven by
 * the start-of-turn draws (rule-visible, no deck-state peeks).
 */

describe("Bone Vizier (FAB106) AAA", () => {
  it("happy: a 6{p} top card stays on top and is drawn first", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: kayo,
        head: [boneVizier],
        // deckTop is top-last: snatchRed bottom, spellblade middle, pulping top.
        deckTop: [snatchRed, spellbladeAssaultBlue, pulpingRed],
        life: 20,
        hand: [],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kayo = game.as(kayo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kayo.defendWith(boneVizier);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Kayo, boneVizier).toBeIn("graveyard");

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expect(Kayo.cardsIn("hand", pulpingRed)).toHaveLength(1);
  });

  it("boundary: a low-power top card is buried and drawn last", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: kayo,
        head: [boneVizier],
        // deckTop is top-last: snatchRed bottom, pulping middle, low spellblade top.
        deckTop: [snatchRed, pulpingRed, spellbladeAssaultBlue],
        life: 20,
        hand: [],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kayo = game.as(kayo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kayo.defendWith(boneVizier);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Kayo, boneVizier).toBeIn("graveyard");

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    // The revealed 2{p} card went to the bottom: pulping is drawn instead.
    expect(Kayo.cardsIn("hand", pulpingRed)).toHaveLength(1);

    Kayo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    expect(Kayo.cardsIn("hand", snatchRed)).toHaveLength(1);
  });
});
