import { describe, expect, it } from "vitest";
import { FabTestEngine, FAB_MANUAL_HARNESS } from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { hocusPocusRed } from "./hocus-pocus.ts";
import { hocusPocusYellow } from "./hocus-pocus.ts";
import { sutcliffeSResearchNotesRed } from "./sutcliffe-s-research-notes.ts";

/**
 * Sutcliffe's Research Notes (CRU154) — Runeblade Action, cost 1, def 2,
 * Go again.
 *
 * Printed text (i18n, source of truth):
 * "Reveal the top 3 cards of your deck. Create a Runechant token for each
 * Runeblade attack action card revealed this way, then put the cards on
 * top of your deck in any order.\nGo again"
 *
 * /fab-rules Mode B handoff:
 * - citations: 8.5 (Reveal, Create effect keywords), 2.11/2.10/2.15
 *   (Runeblade supertype + Attack subtype + Action type define the counted
 *   cohort), 6.6, 8.3 (Go again), 3.7 (deck order).
 * - constraints: exactly the top 3 deck cards are revealed; one Runechant
 *   per revealed card that is simultaneously Runeblade + Attack + Action;
 *   the revealed cards return to the DECK TOP with a player-chosen order;
 *   Go again refunds unconditionally.
 *
 * The reveal binding feeds a required ordering decision before resolution
 * completes, so tests answer that choice explicitly through the public move.
 */

function putRevealedCardsBack(
  game: FabTestEngine,
  order: (entryIds: readonly string[]) => readonly string[] = (entryIds) => entryIds,
): void {
  game.passBoth();
  const decision = game.pendingDecision();
  expect(decision?.kind).toBe("partition");
  if (decision?.kind !== "partition") throw new Error("expected deck reorder decision");
  expect(
    game.exec({
      move: "answer-decision",
      actorId: decision.actorId,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "partition", groups: { top: order(decision.entries.map((e) => e.id)) } },
      },
    }).accepted,
  ).toBe(true);
}

describe("sutcliffeSResearchNotes family AAA", () => {
  it("happy: reveals 3 and creates one Runechant per Runeblade attack action revealed, with Go again refunding", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sutcliffeSResearchNotesRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
        // Last entry = top card: reveal order red, yellow, nimblism.
        deckTop: [nimblismBlue, hocusPocusYellow, hocusPocusRed],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sutcliffeSResearchNotesRed);
    putRevealedCardsBack(game);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Two Runeblade attack actions (both Hocus Pocus) among the reveal.
    const arena = Viserai.zone("arena");
    expect(arena.filter((c) => c === "token:runechant")).toHaveLength(2);
    // Nothing was drawn: the deck keeps 6 + 3 seeded cards.
    expect(Viserai.zone("deck")).toHaveLength(9);
    // Printed Go again: 1 AP - 1 (play) + 1 (refund) = 1.
    expect(Viserai.actionPoints()).toBe(1);
  });

  it("boundary: no Runeblade attack actions revealed creates no Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sutcliffeSResearchNotesRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
        // Three NON-Runeblade cards on top.
        deckTop: [brutalAssaultBlue, snatchRed, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sutcliffeSResearchNotesRed);
    putRevealedCardsBack(game);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Viserai.zone("arena").filter((c) => c === "token:runechant")).toHaveLength(0);
    expect(Viserai.zone("deck")).toHaveLength(9);
  });

  it("timing: puts the revealed cards back in the player's chosen order", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sutcliffeSResearchNotesRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
        deckTop: [nimblismBlue, hocusPocusYellow, hocusPocusRed],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sutcliffeSResearchNotesRed);
    putRevealedCardsBack(game);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    const deck = Viserai.zone("deck");
    expect(deck[deck.length - 1]).toBe(nimblismBlue.canonicalId);
    expect(deck[deck.length - 2]).toBe(hocusPocusYellow.canonicalId);
    expect(deck[deck.length - 3]).toBe(hocusPocusRed.canonicalId);
  });
});
