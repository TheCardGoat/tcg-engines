/**
 * Stat modifier, keyword, and pilot effect handlers
 */

import type { CardInstanceId } from "../../../types/branded.ts";
import type { KeywordEffect, EffectDuration } from "@tcg/gundam-types";
import type { EffectExecutionContext } from "../executor.ts";
import type { ContinuousEffectEntry } from "../../types.ts";
import { hasRestriction } from "../../rules/derived-state.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";
import { enqueueOwnCardTriggers, enqueueObserverTriggers } from "../pending-effects.ts";
import { executePilotPairing } from "../../moves/core/pilot-pairing.ts";

let effectIdCounter = 0;

// =============================================================================
// Keyword Grant
// =============================================================================

export function handleGrantKeywordAction(
  targetIds: readonly CardInstanceId[],
  keyword: KeywordEffect,
  value: number,
  duration: EffectDuration,
  ctx: EffectExecutionContext,
): void {
  for (const cardId of targetIds) {
    if (duration === "permanent") {
      const meta = ctx.framework.cards.getMeta(cardId as string) ?? {};
      const granted = (meta.grantedKeywords as string[] | undefined) ?? [];
      const values = (meta.grantedKeywordValues as Record<string, number> | undefined) ?? {};
      ctx.framework.cards.patchMeta(cardId as string, {
        grantedKeywords: granted.includes(keyword) ? granted : [...granted, keyword],
        grantedKeywordValues: { ...values, [keyword]: (values[keyword] ?? 0) + value },
      });
    } else {
      pushContinuousEffect(
        {
          id: `eff_${++effectIdCounter}`,
          sourceId: ctx.sourceCardId ?? "",
          targetId: cardId as string,
          payload: { kind: "keyword-grant", keyword, value },
          duration: mapDuration(duration),
          createdAtTurn: ctx.framework.state.status.turn,
        },
        ctx,
      );
    }

    emitGundamEvent(ctx.framework.events, {
      kind: "KEYWORD_GRANTED",
      payload: { cardId, keyword, duration },
    });
    emitGundamLog(ctx.framework, {
      type: "gundam.effect.keywordGranted",
      values: { cardId: cardId as string, keyword, duration },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });
  }
}

// =============================================================================
// Stat Modifier
// =============================================================================

export function handleStatModifierAction(
  targetIds: readonly CardInstanceId[],
  stat: "ap" | "hp" | "cost",
  amount: number,
  duration: EffectDuration,
  ctx: EffectExecutionContext,
): void {
  const effectStat = stat === "cost" ? ("cost" as const) : stat;

  for (const cardId of targetIds) {
    // Check if a negative modifier (reduction) is prevented for this stat
    if (amount < 0) {
      const preventKey = `prevent-stat-reduction-${effectStat}`;
      if (hasRestriction(cardId as string, preventKey, ctx.G, ctx.framework.cards)) {
        continue;
      }
      // Enemy-only prevention: block reductions from opponent-controlled sources
      const preventEnemyKey = `prevent-stat-reduction-${effectStat}-enemy`;
      if (hasRestriction(cardId as string, preventEnemyKey, ctx.G, ctx.framework.cards)) {
        const sourceOwner = ctx.sourceCardId
          ? ctx.framework.cards.getOwner(ctx.sourceCardId)
          : undefined;
        const targetOwner = ctx.framework.cards.getOwner(cardId as string);
        if (sourceOwner && targetOwner && sourceOwner !== targetOwner) {
          continue;
        }
      }
    }

    if (duration === "permanent") {
      // For permanent modifiers, patch the meta
      const key = `${effectStat}Modifier`;
      const meta = ctx.framework.cards.getMeta(cardId as string) ?? {};
      const current = (meta[key] as number | undefined) ?? 0;
      ctx.framework.cards.patchMeta(cardId as string, {
        [key]: current + amount,
      });
    } else {
      // Temporary: push to continuous effects
      pushContinuousEffect(
        {
          id: `eff_${++effectIdCounter}`,
          sourceId: ctx.sourceCardId ?? "",
          targetId: cardId as string,
          payload: {
            kind: "stat-modifier",
            stat: effectStat === "cost" ? "ap" : effectStat,
            modifier: amount,
          },
          duration: mapDuration(duration),
          createdAtTurn: ctx.framework.state.status.turn,
        },
        ctx,
      );
    }

    emitGundamEvent(ctx.framework.events, {
      kind: "STAT_MODIFIED",
      payload: { cardId, stat, amount, duration },
    });
    emitGundamLog(ctx.framework, {
      type: "gundam.effect.statModified",
      values: { cardId: cardId as string, stat, amount, duration },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    // Reactive trigger: "When this Unit's AP is reduced by an enemy effect"
    // Fire when stat is AP, amount is negative (reduction), and the source
    // player is the opponent of the modified card's owner.
    if (stat === "ap" && amount < 0) {
      const modifiedOwnerId = ctx.framework.cards.getOwner(cardId as string) as string | undefined;
      if (modifiedOwnerId && ctx.sourcePlayerId && modifiedOwnerId !== ctx.sourcePlayerId) {
        const apEvent = {
          type: "apReducedByEnemy" as const,
          cardId: cardId as string,
          ownerId: modifiedOwnerId,
          playerId: ctx.sourcePlayerId,
          amount,
        };
        enqueueOwnCardTriggers(ctx.G, apEvent, cardId as string, modifiedOwnerId, ctx.framework);
        enqueueObserverTriggers(ctx.G, apEvent, ctx.framework, cardId as string);

        emitGundamEvent(ctx.framework.events, {
          kind: "AP_REDUCED_BY_ENEMY",
          payload: { cardId, amount, sourceCardId: ctx.sourceCardId },
        });
      }
    }
  }
}

// =============================================================================
// Pair Pilot
// =============================================================================

/**
 * Assign a pilot card to a unit.
 * @param pilotId - instance ID of the pilot
 * @param unitId - instance ID of the unit to receive the pilot
 */
export function handlePairPilotAction(
  pilotId: string,
  unitId: string,
  ctx: EffectExecutionContext,
): void {
  // Rules 3-3-4/3-3-5: effects that pair a Pilot do not exchange an
  // existing Pilot or bypass a Unit's pairing restriction. Prompt
  // generation filters these targets too; retain this execution guard for
  // committed/stale targets and callers that resolve without a prompt.
  if (
    ctx.G.pilotAssignments[unitId] ||
    hasRestriction(unitId, "cannot-pair-pilot", ctx.G, ctx.framework.cards, ctx.framework)
  ) {
    return;
  }

  // Route effect-driven pairing through the same trigger-aware path as the
  // public Pair moves so When Paired, When Linked, and observer triggers fire.
  const pilotOwnerId = ctx.framework.cards.getOwner(pilotId) as string | undefined;
  executePilotPairing(
    pilotId,
    unitId,
    pilotOwnerId ?? (ctx.sourcePlayerId as string),
    ctx.G,
    ctx.framework,
  );
}

// =============================================================================
// Helpers
// =============================================================================

export function mapDuration(duration: EffectDuration): ContinuousEffectEntry["duration"] {
  switch (duration) {
    case "thisTurn":
      return "this-turn";
    case "thisBattle":
      return "this-battle";
    case "whileLinked":
    case "permanent":
    default:
      return "permanent";
  }
}

function pushContinuousEffect(entry: ContinuousEffectEntry, ctx: EffectExecutionContext): void {
  ctx.G.continuousEffects.push(entry);
}
