import type { AttackState, MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import type { CardInstance } from "../types/card-instance.ts";
import type {
  CardType,
  CardZone,
  CardClassification,
  CardColor,
  EventTrigger,
} from "@tcg/cyberpunk-types";
import type { GigDie } from "../types/gig-die.ts";
import { getStreetCred } from "../types/gig-die.ts";
import { getEffectivePower, getEffectiveRules } from "../active-effects/index.ts";
import { buildPlayerPrompt, type PlayerPrompt } from "./player-prompt.ts";
import { defOf } from "../state/lookups.ts";
import { availableEddies } from "../moves/eddie-resources.ts";
import { computeEffectiveCostDetails } from "../moves/compute-effective-cost.ts";
import { getAbilityHints, type FilteredAbilityHint } from "./ability-hints.ts";

/** Presentation only. Never rehydrate these as executable effects. */
export interface FilteredEffectView {
  id: string;
  sourceCardId?: string;
  sourceName: string;
  label: string;
  detail: string;
  modifierLabel?: string;
  effectKind: string;
  rule?: string;
  tone: "buff" | "debuff" | "neutral";
  durationLabel?: string;
  isTemporary?: boolean;
  defeatsAtEndOfTurn: boolean;
  defeatIfAttacksAtEndOfTurn?: boolean;
}

export interface FilteredCardView {
  instanceId: string;
  definitionId: string;
  /** Printed card name. `null` when the card is face-down to this viewer. */
  cardName: string | null;
  /** Printed color of a known card. Absent on synthetic views; hidden cards have no color. */
  color?: CardColor | null;
  zone: CardZone | "fixerArea";
  faceDown: boolean;
  /** Online UX: identity is shown this turn despite faceDown. */
  revealed?: boolean;
  spent: boolean;
  damage: number;
  power: number;
  effectivePower: number;
  /** Printed eddie cost. `null` when the card is face-down to this viewer. */
  cost: number | null;
  effectiveCost: number | null;
  costEffects: FilteredEffectView[];
  activeEffects: FilteredEffectView[];
  /** Card type. `null` when the card is face-down to this viewer. */
  type: CardType | null;
  /** Faction/sub-type tags (e.g. "Netrunner", "Cyberware"). Empty when face-down. */
  classifications: CardClassification[];
  /** True when the card carries the Sell Tag (`€$`). False when face-down. */
  hasSellTag: boolean;
  attachedGearIds: string[];
  attachedToId: string | null;
  hasLag: boolean;
  hasAttackedThisTurn: boolean;
  hasStolenGigThisTurn: boolean;
  grantedRules: string[];
  keywords: string[];
  /**
   * Public timing/event hooks present on this visible card. This intentionally
   * exposes only coarse trigger names, not effect payloads or hidden card text.
   */
  triggerHints: string[];
  /** Coarse ability semantics derived only for cards visible to this player. */
  abilityHints: FilteredAbilityHint[];
}

export interface FilteredPlayerView {
  /** Present only for this viewer's own seat. */
  combatPriority?: "automatic" | "hold";
  firstPlayer: boolean;
  zones: Record<string, FilteredCardView[] | number>;
  eddies: number;
  availableEddies: number;
  soldThisTurn: boolean;
  calledLegendThisTurn: boolean;
  calledLegendThisRivalTurn: boolean;
  gigCount: number;
  fixerCount: number;
  streetCred: number;
  activeEffects: FilteredEffectView[];
}

export interface FilteredMatchView {
  players: Record<string, FilteredPlayerView>;
  gamePhase: string;
  turnNumber: number;
  activePlayerId: string;
  overtimeActive: boolean;
  previousTurnBeganWithEmptyFixer: boolean;
  turnBeganWithEmptyFixer: boolean;
  playedCardTypesThisTurn: Record<string, CardType[]>;
  attackState: AttackState | null;
  gameEnded: boolean;
  winnerId: string | null;
  winReason: string | null;
  stateID: number;
  prompt: PlayerPrompt;
}

function getBasePower(card: CardInstance): number {
  return defOf(card).power ?? 0;
}

function triggerHintForEvent(event: EventTrigger["event"]): string {
  return event.event;
}

function getTriggerHints(def: ReturnType<typeof defOf>): string[] {
  const hints = new Set<string>();
  for (const trigger of def.timingTriggers ?? []) {
    hints.add(trigger);
  }
  for (const ability of def.abilities) {
    const trigger = ability.trigger;
    if (!trigger) continue;
    if (trigger.trigger === "event") hints.add(triggerHintForEvent(trigger.event));
    else hints.add(trigger.trigger);
  }
  return [...hints].sort();
}

function sourceForViewer(
  state: MatchState,
  sourceId: string,
  viewerId?: PlayerId,
): { sourceCardId?: string; sourceName: string } {
  const source = state.G.cardIndex[sourceId];
  if (!source) return { sourceName: "Effect" };
  // Hand and face-down identities are available only to their controller.
  // The deck remains hidden even from its owner.
  const publicSource =
    ["field", "legendArea", "trash", "removedFromGame"].includes(source.zone) &&
    !source.meta.faceDown;
  const ownKnownSource =
    viewerId !== undefined && source.controllerId === viewerId && source.zone !== "deck";
  if (!publicSource && !ownKnownSource && !source.meta.revealed) {
    return { sourceName: "Effect" };
  }
  const definition = defOf(source);
  return { sourceCardId: sourceId, sourceName: definition.displayName ?? definition.name };
}

function durationLabel(duration: "turn" | "continuous" | "untilSourceNextTurn"): string {
  if (duration === "turn") return "this turn";
  if (duration === "untilSourceNextTurn") return "until source's next turn";
  return "while active";
}

function delayedDefeat(state: MatchState, sourceId: string, targetId: string): boolean {
  return state.G.effectBag.some(
    (entry) =>
      String(entry.sourceCardId) === sourceId &&
      (entry.delayedEffects ?? []).some((effect) => effect.effect === "defeat") &&
      Object.values(entry.resolvedBindings ?? {}).some((ids) => ids.includes(targetId)),
  );
}

function projectEffect(
  state: MatchState,
  effect: MatchState["G"]["activeEffects"][number],
  index: number,
  targetId: string,
  viewerId?: PlayerId,
): FilteredEffectView {
  const source = sourceForViewer(state, String(effect.sourceCardId), viewerId);
  const duration = durationLabel(effect.duration);
  const conditionalDefeat = effect.kind === "defeatAtEndOfTurnIfAttacked";
  const defeatsAtEndOfTurn =
    delayedDefeat(state, String(effect.sourceCardId), targetId) ||
    (conditionalDefeat && effect.triggered === true);
  const base = {
    id: source.sourceCardId ? effect.id : `${targetId}:effect:${index}`,
    ...source,
    effectKind: effect.kind,
    durationLabel: duration,
    isTemporary: effect.origin !== "static" && effect.duration !== "continuous",
    defeatsAtEndOfTurn,
    defeatIfAttacksAtEndOfTurn: conditionalDefeat && effect.triggered !== true,
  };
  if (effect.kind === "powerModifier") {
    const amount = effect.powerModifier ?? 0;
    const modifierLabel = amount > 0 ? `+${amount}` : `${amount}`;
    return {
      ...base,
      label: `${modifierLabel} PWR`,
      detail: `${source.sourceName}: ${modifierLabel} power ${duration}.`,
      modifierLabel,
      tone: amount >= 0 ? "buff" : "debuff",
    };
  }
  if (effect.kind === "powerMultiplier") {
    const multiplier = effect.powerMultiplier ?? 1;
    return {
      ...base,
      label: `x${multiplier} PWR`,
      detail: `${source.sourceName}: power x${multiplier} ${duration}.`,
      modifierLabel: `x${multiplier}`,
      tone: multiplier >= 1 ? "buff" : "debuff",
    };
  }
  if (conditionalDefeat) {
    return {
      ...base,
      label: effect.triggered ? "End defeat" : "Attack risk",
      detail: effect.triggered
        ? `${source.sourceName}: defeated at end of turn.`
        : `${source.sourceName}: if this Unit steals or fights, defeat it at end of turn.`,
      tone: "debuff",
    };
  }
  const label = (effect.rule ?? effect.kind)
    .replace(/[A-Z]/g, (letter) => ` ${letter}`)
    .trim()
    .toUpperCase();
  return {
    ...base,
    label,
    detail:
      effect.rule === "mustAttack"
        ? `Must attack next turn if able. Source: ${source.sourceName}.`
        : `${source.sourceName}: ${label} ${duration}.`,
    rule: effect.rule,
    tone: effect.rule === "cantAttack" || effect.rule === "mustAttack" ? "debuff" : "neutral",
  };
}

function cardEffectViews(
  card: CardInstance,
  state: MatchState,
  viewerId?: PlayerId,
): FilteredEffectView[] {
  const targetId = String(card.instanceId);
  const effects = state.G.activeEffects
    .filter((effect) => effect.playerId === undefined && String(effect.targetCardId) === targetId)
    .map((effect, index) => projectEffect(state, effect, index, targetId, viewerId));
  const coveredSources = new Set(
    effects.filter((effect) => effect.defeatsAtEndOfTurn).map((effect) => effect.sourceCardId),
  );
  const delayed = state.G.effectBag.flatMap((entry, index): FilteredEffectView[] => {
    if (
      !(entry.delayedEffects ?? []).some((effect) => effect.effect === "defeat") ||
      !Object.values(entry.resolvedBindings ?? {}).some((ids) => ids.includes(targetId))
    )
      return [];
    const source = sourceForViewer(state, String(entry.sourceCardId), viewerId);
    if (source.sourceCardId && coveredSources.has(source.sourceCardId)) return [];
    return [
      {
        id: source.sourceCardId ? entry.id : `${targetId}:delayed:${index}`,
        ...source,
        label: "End defeat",
        detail: `${source.sourceName}: defeated at end of turn.`,
        effectKind: "delayedDefeat",
        tone: "debuff",
        durationLabel: "end of turn",
        isTemporary: true,
        defeatsAtEndOfTurn: true,
      },
    ];
  });
  return [...effects, ...delayed];
}

function toCardView(card: CardInstance, state: MatchState, viewerId?: PlayerId): FilteredCardView {
  const def = defOf(card);
  const cost =
    def.cost == null
      ? null
      : computeEffectiveCostDetails(state, card.instanceId, card.controllerId);
  return {
    instanceId: card.instanceId as string,
    definitionId: card.definitionId,
    cardName: def.name,
    color: def.color,
    zone: card.zone,
    faceDown: card.meta.faceDown,
    revealed: card.meta.revealed === true,
    spent: card.meta.spent,
    damage: card.meta.damage,
    power: getBasePower(card),
    effectivePower: getEffectivePower(state, card.instanceId as string),
    cost: def.cost ?? null,
    effectiveCost: cost?.effectiveCost ?? null,
    costEffects: (cost?.modifiers ?? []).map((modifier, index) => {
      const source = sourceForViewer(state, String(modifier.sourceCardId), viewerId);
      return {
        id: source.sourceCardId ? modifier.id : `${card.instanceId}:cost:${index}`,
        ...source,
        label: modifier.label,
        detail: source.sourceCardId
          ? modifier.detail
          : `${source.sourceName}: ${modifier.label} while active.`,
        modifierLabel: modifier.modifierLabel,
        effectKind: "costModifier",
        tone: modifier.delta <= 0 ? "buff" : "debuff",
        durationLabel: "while active",
        defeatsAtEndOfTurn: false,
      };
    }),
    activeEffects: cardEffectViews(card, state, viewerId),
    type: def.type,
    classifications: ((def as { classifications?: CardClassification[] }).classifications ??
      []) as CardClassification[],
    hasSellTag: def.hasSellTag === true,
    attachedGearIds: card.meta.attachedGearIds as string[],
    attachedToId: card.meta.attachedToId as string | null,
    hasLag: card.meta.hasLag,
    hasAttackedThisTurn: card.meta.hasAttackedThisTurn,
    hasStolenGigThisTurn: card.meta.hasStolenGigThisTurn,
    grantedRules: getEffectiveRules(state, card.instanceId as string) as string[],
    keywords: def.keywords ?? [],
    triggerHints: getTriggerHints(def),
    abilityHints: card.meta.faceDown ? [] : getAbilityHints(def),
  };
}

function toFaceDownCardView(card: CardInstance, _state: MatchState): FilteredCardView {
  return {
    instanceId: card.instanceId as string,
    definitionId: "",
    cardName: null,
    color: null,
    zone: card.zone,
    faceDown: true,
    revealed: false,
    // Orientation is public board state even when the card's identity is not.
    // Preserve it so face-down Eddies and rival Legends render ready/spent
    // without exposing any hidden card information.
    spent: card.meta.spent,
    damage: 0,
    power: 0,
    effectivePower: 0,
    cost: null,
    effectiveCost: null,
    costEffects: [],
    activeEffects: [],
    type: null,
    classifications: [],
    hasSellTag: false,
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
    hasStolenGigThisTurn: false,
    grantedRules: [],
    keywords: [],
    triggerHints: [],
    abilityHints: [],
  };
}

/**
 * Project a single card by id into the full face-up view shape, **bypassing
 * any face-down / opponent-zone redaction**. The caller MUST have already
 * verified that the card is visible to the viewing player (e.g. it was just
 * revealed by a `searchDeck` effect, or is on the player's own field).
 *
 * If you don't know whether the card is visible, use `filterMatchView`
 * which applies zone-aware redaction. Misuse here would leak hidden info
 * across the player boundary.
 *
 * Returns `null` when the id isn't in the index.
 */
export function projectRevealedCardView(
  state: MatchState,
  cardId: string,
): FilteredCardView | null {
  const card = state.G.cardIndex[cardId];
  if (!card) return null;
  return toCardView(card, state);
}

function filterZoneCards(
  zone: CardZone,
  cardIds: readonly string[],
  state: MatchState,
  isOwner: boolean,
  viewerId: PlayerId,
): FilteredCardView[] {
  return cardIds
    .map((id) => state.G.cardIndex[id as string])
    .filter((c): c is CardInstance => c !== undefined)
    .map((card) => {
      if (card.meta.revealed) return toCardView(card, state, viewerId);
      if (zone === "legendArea" && card.meta.faceDown && !isOwner) {
        return toFaceDownCardView(card, state);
      }
      if (zone === "eddieArea" && card.meta.faceDown) {
        return toFaceDownCardView(card, state);
      }
      return toCardView(card, state, viewerId);
    });
}

export function filterMatchView(state: MatchState, playerId: PlayerId): FilteredMatchView {
  return projectMatchView(state, playerId, false);
}

/** Full-information practice AI only. Never use for a player/network view. */
export function oracleMatchView(state: MatchState, playerId: PlayerId): FilteredMatchView {
  return projectMatchView(state, playerId, true);
}

function projectMatchView(
  state: MatchState,
  playerId: PlayerId,
  oracle: boolean,
): FilteredMatchView {
  const playerViews: Record<string, FilteredPlayerView> = {};

  for (const [pid, playerState] of Object.entries(state.G.players)) {
    const isOwner = pid === (playerId as string);
    const zones: Record<string, FilteredCardView[] | number> = {};

    const zoneList: CardZone[] = [
      "field",
      "hand",
      "deck",
      "trash",
      "legendArea",
      "eddieArea",
      "removedFromGame",
    ];

    for (const zone of zoneList) {
      const cardIds = playerState.zones[zone] ?? [];

      if (oracle) {
        zones[zone] = cardIds
          .map((id) => state.G.cardIndex[id])
          .filter((card): card is CardInstance => card !== undefined)
          .map((card) => toCardView(card, state, playerId));
      } else if (zone === "deck") {
        zones[zone] = cardIds.length;
      } else if (zone === "hand" && !isOwner) {
        zones[zone] = cardIds.length;
      } else {
        zones[zone] = filterZoneCards(zone, cardIds, state, isOwner, playerId);
      }
    }

    const gigDice = (playerState.gigArea ?? [])
      .map((id) => state.G.gigDice[id as string])
      .filter((d): d is GigDie => d !== undefined);
    const fixerDice = (playerState.fixerArea ?? [])
      .map((id) => state.G.gigDice[id as string])
      .filter((d): d is GigDie => d !== undefined);

    zones["gigArea"] = gigDice.map((die) => ({
      instanceId: die.id as string,
      definitionId: die.dieType,
      cardName: null,
      zone: "gigArea" as CardZone,
      faceDown: false,
      revealed: false,
      spent: false,
      damage: 0,
      power: die.faceValue,
      effectivePower: die.faceValue,
      cost: null,
      effectiveCost: null,
      costEffects: [],
      activeEffects: [],
      type: null,
      classifications: [],
      hasSellTag: false,
      attachedGearIds: [],
      attachedToId: null,
      hasLag: false,
      hasAttackedThisTurn: false,
      hasStolenGigThisTurn: false,
      grantedRules: [],
      keywords: [],
      triggerHints: [],
      abilityHints: [],
    }));

    zones["fixerArea"] = fixerDice.map((die) => ({
      instanceId: die.id as string,
      definitionId: die.dieType,
      cardName: null,
      zone: "fixerArea",
      faceDown: false,
      revealed: false,
      spent: false,
      damage: 0,
      power: die.faceValue,
      effectivePower: die.faceValue,
      cost: null,
      effectiveCost: null,
      costEffects: [],
      activeEffects: [],
      type: null,
      classifications: [],
      hasSellTag: false,
      attachedGearIds: [],
      attachedToId: null,
      hasLag: false,
      hasAttackedThisTurn: false,
      hasStolenGigThisTurn: false,
      grantedRules: [],
      keywords: [],
      triggerHints: [],
      abilityHints: [],
    }));

    playerViews[pid] = {
      zones,
      firstPlayer: playerState.firstPlayer,
      eddies: playerState.eddies,
      availableEddies: availableEddies(state, pid as PlayerId),
      soldThisTurn: playerState.soldThisTurn,
      calledLegendThisTurn: playerState.calledLegendThisTurn,
      calledLegendThisRivalTurn: playerState.calledLegendThisRivalTurn,
      ...(isOwner ? { combatPriority: playerState.combatPriority } : {}),
      gigCount: gigDice.length,
      fixerCount: fixerDice.length,
      streetCred: getStreetCred(gigDice),
      activeEffects: state.G.activeEffects
        .filter((effect) => effect.playerId !== undefined && String(effect.playerId) === pid)
        .map((effect, index) => projectEffect(state, effect, index, pid, playerId)),
    };
  }

  const attackState = state.G.attackState ? structuredClone(state.G.attackState) : null;

  return {
    players: playerViews,
    gamePhase: state.G.gamePhase,
    turnNumber: state.G.turnMetadata.turnNumber,
    activePlayerId: state.G.turnMetadata.activePlayerId as string,
    overtimeActive: state.G.overtime,
    previousTurnBeganWithEmptyFixer: state.G.turnMetadata.previousTurnBeganWithEmptyFixer,
    turnBeganWithEmptyFixer: state.G.turnMetadata.turnBeganWithEmptyFixer,
    playedCardTypesThisTurn: Object.fromEntries(
      Object.entries(state.G.turnMetadata.playedCardTypesThisTurn).map(([pid, types]) => [
        pid,
        [...(types ?? [])],
      ]),
    ),
    attackState,
    gameEnded: state.G.gameEnded,
    winnerId: state.G.winnerId as string | null,
    winReason: state.G.winReason,
    stateID: state.ctx.stateID,
    prompt: buildPlayerPrompt(state, playerId),
  };
}
