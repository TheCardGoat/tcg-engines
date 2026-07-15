import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import type { CardInstance } from "../types/card-instance.ts";
import type { CardType, CardZone, CardClassification, EventTrigger } from "@tcg/cyberpunk-types";
import type { GigDie } from "../types/gig-die.ts";
import { getStreetCred } from "../types/gig-die.ts";
import { getEffectivePower, getEffectiveRules } from "../active-effects/index.ts";
import { buildPlayerPrompt, type PlayerPrompt } from "./player-prompt.ts";
import { defOf } from "../state/lookups.ts";
import { availableEddies } from "../moves/eddie-resources.ts";
import { getAbilityHints, type FilteredAbilityHint } from "./ability-hints.ts";

export interface FilteredCardView {
  instanceId: string;
  definitionId: string;
  /** Printed card name. `null` when the card is face-down to this viewer. */
  cardName: string | null;
  zone: CardZone;
  faceDown: boolean;
  spent: boolean;
  damage: number;
  power: number;
  effectivePower: number;
  /** Printed eddie cost. `null` when the card is face-down to this viewer. */
  cost: number | null;
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
  zones: Record<string, FilteredCardView[] | number>;
  eddies: number;
  availableEddies: number;
  gigCount: number;
  fixerCount: number;
  streetCred: number;
}

export interface FilteredMatchView {
  players: Record<string, FilteredPlayerView>;
  gamePhase: string;
  turnNumber: number;
  activePlayerId: string;
  playedCardTypesThisTurn: Record<string, CardType[]>;
  attackState: {
    attackerId: string | null;
    defenderId: string | null;
    kind: string;
    step: string;
    redirectedByBlocker: boolean;
  } | null;
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

function toCardView(card: CardInstance, state: MatchState): FilteredCardView {
  const def = defOf(card);
  return {
    instanceId: card.instanceId as string,
    definitionId: card.definitionId,
    cardName: def.name,
    zone: card.zone,
    faceDown: card.meta.faceDown,
    spent: card.meta.spent,
    damage: card.meta.damage,
    power: getBasePower(card),
    effectivePower: getEffectivePower(state, card.instanceId as string),
    cost: def.cost ?? null,
    type: def.type,
    classifications: ((def as { classifications?: CardClassification[] }).classifications ??
      []) as CardClassification[],
    hasSellTag: def.hasSellTag === true,
    attachedGearIds: card.meta.attachedGearIds as string[],
    attachedToId: card.meta.attachedToId as string | null,
    hasLag: card.meta.hasLag,
    hasAttackedThisTurn: card.meta.hasAttackedThisTurn,
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
    zone: card.zone,
    faceDown: true,
    spent: false,
    damage: 0,
    power: 0,
    effectivePower: 0,
    cost: null,
    type: null,
    classifications: [],
    hasSellTag: false,
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
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
): FilteredCardView[] {
  return cardIds
    .map((id) => state.G.cardIndex[id as string])
    .filter((c): c is CardInstance => c !== undefined)
    .map((card) => {
      if (zone === "legendArea" && card.meta.faceDown && !isOwner) {
        return toFaceDownCardView(card, state);
      }
      return toCardView(card, state);
    });
}

export function filterMatchView(state: MatchState, playerId: PlayerId): FilteredMatchView {
  const playerViews: Record<string, FilteredPlayerView> = {};

  for (const [pid, playerState] of Object.entries(state.G.players)) {
    const isOwner = pid === (playerId as string);
    const zones: Record<string, FilteredCardView[] | number> = {};

    const zoneList: CardZone[] = ["field", "hand", "deck", "trash", "legendArea", "eddieArea"];

    for (const zone of zoneList) {
      const cardIds = playerState.zones[zone] ?? [];

      if (zone === "deck") {
        zones[zone] = cardIds.length;
      } else if (zone === "hand" && !isOwner) {
        zones[zone] = cardIds.length;
      } else {
        zones[zone] = filterZoneCards(zone, cardIds, state, isOwner);
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
      spent: false,
      damage: 0,
      power: die.faceValue,
      effectivePower: die.faceValue,
      cost: null,
      type: null,
      classifications: [],
      hasSellTag: false,
      attachedGearIds: [],
      attachedToId: null,
      hasLag: false,
      hasAttackedThisTurn: false,
      grantedRules: [],
      keywords: [],
      triggerHints: [],
      abilityHints: [],
    }));

    zones["fixerArea"] = fixerDice.map((die) => ({
      instanceId: die.id as string,
      definitionId: die.dieType,
      cardName: null,
      zone: "fixerArea" as CardZone,
      faceDown: false,
      spent: false,
      damage: 0,
      power: die.faceValue,
      effectivePower: die.faceValue,
      cost: null,
      type: null,
      classifications: [],
      hasSellTag: false,
      attachedGearIds: [],
      attachedToId: null,
      hasLag: false,
      hasAttackedThisTurn: false,
      grantedRules: [],
      keywords: [],
      triggerHints: [],
      abilityHints: [],
    }));

    playerViews[pid] = {
      zones,
      eddies: playerState.eddies,
      availableEddies: availableEddies(state, pid as PlayerId),
      gigCount: gigDice.length,
      fixerCount: fixerDice.length,
      streetCred: getStreetCred(gigDice),
    };
  }

  const attackState = state.G.attackState
    ? {
        attackerId: state.G.attackState.attackerId as string,
        defenderId: state.G.attackState.defenderId as string | null,
        kind: state.G.attackState.kind,
        step: state.G.attackState.step,
        redirectedByBlocker: state.G.attackState.redirectedByBlocker === true,
      }
    : null;

  return {
    players: playerViews,
    gamePhase: state.G.gamePhase,
    turnNumber: state.G.turnMetadata.turnNumber,
    activePlayerId: state.G.turnMetadata.activePlayerId as string,
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
