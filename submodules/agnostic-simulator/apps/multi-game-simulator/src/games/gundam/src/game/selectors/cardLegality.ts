import { useMemo, useSyncExternalStore } from "react";

import { useOptionalGundamGame } from "../context.tsx";
import { usePending } from "../hooks.ts";
import type { GameSnapshot } from "../store.ts";
import type { BoardProjection, PendingState } from "../types.ts";
import { interactionViewHasSourceCard } from "./interactionView.ts";

type PendingMoveStep = Extract<PendingState, { status: "collecting" }>["steps"][number];

/**
 * Tri-state legality for a card from the viewer's perspective.
 *
 * Derived from the shared protocol interaction view; no parallel move
 * translation state.
 *
 *   - `playable` — the card is a legal selection for at least one
 *     currently-available move.
 *   - `disabled` — the card sits in a viewer-controlled, action-eligible
 *     zone (hand, battle area) but no available move accepts it right
 *     now. The UI should mark it as inert-with-reason.
 *   - `inert`   — anything else (opponent cards, resources, deck, base,
 *     trash, shields). The UI should not decorate it.
 */
export type CardLegality = "playable" | "disabled" | "inert";

/**
 * Zone-name prefixes (the part before the `:playerId` suffix used by
 * `view.zones.zones`) where a card is normally clickable for an action.
 * Resources, deck, trash, shields, and base are intentionally excluded:
 * the player doesn't initiate moves by clicking those cards even when
 * their owner controls them.
 */
const ACTIONABLE_ZONES: ReadonlySet<string> = new Set(["hand", "battleArea"]);

type IndexedCard = BoardProjection["zones"]["zones"][string]["cards"][number];

const cardIndexCache = new WeakMap<BoardProjection, ReadonlyMap<string, IndexedCard>>();

function getCardIndex(view: BoardProjection): ReadonlyMap<string, IndexedCard> {
  const cached = cardIndexCache.get(view);
  if (cached) return cached;

  const index = new Map<string, IndexedCard>();
  for (const zone of Object.values(view.zones.zones)) {
    for (const card of zone.cards) {
      index.set(card.instanceId, card);
    }
  }
  cardIndexCache.set(view, index);
  return index;
}

function zoneNameOf(zoneId: string): string {
  // Zone keys are `${name}:${playerId}` — see mappers.ts:193.
  const colon = zoneId.indexOf(":");
  return colon === -1 ? zoneId : zoneId.slice(0, colon);
}

// Standalone (no-provider) fallback. `useSyncExternalStore` requires a
// stable subscriber + snapshot, so we share one of each across calls.
const subscribeNoop = () => () => {};
const getNullSnapshot = (): GameSnapshot | null => null;

export function useCardLegality(cardId: string | undefined): CardLegality {
  const game = useOptionalGundamGame();
  // The store's getSnapshot returns the same reference until state
  // actually changes (see store.ts:29), so passing it directly to
  // useSyncExternalStore avoids the new-object-per-render trap.
  const snapshot = useSyncExternalStore<GameSnapshot | null>(
    game?.store.subscribe ?? subscribeNoop,
    game ? game.store.getSnapshot : getNullSnapshot,
    getNullSnapshot,
  );
  const viewerId = game?.viewerId;

  return useMemo<CardLegality>(() => {
    if (!cardId || !snapshot || viewerId === undefined) return "inert";

    if (interactionViewHasSourceCard(snapshot.interactionView, cardId)) {
      return "playable";
    }

    const card = getCardIndex(snapshot.view).get(cardId);
    if (!card) return "inert";
    if (card.controllerId !== String(viewerId)) return "inert";
    if (!ACTIONABLE_ZONES.has(zoneNameOf(card.zoneId))) return "inert";
    return "disabled";
  }, [cardId, snapshot, viewerId]);
}

/**
 * Lazy disabled-reason probe. Returns `undefined` until the speculative
 * validation surface is wired through `EngineAdapter` — at which point
 * this hook will call the runtime's `validateMove` against the canonical
 * move for the card's zone/type and return the rejection envelope.
 *
 * Kept as a hook (not a synchronous helper) so callers can wire it up
 * without restructuring later: today it's a no-op, tomorrow it reads
 * from the adapter.
 */
export function useCardDisabledReason(_cardId: string | undefined): undefined {
  return undefined;
}

/**
 * Shape of the active targeting step, when the pending move is currently
 * collecting a target. Returns `null` outside target-collection mode.
 *
 * This is the engine's `selectTarget` step from `describeProcedure`,
 * surfaced as a UI selector so card components can light up legal
 * targets without each one re-deriving the same shape from `usePending`.
 */
export interface TargetingStep {
  readonly role: string;
  readonly minTargets: number;
  readonly maxTargets: number;
  readonly candidateIds: ReadonlySet<string>;
}

export function useCurrentTargetingStep(): TargetingStep | null {
  const { state } = usePending();

  return useMemo<TargetingStep | null>(() => {
    if (state.status !== "collecting") return null;
    const step: PendingMoveStep | undefined = state.steps[0];
    if (!step || step.kind !== "selectTarget") return null;
    return {
      role: step.role,
      minTargets: step.minTargets,
      maxTargets: step.maxTargets,
      candidateIds: new Set(step.candidateIds),
    };
  }, [state]);
}
