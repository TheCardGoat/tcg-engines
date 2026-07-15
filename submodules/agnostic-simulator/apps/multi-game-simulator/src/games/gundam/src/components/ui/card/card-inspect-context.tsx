import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { DOMRectLike, GameCardData } from "../types.ts";

interface HoverState {
  readonly card: GameCardData;
}

interface InspectState {
  readonly card: GameCardData;
  readonly anchor: DOMRectLike;
}

interface CardInspectContextValue {
  readonly hovered: HoverState | null;
  readonly inspected: InspectState | null;
  readonly setHover: (card: GameCardData | null) => void;
  readonly openInspect: (card: GameCardData, anchor: DOMRectLike) => void;
  /**
   * Replace the inspected card snapshot in place (keeping the anchor) when
   * the engine's projection yields a fresh copy for the same cardId. Used
   * by `GameCard` to propagate live damage / exerted / selection updates
   * into an already-open dossier without forcing the user to re-open it.
   * No-op if the currently inspected card's id differs.
   */
  readonly refreshInspect: (card: GameCardData) => void;
  readonly closeInspect: () => void;
}

const CardInspectContext = createContext<CardInspectContextValue | null>(null);

/**
 * Shallow compare the `GameCardData` fields that actually drive the hover
 * preview and dossier — if none of them moved, re-pushing the snapshot
 * would only churn context state (each mapper call returns a fresh
 * spread, so reference-equality alone is never true). Without this gate,
 * GameCard's sync effect cycles indefinitely.
 *
 * `keywords` and `traits` are carried through by reference from the
 * engine definition, so their identity is stable across renders unless
 * the definition itself changed — comparing by reference is enough.
 */
function shallowArrayEq<T>(a: readonly T[] | undefined, b: readonly T[] | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function shallowActiveEffectsEq(
  a: readonly import("../types.ts").ActiveEffectEntry[] | undefined,
  b: readonly import("../types.ts").ActiveEffectEntry[] | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].sourceId !== b[i].sourceId ||
      a[i].kind !== b[i].kind ||
      a[i].description !== b[i].description
    )
      return false;
  }
  return true;
}

function sameCardSnapshot(a: GameCardData, b: GameCardData): boolean {
  if (a === b) return true;
  return (
    a.id === b.id &&
    a.name === b.name &&
    a.subtitle === b.subtitle &&
    a.color === b.color &&
    a.cardType === b.cardType &&
    a.cost === b.cost &&
    a.level === b.level &&
    a.ap === b.ap &&
    a.hp === b.hp &&
    a.baseAp === b.baseAp &&
    a.baseHp === b.baseHp &&
    a.damage === b.damage &&
    a.exerted === b.exerted &&
    a.selected === b.selected &&
    a.highlight === b.highlight &&
    a.faceDown === b.faceDown &&
    a.effect === b.effect &&
    a.linkRequirement === b.linkRequirement &&
    a.set === b.set &&
    a.cardNumber === b.cardNumber &&
    a.keywords === b.keywords &&
    a.traits === b.traits &&
    shallowArrayEq(a.grantedKeywords, b.grantedKeywords) &&
    a.playable === b.playable &&
    a.deployedThisTurn === b.deployedThisTurn &&
    shallowActiveEffectsEq(a.activeEffects, b.activeEffects)
  );
}

export function CardInspectProvider({ children }: { readonly children: ReactNode }) {
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const [inspected, setInspected] = useState<InspectState | null>(null);

  const setHover = useCallback((card: GameCardData | null) => {
    setHovered((prev) => {
      if (card === null) return prev === null ? prev : null;
      if (prev && sameCardSnapshot(prev.card, card)) return prev;
      return { card };
    });
  }, []);

  const openInspect = useCallback((card: GameCardData, anchor: DOMRectLike) => {
    setInspected({ card, anchor });
  }, []);

  const refreshInspect = useCallback((card: GameCardData) => {
    setInspected((prev) => {
      if (!prev || prev.card.id !== card.id) return prev;
      if (sameCardSnapshot(prev.card, card)) return prev;
      return { card, anchor: prev.anchor };
    });
  }, []);

  const closeInspect = useCallback(() => setInspected(null), []);

  const value = useMemo<CardInspectContextValue>(
    () => ({ hovered, inspected, setHover, openInspect, refreshInspect, closeInspect }),
    [hovered, inspected, setHover, openInspect, refreshInspect, closeInspect],
  );

  return <CardInspectContext.Provider value={value}>{children}</CardInspectContext.Provider>;
}

/**
 * Optional — returns `null` when used outside a provider so call sites in
 * isolated stories/tests don't need to wrap the tree.
 */
export function useCardInspect(): CardInspectContextValue | null {
  return useContext(CardInspectContext);
}
