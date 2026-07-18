import { useMemo } from "react";
import {
  defOf,
  computeEffectiveCostDetails,
  getEffectivePower,
  getEffectiveRules,
  type ActiveEffect,
  type CardInstance,
  type DieType,
  type GigDie,
  type MatchState,
} from "@tcg/cyberpunk-engine";

export type CardColor = "blue" | "green" | "red" | "yellow";
export type EffectiveRule =
  | "blocker"
  | "goSolo"
  | "adrenaline"
  | "cantAttack"
  | "mustAttack"
  | "cantBeBlocked"
  | "canAttackOnPlayedTurnAgainstUnits";
import { useEngine } from "./engineContext";
import { PLAYER_SIDE_TO_ID, type Side } from "./sides";

/** Win condition: holding 7 Gigs at the start of your turn (cyberpunk-tcg-rules). */
export const WIN_GIG_THRESHOLD = 7;

export type EngineCardType = "legend" | "unit" | "gear" | "program";

export interface CardActiveEffectView {
  id: string;
  targetKind: "card" | "player";
  targetId: string;
  /** Public name of one affected card. Omitted for player-wide effects. */
  targetName?: string;
  sourceCardId?: string;
  sourceName: string;
  /** Public artwork for the card creating this effect, when it is available. */
  sourceImageUrl?: string;
  label: string;
  detail: string;
  modifierLabel?: string;
  effectKind: string;
  rule?: string;
  tone: "buff" | "debuff" | "neutral";
  durationLabel?: string;
  /** True only for an effect that is expected to expire rather than a printed static rule. */
  isTemporary?: boolean;
  defeatsAtEndOfTurn: boolean;
}

export interface ZoneCardView {
  /** Engine instance id — drives drag/drop ids and permission lookup. */
  cardId: string;
  /** Public card definition id. Only projected for visible cards. */
  definitionId: string;
  imageUrl: string;
  name: string;
  /** Card frame color from the catalog — drives faction accents in UI. */
  color: CardColor;
  /** "legend" | "unit" | "gear" | "program" — used for drop-routing decisions. */
  cardType: EngineCardType;
  /** Sell tag (`€$`) — eligible to be sold for an Eddie. */
  hasSellTag: boolean;
  /** Printed rules text, visible only for face-up cards in this view. */
  rulesText: string | null;
  /** Faction/sub-type tags (e.g. "Netrunner", "Cyberware"). */
  classifications: string[];
  /** Printed keywords from the card catalog. */
  keywords: string[];
  /** Engine cost; legends may omit it. */
  cost: number | null;
  /** Engine-computed cost after card-level modifiers. */
  effectiveCost: number | null;
  /** Active cost modifiers currently changing this card's play cost. */
  costEffects: CardActiveEffectView[];
  /** Engine printed power; programs/legends may omit it. */
  power: number | null;
  /** Engine-computed power after gear, static modifiers, and temporary effects. */
  effectivePower: number | null;
  /** Active effects currently changing this card or scheduled from the same source. */
  activeEffects: CardActiveEffectView[];
  /** Visual state derived from engine. */
  spent: boolean;
  /** True while this unit is still under the has-lag attack restriction. */
  hasLag: boolean;
  faceDown: boolean;
  /** Effective printed, granted, and gear-provided rules for compact UI badges. */
  effectiveRules: EffectiveRule[];
  /** Gear cards attached to this unit (empty for non-units / unattached). */
  attachedGear: ZoneCardView[];
}

export interface GigDieView {
  /** Engine die id. */
  id: string;
  /** "d4" | "d6" | "d8" | "d10" | "d12" | "d20". */
  dieType: DieType;
  /** Display label, e.g. "D6". */
  label: string;
  /** Rolled face value. `0` while still in the fixer area (unrolled). */
  faceValue: number;
}

