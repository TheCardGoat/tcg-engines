import type { Ability } from "@tcg/cyberpunk-types";
import type { MatchState } from "../types/match-state.ts";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { GameEvent } from "../types/game-events.ts";
import { defOf } from "../state/lookups.ts";

export interface TriggerMatch {
  cardId: CardInstanceId;
  playerId: PlayerId;
  ability: Ability;
  abilityIndex: number;
}

/**
 * Maps engine GameEvent types to the DSL event names used in card ability triggers.
 *
 * Engine events and card-DSL event names are deliberately different vocabularies:
 * engine events describe what happened mechanically (e.g. `attackDeclared`) while
 * DSL names describe the game concept a card author writes (e.g. `cardAttacks`).
 * Entries are only needed where the two names differ; absent keys fall back to
 * the engine event type name itself.
 */
export const EVENT_TYPE_TO_DSL: Partial<Record<GameEvent["type"], string>> = {
  attackDeclared: "cardAttacks",
  attackResolved: "fightResolved",
};

export function matchTriggers(event: GameEvent, state: MatchState): TriggerMatch[] {
  const matches: TriggerMatch[] = [];

  // ── Targeted triggers ──────────────────────────────────────────────────────
  // Each case handles a trigger kind that is inherently tied to one specific
  // card (the card that was played, flipped, called, defeated, or is attacking).
  // Non-event trigger kinds ("play", "attack", "flip", "call", "defeated") are
  // only meaningful on that one card, so we check only that card.
  switch (event.type) {
    case "cardPlayed":
      checkCardAbilities(
        state,
        event.cardId,
        (ability) => ability.trigger?.trigger === "play",
        matches,
      );
      break;

    case "attackDeclared":
      // "attack" trigger kind belongs to the attacker only.
      // "cardAttacks" event triggers (including the attacker's own) are handled
      // by the broadcast pass below, which scans all cards.
      checkCardAbilities(
        state,
        event.attackerId,
        (ability) => ability.trigger?.trigger === "attack",
        matches,
      );
      break;

    case "legendFlipped":
      checkCardAbilities(
        state,
        event.cardId,
        (ability) => ability.trigger?.trigger === "flip",
        matches,
      );
      break;

    case "legendCalled":
      checkCardAbilities(
        state,
        event.cardId,
        (ability) => ability.trigger?.trigger === "call",
        matches,
      );
      break;

    case "cardDefeated":
      checkCardAbilities(
        state,
        event.cardId,
        (ability) => ability.trigger?.trigger === "defeated",
        matches,
      );
      break;

    default:
      break;
  }

  // ── Broadcast triggers ─────────────────────────────────────────────────────
  // Event-typed triggers (`trigger.trigger === "event"`) can live on any card
  // in any active zone and fire whenever the matching DSL event occurs — they
  // are not tied to a particular card the way "play" or "flip" triggers are.
  // One generic pass covers every such trigger: new card abilities or new event
  // types are automatically picked up without touching this function.
  const alreadyMatched = new Set(matches.map((m) => `${m.cardId as string}:${m.abilityIndex}`));

  const dslName = EVENT_TYPE_TO_DSL[event.type] ?? event.type;
  const broadcastMatches: TriggerMatch[] = [];
  collectFromAllCards(
    state,
    (ability) => {
      if (!ability.trigger || ability.trigger.trigger !== "event") return false;
      return ability.trigger.event.event === dslName;
    },
    broadcastMatches,
  );

  for (const m of broadcastMatches) {
    const key = `${m.cardId as string}:${m.abilityIndex}`;
    if (!alreadyMatched.has(key)) {
      alreadyMatched.add(key);
      matches.push(m);
    }
  }

  return matches;
}

function checkCardAbilities(
  state: MatchState,
  cardId: CardInstanceId,
  predicate: (ability: Ability) => boolean,
  matches: TriggerMatch[],
): void {
  const card = state.G.cardIndex[cardId as string];
  if (!card) return;

  const def = defOf(card) as import("@tcg/cyberpunk-types").StructuredCardDefinition;
  const abilities: Ability[] = def?.abilities ?? [];

  for (let i = 0; i < abilities.length; i++) {
    if (predicate(abilities[i]!)) {
      matches.push({
        cardId: card.instanceId,
        playerId: card.controllerId,
        ability: abilities[i]!,
        abilityIndex: i,
      });
    }
  }

  // Also check abilities on attached gear with source: { selector: "host" }
  for (const gearId of card.meta.attachedGearIds) {
    const gearCard = state.G.cardIndex[gearId as string];
    if (!gearCard || (gearCard.meta.attachedToId as string) !== (cardId as string)) continue;
    const gearDef = defOf(gearCard) as import("@tcg/cyberpunk-types").StructuredCardDefinition;
    const gearAbilities: Ability[] = gearDef?.abilities ?? [];
    for (let i = 0; i < gearAbilities.length; i++) {
      const ability = gearAbilities[i]!;
      if (ability.source?.selector === "host" && predicate(ability)) {
        matches.push({
          cardId: gearCard.instanceId,
          playerId: gearCard.controllerId,
          ability,
          abilityIndex: i,
        });
      }
    }
  }

  const grantedRules = state.G.activeEffects
    .filter(
      (e): e is typeof e & { rule: NonNullable<typeof e.rule> } =>
        (e.targetCardId as string) === (cardId as string) &&
        e.kind === "grantRule" &&
        e.rule !== undefined,
    )
    .map((e) => e.rule);
  for (let i = 0; i < grantedRules.length; i++) {
    const rule = grantedRules[i]!;
    const ability: Ability = {
      kind: "keyword",
      text: rule,
      keyword: rule as import("@tcg/cyberpunk-types").CardKeyword,
      effects: [],
    };
    if (predicate(ability)) {
      matches.push({
        cardId: card.instanceId,
        playerId: card.controllerId,
        ability,
        abilityIndex: abilities.length + i,
      });
    }
  }
}

function collectFromAllCards(
  state: MatchState,
  predicate: (ability: Ability) => boolean,
  matches: TriggerMatch[],
): void {
  // Only scan active zones — cards in hand, deck, or trash are not in play and
  // must not have their event triggers fire.
  for (const player of Object.values(state.G.players)) {
    if (!player) continue;
    for (const zone of ["field", "legendArea"] as const) {
      for (const cardId of player.zones[zone] ?? []) {
        const card = state.G.cardIndex[cardId as string];
        if (!card) continue;
        // Face-down legends have not yet been called — their triggered abilities are inactive.
        // This mirrors the face-down guard in recomputeActiveEffects.
        if (defOf(card).type === "legend" && card.meta.faceDown) continue;

        checkCardAbilities(state, card.instanceId, predicate, matches);
      }
    }

    // Also scan hand for programs with event triggers that include payCardCost — these
    // can be played from hand in response to events (e.g. Cyberpsychosis).
    for (const cardId of player.zones.hand ?? []) {
      const card = state.G.cardIndex[cardId as string];
      if (!card) continue;
      const def = defOf(card) as import("@tcg/cyberpunk-types").StructuredCardDefinition;
      if (def.type !== "program") continue;
      const hasPayCardCostTrigger = def.abilities?.some(
        (a) =>
          a.kind === "triggered" &&
          a.trigger?.trigger === "event" &&
          a.costs?.some((c) => c.cost === "payCardCost"),
      );
      if (!hasPayCardCostTrigger) continue;
      checkCardAbilities(state, card.instanceId, predicate, matches);
    }
  }
}
