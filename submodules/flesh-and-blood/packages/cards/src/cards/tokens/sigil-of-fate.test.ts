import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfFate } from "./sigil-of-fate.ts";

/**
 * Sigil of Fate (FAB402) — Wizard Token - Aura, Opt 1.
 * Printed: "When this leaves the arena, opt 1. At the beginning of your
 * action phase, destroy this."
 */
describe("Sigil of Fate (FAB402) AAA", () => {
  it("happy: the Sigil burns at the action phase start and its leave-arena Opt 1 opens on the top card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [sigilOfFate],
        hand: [],
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();

    // Pass the action-phase-start trigger stack; the Sigil leaves the arena
    // and the Opt 1 decision opens on the deck top.
    for (let i = 0; i < 6 && game.waitState().kind === "priority"; i += 1) {
      game.passBoth();
    }
    const decision = Bravo.expectDecision("partition");
    expect(decision.entries).toHaveLength(1);

    // Keep it on top; the Sigil is gone either way.
    Bravo.choosePartition();
    expect(Bravo.zone("arena")).not.toContain(sigilOfFate.canonicalId);
    expectFabPlayer(Bravo).toHaveTokenCount("sigil-of-fate", 0);
  });

  it("boundary: before any action phase begins, the Sigil neither burns nor opts", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [sigilOfFate],
        hand: [],
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, sigilOfFate).toBeIn("arena");
    expectWait(game).notToHaveDecision();
  });
});