export interface SideZoneViews {
  hand: ZoneCardView[];
  field: ZoneCardView[];
  legendArea: ZoneCardView[];
  trash: ZoneCardView[];
  trashTop: ZoneCardView | null;
  /** Dice still in the fixer area (unrolled). One is taken per turn. */
  fixerArea: GigDieView[];
  /** Dice claimed into the gig area (rolled). Counts toward win condition. */
  gigArea: GigDieView[];
  deckCount: number;
  trashCount: number;
  eddies: number;
  spentEddies: number;
  /** Face-down cards in the Eddies area. */
  eddieCards: ZoneCardView[];
  /** Number of face-down sold cards. Each pays 1 Eddie when spent. */
  eddieCardCount: number;
  /** True if this player sold a card on the current turn — the most recently
   *  added eddie card is revealed face-up until the turn ends. */
  soldThisTurn: boolean;
  /** Street cred — sum of gig dice face values. Use only for effects that care. */
  streetCred: number;
  /** Number of dice in the gig area. Counts toward {@link WIN_GIG_THRESHOLD}. */
  gigCount: number;
  /** Active effects targeting this player rather than a specific card. */
  activeEffects: CardActiveEffectView[];
}

function gearViews(
  meta: CardInstance["meta"],
  cardIndex: Record<string, CardInstance>,
  state: MatchState,
): ZoneCardView[] {
  return meta.attachedGearIds
    .map((id) => cardIndex[id as unknown as string])
    .filter((g): g is CardInstance => Boolean(g))
    .map((g) => toView(g, cardIndex, state));
}

function toView(
  instance: CardInstance,
  cardIndex: Record<string, CardInstance>,
  state: MatchState,
): ZoneCardView {
  const def = defOf(instance);
  const printedPower = "power" in def && typeof def.power === "number" ? def.power : null;
  const printedCost = "cost" in def && typeof def.cost === "number" ? def.cost : null;
  const effectiveCostDetails =
    printedCost !== null
      ? computeEffectiveCostDetails(state, instance.instanceId, instance.controllerId)
      : null;
  const effectiveRules = [
    ...new Set([
      ...(getEffectiveRules(state, instance.instanceId as unknown as string) as EffectiveRule[]),
      ...collectSelfStaticRules(instance),
    ]),
  ];
  return {
    cardId: instance.instanceId as unknown as string,
    definitionId: instance.definitionId,
    imageUrl: def.imageUrl,
    name: def.displayName ?? def.name,
    color: def.color as CardColor,
    cardType: def.type as EngineCardType,
    hasSellTag: def.hasSellTag === true,
    rulesText: def.rulesText ?? null,
    classifications: def.classifications ?? [],
    keywords: def.keywords ?? [],
    cost: printedCost,
    effectiveCost: effectiveCostDetails?.effectiveCost ?? null,
    costEffects: costEffectViews(effectiveCostDetails, instance.instanceId as unknown as string),
    power: printedPower,
    effectivePower:
      printedPower !== null
        ? getEffectivePower(state, instance.instanceId as unknown as string)
        : null,
    activeEffects: activeEffectViews(instance, state),
    spent: instance.meta.spent ?? false,
    hasLag: instance.meta.hasLag ?? false,
    faceDown: instance.meta.faceDown ?? false,
    effectiveRules,
    attachedGear: gearViews(instance.meta, cardIndex, state),
  };
}

function costEffectViews(
  details: ReturnType<typeof computeEffectiveCostDetails> | null,
  targetId: string,
): CardActiveEffectView[] {
  if (!details) return [];
  return details.modifiers.map((modifier) => ({
    id: modifier.id,
    targetKind: "card" as const,
    targetId,
    sourceCardId: modifier.sourceCardId as unknown as string,
    sourceName: modifier.sourceName,
    label: modifier.label,
    detail: modifier.detail,
    modifierLabel: modifier.modifierLabel,
    effectKind: "costModifier",
    tone: modifier.delta <= 0 ? ("buff" as const) : ("debuff" as const),
    durationLabel: "while active",
    defeatsAtEndOfTurn: false,
  }));
}

