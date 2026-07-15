import type { CardEffect } from "@tcg/gundam-types";
import type { FrameworkWriteAPI } from "../../types/move-types.ts";
import type { GundamG, PendingEffect } from "../types.ts";
import { enqueuePendingEffect, nextPendingEffectId } from "../effects/pending-effects.ts";

function buildBaseSectionExcessEffect(excessCount: number): CardEffect {
  const noun = excessCount === 1 ? "Base" : "Bases";
  return {
    type: "triggered",
    activation: { timing: [] },
    directives: [
      {
        action: {
          action: "placeInTrash",
          target: {
            owner: "friendly",
            zone: "baseSection",
            cardType: "base",
            count: excessCount,
          },
        },
      },
    ],
    sourceText: `Choose ${excessCount} ${noun} in your Base section to place into your trash.`,
  };
}

/**
 * Rule 11-5-2 rules management after a Base enters an occupied Base section.
 *
 * The Base has already entered the public zone when this runs. The resulting
 * ordinary target-selection prompt therefore lets the controller choose from
 * every visible Base, including the new one. Rules-management entries have a
 * dedicated priority tier so the choice settles before 【Deploy】 or observer
 * triggers continue (rule 11-1-2).
 */
export function enqueueBaseSectionExcessManagement(
  g: GundamG,
  controllerId: string,
  sourceCardId: string,
  framework: FrameworkWriteAPI,
  originatingMoveId?: string,
): void {
  const bases = framework.zones.getCards({ zone: "baseSection", playerId: controllerId });
  const excessCount = Math.max(0, bases.length - 1);
  if (excessCount === 0) return;

  // A single effect can deploy multiple Bases before the next transition.
  // Keep one human choice and widen its exact count instead of surfacing an
  // artificial ordering choice between identical rules-management entries.
  const existing = g.pendingEffects.find(
    (pending): pending is PendingEffect =>
      pending.kind === "ruleManagement" && pending.controllerId === controllerId,
  );
  if (existing) {
    existing.sourceCardId = sourceCardId;
    existing.effect = buildBaseSectionExcessEffect(excessCount);
    return;
  }

  enqueuePendingEffect(
    g,
    {
      id: nextPendingEffectId(g),
      controllerId,
      sourceCardId,
      effect: buildBaseSectionExcessEffect(excessCount),
      effectIndex: -1,
      kind: "ruleManagement",
      originatingMoveId,
    },
    framework,
    { preempt: true },
  );
}
