/**
 * AAA test for trigger:lose-life.
 * Representative card: Blasmophet, Levia Consumed (DTD164).
 * Blood-debt end-phase would emit lose-life; Blasmophet replaces it with banishing
 * the top card of the deck while she is the controlling hero.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { blasmophetLeviaConsumed } from "../../../../../../cards/src/cards/demi-heroes/blasmophet-levia-consumed.ts";
import { hungeringDemigonYellow } from "../../../../../../cards/src/cards/actions/hungering-demigon.ts";

describe("trigger: lose-life", () => {
  it("AAA: blood-debt end phase is replaced by a face-down top-deck banish under Blasmophet (DTD164)", () => {
    const game = FabTestEngine.start(
      {
        hero: blasmophetLeviaConsumed,
        life: 20,
        // Full hand avoids cleanup draw changing the deck-size assertion.
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        banished: [hungeringDemigonYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Blasmophet = game.as(blasmophetLeviaConsumed);
    expect(Blasmophet.zone("heroZone")).toContain(blasmophetLeviaConsumed.canonicalId);
    expect(Blasmophet.zone("banished")).toContain(hungeringDemigonYellow.canonicalId);

    const lifeBefore = Blasmophet.life();
    const deckBefore = Blasmophet.zone("deck").length;
    const banishedBefore = Blasmophet.zone("banished").length;

    Blasmophet.endTurn();
    // Drain end-turn procedure decisions if any.
    for (let i = 0; i < 20; i += 1) {
      if (game.getState().decision) {
        if (game.answerForcedDecision()) continue;
        const d = game.getState().decision!;
        if (d.kind === "boolean") {
          game.exec({
            move: "answer-decision",
            actorId: d.actorId,
            payload: {
              decisionId: d.decisionId,
              stateVersion: d.stateVersion,
              answer: { kind: "boolean", value: true },
            },
          });
          continue;
        }
        if (d.kind === "ordering") {
          game.exec({
            move: "answer-decision",
            actorId: d.actorId,
            payload: {
              decisionId: d.decisionId,
              stateVersion: d.stateVersion,
              answer: { kind: "ordering", orderedIds: d.entries.map((e) => e.id) },
            },
          });
          continue;
        }
        break;
      }
      if (game.getState().rulesStack.length > 0 || game.getState().rulesProcess) {
        try {
          game.passBoth();
        } catch {
          break;
        }
        continue;
      }
      break;
    }

    // DTD164 replaces the CR 8.3.11 loss with one normal banish event.
    expect(Blasmophet.life()).toBe(lifeBefore);
    expect(Blasmophet.zone("deck")).toHaveLength(deckBefore - 1);
    expect(Blasmophet.zone("banished")).toHaveLength(banishedBefore + 1);
    const replacementBanishedId = Blasmophet.findCardInZone("banished", snatchRed);
    expect(game.objectState(replacementBanishedId).faceDown).toBe(true);
  });

  it("AAA boundary: without blood-debt banished, end turn keeps life", () => {
    const game = FabTestEngine.start(
      { hero: blasmophetLeviaConsumed, life: 20, deck: 4 },
      { hero: dash, deck: 4 },
    );
    expect(game.as(blasmophetLeviaConsumed).life()).toBe(20);
  });
});