function activeEffectViews(instance: CardInstance, state: MatchState): CardActiveEffectView[] {
  const targetId = instance.instanceId as unknown as string;
  const views: CardActiveEffectView[] = state.G.activeEffects
    .filter((effect) => effect.playerId === undefined && String(effect.targetCardId) === targetId)
    .map((effect) => {
      const sourceName = sourceCardName(effect.sourceCardId as unknown as string, state);
      const sourceImageUrl = sourceCardImageUrl(effect.sourceCardId as unknown as string, state);
      const defeatsAtEndOfTurn = hasEndOfTurnDefeatFromSource(
        state,
        effect.sourceCardId as unknown as string,
        targetId,
      );
      const durationLabel = durationLabelForEffect(effect);
      const base = {
        id: effect.id,
        targetKind: "card" as const,
        targetId,
        sourceCardId: effect.sourceCardId as unknown as string,
        sourceName,
        sourceImageUrl,
        targetName: defOf(instance).displayName ?? defOf(instance).name,
        effectKind: effect.kind,
        durationLabel,
        isTemporary: effect.origin !== "static" && effect.duration !== "continuous",
        defeatsAtEndOfTurn,
      };

      if (effect.kind === "powerModifier") {
        const modifier = effect.powerModifier ?? 0;
        const modifierLabel = signedNumber(modifier);
        return {
          ...base,
          label: `${modifierLabel} PWR`,
          detail: `${sourceName}: ${modifierLabel} power ${durationLabel}${defeatsAtEndOfTurn ? "; defeated at end of turn" : ""}.`,
          modifierLabel,
          tone: modifier >= 0 ? ("buff" as const) : ("debuff" as const),
        };
      }

      if (effect.kind === "powerMultiplier") {
        const multiplier = effect.powerMultiplier ?? 1;
        return {
          ...base,
          label: `x${multiplier} PWR`,
          detail: `${sourceName}: power x${multiplier} ${durationLabel}${defeatsAtEndOfTurn ? "; defeated at end of turn" : ""}.`,
          modifierLabel: `x${multiplier}`,
          tone: multiplier >= 1 ? ("buff" as const) : ("debuff" as const),
        };
      }

      const ruleLabel = formatRuleLabel(effect.rule);
      return {
        ...base,
        label: ruleLabel,
        detail:
          effect.rule === "mustAttack"
            ? `Must attack next turn if able. Source: ${sourceName}.`
            : `${sourceName}: ${ruleLabel} ${durationLabel}${defeatsAtEndOfTurn ? "; defeated at end of turn" : ""}.`,
        rule: effect.rule,
        tone: "neutral" as const,
      };
    });

  const coveredDefeatSources = new Set(
    views.filter((view) => view.defeatsAtEndOfTurn).map((view) => view.sourceName),
  );
  const delayedDefeatViews: CardActiveEffectView[] = state.G.effectBag
    .filter(
      (entry) =>
        hasDelayedDefeat(entry.delayedEffects) &&
        Object.values(entry.resolvedBindings ?? {}).some((ids) => ids.includes(targetId)),
    )
    .flatMap((entry) => {
      const sourceName = sourceCardName(entry.sourceCardId as unknown as string, state);
      if (coveredDefeatSources.has(sourceName)) return [];
      return [
        {
          id: entry.id,
          targetKind: "card" as const,
          targetId,
          sourceCardId: entry.sourceCardId as unknown as string,
          sourceName,
          sourceImageUrl: sourceCardImageUrl(entry.sourceCardId as unknown as string, state),
          targetName: defOf(instance).displayName ?? defOf(instance).name,
          label: "End defeat",
          detail: `${sourceName}: defeated at end of turn.`,
          effectKind: "delayedDefeat",
          tone: "debuff" as const,
          durationLabel: "end of turn",
          isTemporary: true,
          defeatsAtEndOfTurn: true,
        },
      ];
    });

  return [...views, ...delayedDefeatViews];
}

function playerActiveEffectViews(playerId: string, state: MatchState): CardActiveEffectView[] {
  return state.G.activeEffects
    .filter((effect) => effect.playerId !== undefined && String(effect.playerId) === playerId)
    .map((effect) => {
      const sourceName = sourceCardName(effect.sourceCardId as unknown as string, state);
      const sourceImageUrl = sourceCardImageUrl(effect.sourceCardId as unknown as string, state);
      const durationLabel = durationLabelForEffect(effect);
      const label = activeEffectLabel(effect);

      return {
        id: effect.id,
        targetKind: "player" as const,
        targetId: playerId,
        sourceCardId: effect.sourceCardId as unknown as string,
        sourceName,
        sourceImageUrl,
        label,
        detail: `${sourceName}: ${label} ${durationLabel}.`,
        effectKind: effect.kind,
        tone: activeEffectTone(effect),
        durationLabel,
        isTemporary: effect.origin !== "static" && effect.duration !== "continuous",
        defeatsAtEndOfTurn: false,
      };
    });
}

