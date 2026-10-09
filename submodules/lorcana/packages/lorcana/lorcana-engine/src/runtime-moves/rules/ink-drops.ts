import type { CardInstanceId, PlayerId } from "#core";
import { invalidateStaticEffects } from "./static-effects-invalidation";
import type { LorcanaG } from "../../types";
import { emitTriggeredLorcanaEvent } from "../effects/triggered-abilities";
import { recordInkDropsGainedThisTurn, recordInkDropsRemovedThisTurn } from "../state/turn-metrics";

/**
 * Ink drops (Hyperia City): player-attached counters a player may remove to
 * pay 1 {I} of any ink cost. Drops persist across turns, are never cards, and
 * gain/remove events feed both turn metrics and triggered abilities.
 */

type InkDropReadContext = {
  /** Projection contexts hand back readonly G; writes only ever run on move
   * contexts where G is mutable. */
  G?: {
    readonly inkDrops?: Readonly<Record<string, number>>;
    readonly turnMetadata?: unknown;
  };
  /** Structural escape hatch — move contexts expose G directly; minimal cost
   * contexts expose it via framework.state.G (MatchState). */
  framework?: unknown;
};

type InkDropWriteContext = {
  G: Pick<LorcanaG, "inkDrops" | "turnMetadata">;
};

type InkDropStore = Pick<LorcanaG, "inkDrops" | "turnMetadata" | "staticEffectsVersion">;

/** Resolve the G that owns ink-drop counters: move contexts carry G directly;
 * minimal cost contexts (payBasicCost) expose it via framework.state.G. */
export function resolveInkDropStore(ctx: InkDropReadContext): InkDropStore | undefined {
  return (
    (ctx.G as InkDropStore | undefined) ??
    (ctx.framework as { state?: { G?: InkDropStore } } | undefined)?.state?.G ??
    undefined
  );
}

/** Read the current number of ink drops a player holds. */
export function getInkDropCount(ctx: InkDropReadContext, playerId: PlayerId): number {
  const inkDrops = resolveInkDropStore(ctx)?.inkDrops;
  return Number(inkDrops?.[playerId] ?? 0);
}

/**
 * Give a player N ink drops. Emits the `ink-drop-gained` trigger event with a
 * `triggerAmount` snapshot so "get N ink drops" amounts are trigger-visible.
 */
export function gainInkDrops(
  ctx: Parameters<typeof emitTriggeredLorcanaEvent>[0] & { G?: InkDropStore },
  playerId: PlayerId,
  amount: number,
  source: string,
  sourceCardId?: CardInstanceId,
): number {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? Math.floor(amount) : 0;
  if (safeAmount === 0) {
    return getInkDropCount(ctx, playerId);
  }
  const G = resolveInkDropStore(ctx) as InkDropStore | undefined;
  if (!G) {
    return getInkDropCount(ctx, playerId);
  }
  const inkDrops = G.inkDrops ?? (G.inkDrops = {} as Record<PlayerId, number>);
  const previous = Number(inkDrops[playerId] ?? 0);
  const next = previous + safeAmount;
  inkDrops[playerId] = next;
  invalidateStaticEffects({ G });
  recordInkDropsGainedThisTurn({ G }, playerId, safeAmount);
  emitTriggeredLorcanaEvent(
    ctx,
    "inkDropChanged",
    {
      playerId,
      operation: "add",
      source,
      amount: safeAmount,
      previousInkDrops: previous,
      newInkDrops: next,
    },
    {
      event: "ink-drop-gained",
      playerId,
      triggerSourceCardId: sourceCardId,
      eventSnapshot: {
        triggerAmount: safeAmount,
      },
    },
  );
  return next;
}

/**
 * Remove N ink drops from a player (payment or effect). Emits the
 * `ink-drop-removed` trigger event ("Whenever you remove an ink drop, ...").
 * Returns the number actually removed, clamped to what the player holds.
 */
export function removeInkDrops(
  ctx: Parameters<typeof emitTriggeredLorcanaEvent>[0] & { G?: InkDropStore },
  playerId: PlayerId,
  amount: number,
  source: string,
  sourceCardId?: CardInstanceId,
): number {
  const G = resolveInkDropStore(ctx) as InkDropStore | undefined;
  if (!G) {
    return 0;
  }
  const inkDrops = G.inkDrops ?? (G.inkDrops = {} as Record<PlayerId, number>);
  const previous = Number(inkDrops[playerId] ?? 0);
  const removed = Math.max(0, Math.min(Math.floor(amount) || 0, previous));
  if (removed === 0) {
    return 0;
  }
  const next = previous - removed;
  inkDrops[playerId] = next;
  invalidateStaticEffects({ G });
  recordInkDropsRemovedThisTurn({ G }, playerId, removed);
  emitTriggeredLorcanaEvent(
    ctx,
    "inkDropChanged",
    {
      playerId,
      operation: "remove",
      source,
      amount: removed,
      previousInkDrops: previous,
      newInkDrops: next,
    },
    {
      event: "ink-drop-removed",
      playerId,
      triggerSourceCardId: sourceCardId,
      eventSnapshot: {
        triggerAmount: removed,
      },
    },
  );
  return removed;
}
