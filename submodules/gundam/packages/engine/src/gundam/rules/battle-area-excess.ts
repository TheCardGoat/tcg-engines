/**
 * Rules 11-4 / 4-5-4 — battle area unit limit (max 6).
 *
 * When a Unit is deployed into a full battle area, choose existing Unit(s)
 * to place into the trash. Those placements are not destruction (5-10-4, 11-4-2-1).
 * Simultaneously deployed Units (11-4-2-2) stay out of the legal trash set.
 */

import type { CardEffect } from "@tcg/gundam-types";
import type { FrameworkWriteAPI } from "../../types/move-types.ts";
import type { GundamG, PendingEffect } from "../types.ts";
import { enqueuePendingEffect, nextPendingEffectId } from "../effects/pending-effects.ts";

export const BATTLE_AREA_UNIT_LIMIT = 6;

/** Stable substring of user-facing sourceText for pending-effect detection. */
const BATTLE_AREA_EXCESS_SOURCE_TEXT = "in your battle area to place into your trash";

function buildBattleAreaExcessEffect(
  excessCount: number,
  protectedInstanceIds: readonly string[],
): CardEffect {
  const noun = excessCount === 1 ? "Unit" : "Units";
  return {
    type: "triggered",
    activation: { timing: [] },
    directives: [
      {
        action: {
          action: "placeInTrash",
          target: {
            owner: "friendly",
            zone: "battleArea",
            cardType: "unit",
            count: excessCount,
            // Rule 11-4-2 / 11-4-2-2: choose Units that were already in the
            // battle area; every Unit that entered during this overflow wave
            // must remain. Protection is entirely via excludeInstanceIds
            // (includes sourceCardId / all simultaneous deployees).
            excludeInstanceIds: [...protectedInstanceIds],
          },
        },
      },
    ],
    sourceText: `Choose ${excessCount} ${noun} ${BATTLE_AREA_EXCESS_SOURCE_TEXT}.`,
  };
}

function isBattleAreaExcessPending(pending: PendingEffect, controllerId: string): boolean {
  return (
    pending.kind === "ruleManagement" &&
    pending.controllerId === controllerId &&
    pending.effect.sourceText?.includes(BATTLE_AREA_EXCESS_SOURCE_TEXT) === true
  );
}

function asProtectedList(source: string | readonly string[]): string[] {
  return typeof source === "string" ? [source] : [...source];
}

/**
 * Rule 11-4-2 rules management after Unit(s) enter an over-capacity battle area.
 *
 * `protectedCardIds` is the full set of Units that entered during this
 * simultaneous deploy wave (single Unit, dual tokens, etc.). Pass every
 * newly entered instance so none of them are legal trash targets.
 */
export function enqueueBattleAreaExcessManagement(
  g: GundamG,
  controllerId: string,
  protectedCardIds: string | readonly string[],
  framework: FrameworkWriteAPI,
  originatingMoveId?: string,
): void {
  const protectedIds = asProtectedList(protectedCardIds);
  if (protectedIds.length === 0) return;
  const sourceCardId = protectedIds[protectedIds.length - 1]!;

  const units = framework.zones.getCards({ zone: "battleArea", playerId: controllerId });
  // Only count Unit cards (paired Pilots are not independent board Units).
  const unitIds = units.filter((id) => {
    const def = framework.cards.getDefinition(id);
    return def?.type === "unit";
  });
  const excessCount = Math.max(0, unitIds.length - BATTLE_AREA_UNIT_LIMIT);
  if (excessCount === 0) return;

  const existing = g.pendingEffects.find((pending): pending is PendingEffect =>
    isBattleAreaExcessPending(pending, controllerId),
  );

  if (existing) {
    const priorProtected = existing.protectedCardIds ?? [existing.sourceCardId];
    const merged = [...priorProtected];
    for (const id of protectedIds) {
      if (!merged.includes(id)) merged.push(id);
    }
    existing.sourceCardId = sourceCardId;
    existing.protectedCardIds = merged;
    existing.effect = buildBattleAreaExcessEffect(excessCount, merged);
    return;
  }

  enqueuePendingEffect(
    g,
    {
      id: nextPendingEffectId(g),
      controllerId,
      sourceCardId,
      protectedCardIds: protectedIds,
      effect: buildBattleAreaExcessEffect(excessCount, protectedIds),
      effectIndex: -1,
      kind: "ruleManagement",
      originatingMoveId,
    },
    framework,
    { preempt: true },
  );
}