function sourceCardName(cardId: string, state: MatchState): string {
  const source = state.G.cardIndex[cardId];
  if (!source) return "Effect";
  const def = defOf(source);
  return def.displayName ?? def.name;
}

function sourceCardImageUrl(cardId: string, state: MatchState): string | undefined {
  const source = state.G.cardIndex[cardId];
  return source ? defOf(source).imageUrl : undefined;
}

function hasEndOfTurnDefeatFromSource(
  state: MatchState,
  sourceCardId: string,
  targetCardId: string,
): boolean {
  return state.G.effectBag.some(
    (entry) =>
      String(entry.sourceCardId) === sourceCardId &&
      hasDelayedDefeat(entry.delayedEffects) &&
      Object.values(entry.resolvedBindings ?? {}).some((ids) => ids.includes(targetCardId)),
  );
}

function hasDelayedDefeat(
  effects: MatchState["G"]["effectBag"][number]["delayedEffects"],
): boolean {
  return (effects ?? []).some((effect) => effect.effect === "defeat");
}

function signedNumber(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

function durationLabelForEffect(effect: Pick<ActiveEffect, "duration">): string {
  if (effect.duration === "turn") return "this turn";
  if (effect.duration === "untilSourceNextTurn") return "until source's next turn";
  return "while active";
}

function formatRuleLabel(rule: string | undefined): string {
  if (!rule) return "Rule";
  return rule
    .replace(/[A-Z]/g, (letter) => ` ${letter}`)
    .trim()
    .toUpperCase();
}

function activeEffectLabel(effect: ActiveEffect): string {
  if (effect.kind === "powerModifier") return `${signedNumber(effect.powerModifier ?? 0)} PWR`;
  if (effect.kind === "powerMultiplier") return `x${effect.powerMultiplier ?? 1} PWR`;
  if (effect.kind === "costModifier") return "Cost modifier";
  return formatRuleLabel(effect.rule);
}

function activeEffectTone(effect: ActiveEffect): CardActiveEffectView["tone"] {
  if (effect.kind === "powerModifier") return (effect.powerModifier ?? 0) >= 0 ? "buff" : "debuff";
  if (effect.kind === "powerMultiplier") {
    return (effect.powerMultiplier ?? 1) >= 1 ? "buff" : "debuff";
  }
  if (effect.kind === "costModifier") return "buff";
  if (effect.rule === "cantAttack" || effect.rule === "mustAttack") return "debuff";
  return "neutral";
}

function collectSelfStaticRules(instance: CardInstance): EffectiveRule[] {
  const def = defOf(instance) as {
    abilities?: Array<{
      kind?: string;
      effects?: Array<{
        effect?: string;
        rule?: string;
        target?: { selector?: string };
      }>;
    }>;
  };

  return (def.abilities ?? [])
    .filter((ability) => ability.kind === "static")
    .flatMap((ability) => ability.effects ?? [])
    .filter((effect) => effect.effect === "grantRule" && effect.target?.selector === "self")
    .map((effect) => effect.rule)
    .filter((rule): rule is EffectiveRule => isEffectiveRule(rule));
}

function isEffectiveRule(rule: string | undefined): rule is EffectiveRule {
  return (
    rule === "blocker" ||
    rule === "goSolo" ||
    rule === "adrenaline" ||
    rule === "cantAttack" ||
    rule === "mustAttack" ||
    rule === "cantBeBlocked" ||
    rule === "canAttackOnPlayedTurnAgainstUnits"
  );
}

function dieView(die: GigDie): GigDieView {
  return {
    id: die.id as unknown as string,
    dieType: die.dieType,
    label: die.dieType.toUpperCase(),
    faceValue: die.faceValue,
  };
}

const EMPTY_VIEW: SideZoneViews = {
  hand: [],
  field: [],
  legendArea: [],
  trash: [],
  trashTop: null,
  fixerArea: [],
  gigArea: [],
  deckCount: 0,
  trashCount: 0,
  eddies: 0,
  spentEddies: 0,
  eddieCards: [],
  eddieCardCount: 0,
  soldThisTurn: false,
  streetCred: 0,
  gigCount: 0,
  activeEffects: [],
};

/**
 * Look up any card by engine instance id. Returns a plain {@link ZoneCardView}
 * regardless of which zone the card lives in, or `null` if unknown.
 */
export function useCardView(cardId: string | null | undefined): ZoneCardView | null {
  const { matchState } = useEngine();
  return useMemo(() => {
    if (!cardId) {
      return null;
    }
    const inst = matchState.G.cardIndex[cardId];
    if (!inst) {
      return null;
    }
    return toView(inst, matchState.G.cardIndex, matchState);
  }, [cardId, matchState]);
}

/**
 * Look up a card by its rendered display name. Used by logs that only carry
 * localized action params rather than stable instance ids.
 */
export function useCardViewByName(cardName: string | null | undefined): ZoneCardView | null {
  const { matchState } = useEngine();
  return useMemo(() => {
    if (!cardName) {
      return null;
    }
    const inst = Object.values(matchState.G.cardIndex).find((card) => {
      const def = defOf(card);
      return (def.displayName ?? def.name) === cardName;
    });
    return inst ? toView(inst, matchState.G.cardIndex, matchState) : null;
  }, [cardName, matchState]);
}

/**
 * Pull the cards in each rendered zone for a given side, in stable order.
 * Returns plain view-models so the existing zone components don't need to know
 * about engine internals.
 */
export function useSideZones(side: Side): SideZoneViews {
  const { matchState } = useEngine();
  return useMemo(() => {
    const playerId = PLAYER_SIDE_TO_ID[side] as unknown as string;
    const player = matchState.G.players[playerId];
    if (!player) {
      return EMPTY_VIEW;
    }

    const cardIndex = matchState.G.cardIndex;
    const lookup = (id: string): CardInstance | undefined => cardIndex[id];
    const mapZone = (
      ids: ReadonlyArray<string | { toString(): string }>,
      opts?: { includeAttached?: boolean },
    ): ZoneCardView[] =>
      ids
        .map((id) => lookup(String(id)))
        .filter((c): c is CardInstance => Boolean(c))
        .filter((c) => opts?.includeAttached !== false || !c.meta.attachedToId)
        .map((c) => toView(c, cardIndex, matchState));

    const trashCards = mapZone(player.zones.trash as unknown as string[]);

    const lookupDie = (id: string): GigDie | undefined =>
      matchState.G.gigDice[id as unknown as string];
    const mapDice = (ids: ReadonlyArray<string | { toString(): string }>): GigDieView[] =>
      ids
        .map((id) => lookupDie(String(id)))
        .filter((d): d is GigDie => Boolean(d))
        .map(dieView);

    const gigArea = mapDice(player.gigArea as unknown as string[]);
    const streetCred = gigArea.reduce((sum, d) => sum + d.faceValue, 0);

    return {
      hand: mapZone(player.zones.hand as unknown as string[]),
      field: mapZone(player.zones.field as unknown as string[], { includeAttached: false }),
      eddieCards: mapZone(player.zones.eddieArea as unknown as string[], {
        includeAttached: false,
      }),
      legendArea: mapZone(player.zones.legendArea as unknown as string[], {
        includeAttached: false,
      }),
      trash: trashCards,
      trashTop: trashCards.length > 0 ? trashCards[trashCards.length - 1]! : null,
      fixerArea: mapDice(player.fixerArea as unknown as string[]),
      gigArea,
      deckCount: player.zones.deck.length,
      trashCount: trashCards.length,
      eddies: player.eddies,
      spentEddies: player.spentEddies ?? 0,
      eddieCardCount: player.eddieCardIds.length,
      soldThisTurn: player.soldThisTurn,
      streetCred,
      gigCount: player.gigArea.length,
      activeEffects: playerActiveEffectViews(playerId, matchState),
    };
  }, [matchState.ctx.stateID, side]);
}
