/**
 * AAA test for trigger:fuse.
 * Representative card: Insidious Chill Blue (UPR140).
 * Whenever you Ice Fuse, remove a frost counter from Insidious Chill.
 */
import { describe, expect, it } from "vitest";
import { insidiousChillBlue } from "../../../../../../cards/src/cards/actions/insidious-chill.ts";
import { encaseRed } from "../../../../../../cards/src/cards/actions/encase.ts";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

function frostCount(game: FabTestEngine, instanceId: string): number {
  return (game.getState().objects[instanceId]?.counters ?? [])
    .filter((c) => c.kind === "named" && c.name === "frost")
    .reduce((sum, c) => sum + c.count, 0);
}

function resolveDecisions(game: FabTestEngine): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.combat()?.open || game.getState().rulesStack.length > 0) {
        try {
          game.passBoth();
        } catch {
          return;
        }
        continue;
      }
      return;
    }
    if (decision.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision.kind === "entity-target") {
      const pick = decision.candidates[0];
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision.kind === "payment" && decision.cancellable) {
      game.answerDecision(decision.actorId, { kind: "cancel" });
      continue;
    }
    if (game.answerForcedDecision()) continue;
    return;
  }
}

describe("trigger: fuse", () => {
  it("AAA: Insidious Chill loses a frost counter when Ice-fusing Encase (UPR140)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [insidiousChillBlue, encaseRed, insidiousChillBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed, snatchRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    const Bravo = game.as(bravo);
    // Play Chill so enter-arena replacement seeds 3 frost counters.
    Bravo.play(insidiousChillBlue);
    resolveDecisions(game);
    const chillId = Bravo.findCardInZone("arena", insidiousChillBlue);
    const frostBefore = frostCount(game, chillId);
    expect(frostBefore).toBe(3);

    // Fuse Encase revealing an Ice card (second Chill in hand). The arena Chill's
    // fuse trigger removes a frost counter (not log-only).
    const bravoHeroId = Bravo.getState().players[Bravo.id]!.heroCardId!;
    Bravo.play(encaseRed, {
      fuseCards: insidiousChillBlue,
      targetInstanceId: bravoHeroId,
    });
    resolveDecisions(game);

    const frostAfter = frostCount(game, chillId);
    expect(frostAfter).toBeLessThan(frostBefore);
    expect(frostAfter).toBeGreaterThanOrEqual(1);
  });
});
