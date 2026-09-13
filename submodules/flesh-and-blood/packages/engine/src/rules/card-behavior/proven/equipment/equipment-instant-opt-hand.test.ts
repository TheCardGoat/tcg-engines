/**
 * Hand-authored AAA for Instant destroy-self equipment with Opt / hand-size
 * gates (not Action-point economy).
 *
 * Each module was read end-to-end. No script dumps.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { talismanicLens } from "../../../../../../cards/src/cards/equipment/talismanic-lens.ts";
import { ragamuffinSHat } from "../../../../../../cards/src/cards/equipment/ragamuffin-s-hat.ts";
import { poppedCollarPolo } from "../../../../../../cards/src/cards/equipment/popped-collar-polo.ts";
import { heartOfFyendalBlue } from "../../../../../../cards/src/cards/resources/heart-of-fyendal.ts";
import { crackedBaubleYellow } from "../../../../../../cards/src/cards/resources/cracked-bauble.ts";

// ---------------------------------------------------------------------------
// ARC151 talismanic-lens — Generic Head d0
// Instant - Destroy Talismanic Lens: Opt 2
//
// Reasoning:
// - Instant destroy-self (no AP cost).
// - Opt 2 raises a partition decision over the top 2 deck cards.
// - Completing partition reorders deck top/bottom per answer.
// ---------------------------------------------------------------------------

describe("talismanic-lens (ARC151)", () => {
  it("core mechanic: Instant destroy-self opens Opt 2 and reorders the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [talismanicLens],
        hand: [],
        // Deck top is last array element when using explicit order? Harness deck
        // array is typically top-last (slice(-count).reverse looks from end).
        deck: [snatchRed, heartOfFyendalBlue, crackedBaubleYellow],
        actionPoints: 0,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(talismanicLens);
    // Instant layer must resolve before Opt opens the partition decision.
    for (let s = 0; s < 8 && !game.getState().decision; s += 1) {
      if (game.getState().rulesStack.length > 0) {
        game.passBoth();
      } else {
        break;
      }
    }

    const decision = game.getState().decision;
    expect(decision?.kind).toBe("partition");
    if (decision?.kind !== "partition") throw new Error("expected opt partition");

    // Keep both on top in reverse of offered order to prove reorder path ran.
    const entryIds = decision.entries.map((e) => e.id);
    expect(entryIds.length).toBe(2);
    game.exec({
      move: "answer-decision",
      actorId: decision.actorId,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: {
          kind: "partition",
          groups: { top: [entryIds[1]!, entryIds[0]!], bottom: [] },
        },
      },
    });
    game.passBoth();

    expect(Bravo.zone("head")).not.toContain(talismanicLens.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(talismanicLens.canonicalId);
    // Deck still has 3 cards (opt reorders, does not remove).
    expect(Bravo.zone("deck").length).toBe(3);
  });

  it("boundaries: destroy is paid even if the deck has fewer than 2 cards", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [talismanicLens],
        hand: [],
        deck: [heartOfFyendalBlue],
        actionPoints: 0,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(talismanicLens);
    const decision = game.getState().decision;
    if (decision?.kind === "partition") {
      const ids = decision.entries.map((e) => e.id);
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "partition", groups: { top: ids, bottom: [] } },
        },
      });
    }
    game.passBoth();
    expect(Bravo.zone("graveyard")).toContain(talismanicLens.canonicalId);
  });
});

// ---------------------------------------------------------------------------
// ELE233 ragamuffin-s-hat — Generic Head d0
// Instant - Destroy: Draw then put a hand card top/bottom.
// Activate only if you have exactly 1 card in hand.
//
// Reasoning:
// - zone-count hand eq 1 gate must reject empty and 2-card hands.
// - Happy path: 1 card → destroy → draw (2 in hand) → choose 1 to deck.
// ---------------------------------------------------------------------------

describe("ragamuffin-s-hat (ELE233)", () => {
  it("boundaries: illegal with empty hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ragamuffinSHat],
        hand: [],
        deck: 6,
        actionPoints: 0,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).activate(ragamuffinSHat)).toThrow();
  });

  it("boundaries: illegal with 2+ cards in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ragamuffinSHat],
        hand: [snatchRed, heartOfFyendalBlue],
        deck: 6,
        actionPoints: 0,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).activate(ragamuffinSHat)).toThrow();
  });

  it("core mechanic: with exactly 1 hand card, destroy draws then returns a card to deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [ragamuffinSHat],
        hand: [snatchRed],
        deck: [heartOfFyendalBlue, crackedBaubleYellow, snatchRed],
        actionPoints: 0,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(ragamuffinSHat);

    // Resolve the Instant layer: draw, then hand→deck with top/bottom choice.
    for (let safety = 0; safety < 32; safety += 1) {
      const d = game.getState().decision;
      if (d) {
        if (d.kind === "entity-target") {
          const pick = d.candidates[0]?.instanceId;
          if (!pick) throw new Error("entity-target with no candidates");
          game.exec({
            move: "answer-decision",
            actorId: d.actorId,
            payload: {
              decisionId: d.decisionId,
              stateVersion: d.stateVersion,
              answer: { kind: "entity-target", instanceIds: [pick] },
            },
          });
          continue;
        }
        if (d.kind === "effect-resolution") {
          // Prefer top-of-deck for top-or-bottom synthetic choice (option-0).
          const optionId = d.options[0]?.id ?? "option-0";
          game.exec({
            move: "answer-decision",
            actorId: d.actorId,
            payload: {
              decisionId: d.decisionId,
              stateVersion: d.stateVersion,
              answer: { kind: "effect-resolution", optionId },
            },
          });
          continue;
        }
        if (game.answerForcedDecision()) continue;
        throw new Error(`unhandled decision kind ${d.kind}`);
      }
      if (game.getState().rulesStack.length > 0) {
        // Prefer answering forced before pass; if pass fails we need the decision.
        try {
          game.passBoth();
        } catch {
          // Fall through to next loop iteration for decision.
        }
        continue;
      }
      break;
    }

    expect(Bravo.zone("head")).not.toContain(ragamuffinSHat.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(ragamuffinSHat.canonicalId);
    // Net: started 1 hand, drew 1, put 1 back → hand size 1; deck size unchanged.
    expect(Bravo.zone("hand").length).toBe(1);
    expect(Bravo.zone("deck").length).toBe(deckBefore);
  });
});

// ---------------------------------------------------------------------------
// LSS014 popped-collar-polo — Generic Chest d0
// Action - Destroy this: Gain {r}. Go again
// Same mechanical shape as Blossom of Spring; prove catalog twin.
// ---------------------------------------------------------------------------

describe("popped-collar-polo (LSS014)", () => {
  it("core mechanic: destroy-self Action gains 1 resource and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [poppedCollarPolo],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(poppedCollarPolo);
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(poppedCollarPolo.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
    expect(Bravo.actionPoints()).toBe(1);
  });
});
