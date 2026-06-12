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
import {
  enqueueMoveCompletionFence,
  enqueueOwnCardTriggers,
  enqueueObserverTriggers,
} from "../pending-effects.ts";

let effectIdCounter = 0;

// =============================================================================
// Keyword Grant
// =============================================================================

export function handleGrantKeywordAction(
  targetIds: readonly CardInstanceId[],
  keyword: KeywordEffect,
  duration: EffectDuration,
  ctx: EffectExecutionContext,
): void {
  for (const cardId of targetIds) {
    if (duration === "permanent") {
      const meta = ctx.framework.cards.getMeta(cardId as string) ?? {};
      const granted = (meta.grantedKeywords as string[] | undefined) ?? [];
      if (!granted.includes(keyword)) {
        ctx.framework.cards.patchMeta(cardId as string, {
          grantedKeywords: [...granted, keyword],
        });
      }
    } else {
      pushContinuousEffect(
        {
          id: `eff_${++effectIdCounter}`,
          sourceId: ctx.sourceCardId ?? "",
          targetId: cardId as string,
          payload: { kind: "keyword-grant", keyword },
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
  // Move pilot to BattleArea alongside the unit
  const pilotOwnerId = ctx.framework.cards.getOwner(pilotId) as string | undefined;
  if (pilotOwnerId) {
    ctx.framework.zones.moveCard(pilotId, { zone: "battleArea", playerId: pilotOwnerId });
  }

  ctx.G.pilotAssignments[unitId] = pilotId;

  // Placement event (synchronous) — see `handleDeployAction` in
  // movement.ts for the contract. The completion event is deferred via
  // the fence below so it fires after any future WhenPaired/WhenLinked
  // triggers added here would settle. (This handler doesn't currently
  // enqueue those triggers — separate gap from the contract fix — but
  // routing through the fence keeps the contract uniform.)
  emitGundamEvent(ctx.framework.events, {
    kind: "PILOT_PAIRED",
    payload: { pilotId, unitId },
  });
  enqueueMoveCompletionFence(
    ctx.G,
    pilotOwnerId ?? (ctx.sourcePlayerId as unknown as string),
    ctx.framework,
    [
      {
        kind: "emitEvent",
        event: {
          kind: "PILOT_ASSIGNED",
          payload: { pilotId, unitId },
        },
      },
    ],
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
