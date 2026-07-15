import type { SwuComparison, SwuController, SwuTarget } from "@tcg/star-wars-unlimited-types";
import { effectiveTraits, getDefinition, opponentOf } from "./state.ts";
import type { MatchState, PlayerId, RuntimeCard } from "./types.ts";

export interface ResolutionContext {
  readonly state: MatchState;
  readonly playerId: PlayerId;
  readonly sourceId: string;
  readonly choices?: Readonly<Record<string, string>>;
}

function compare(value: number, comparison?: SwuComparison): boolean {
  if (!comparison) return true;
  switch (comparison.operator) {
    case "eq":
      return value === comparison.value;
    case "gt":
      return value > comparison.value;
    case "gte":
      return value >= comparison.value;
    case "lt":
      return value < comparison.value;
    case "lte":
      return value <= comparison.value;
  }
}

function controllerMatches(
  card: RuntimeCard,
  controller: SwuController | undefined,
  playerId: PlayerId,
): boolean {
  if (!controller || controller === "any") return true;
  if (controller === "friendly") return card.controller === playerId;
  return card.controller === opponentOf(playerId);
}

function hasTrait(state: MatchState, card: RuntimeCard, trait: string): boolean {
  return effectiveTraits(state, card).some(
    (candidate) => candidate.toLowerCase() === trait.toLowerCase(),
  );
}

export function resolveTarget(target: SwuTarget, context: ResolutionContext): RuntimeCard[] {
  const { state, playerId, sourceId } = context;
  switch (target.type) {
    case "attachedUnit": {
      const source = state.cards[sourceId];
      if (!source) return [];
      return Object.values(state.cards).filter((card) => card.upgrades.includes(source.instanceId));
    }
    case "base":
      return Object.values(state.cards).filter((card) => {
        const definition = getDefinition(state, card.instanceId);
        return (
          definition.cardType === "base" && controllerMatches(card, target.controller, playerId)
        );
      });
    case "card": {
      const matches = Object.values(state.cards)
        .filter((card) => controllerMatches(card, target.controller, playerId))
        .filter((card) => !target.excludeSelf || card.instanceId !== sourceId)
        .filter((card) => !target.zones || target.zones.includes(card.zone))
        .filter((card) => card.exhausted === (target.exhausted ?? card.exhausted))
        .filter((card) =>
          target.damaged === undefined
            ? true
            : target.damaged
              ? card.damage > 0
              : card.damage === 0,
        )
        .filter((card) => {
          const definition = getDefinition(state, card.instanceId);
          return (
            (!target.ids || target.ids.includes(definition.id)) &&
            (!target.cardTypes || target.cardTypes.includes(definition.cardType)) &&
            (!target.aspects ||
              target.aspects.some((aspect) => definition.aspects?.includes(aspect))) &&
            (!target.arena || definition.arena === target.arena) &&
            (!target.traits || target.traits.some((trait) => hasTrait(state, card, trait))) &&
            (!target.withoutTraits ||
              target.withoutTraits.every((trait) => !hasTrait(state, card, trait))) &&
            (!target.keywords ||
              target.keywords.some((keyword) => card.keywords.includes(keyword))) &&
            (target.unique === undefined || definition.unique === target.unique) &&
            compare(definition.cost ?? 0, target.cost) &&
            compare(
              (definition.power ?? 0) + card.experience + card.temporaryPower,
              target.power,
            ) &&
            compare((definition.hp ?? 0) + card.experience + card.temporaryHp, target.hp)
          );
        });
      return target.limit === undefined ? matches : matches.slice(0, target.limit);
    }
    case "choice": {
      const instanceId = context.choices?.[target.id];
      const card = instanceId && state.cards[instanceId] ? state.cards[instanceId] : undefined;
      if (!card) return [];
      const definition = getDefinition(state, card.instanceId);
      if (!controllerMatches(card, target.controller, playerId)) return [];
      if (target.zones && !target.zones.includes(card.zone)) return [];
      if (target.ids && !target.ids.includes(definition.id)) return [];
      if (target.cardTypes && !target.cardTypes.includes(definition.cardType)) return [];
      if (target.traits && !target.traits.some((trait) => hasTrait(state, card, trait))) {
        return [];
      }
      if (target.keywords && !target.keywords.some((keyword) => card.keywords.includes(keyword))) {
        return [];
      }
      return [card];
    }
    case "player":
      return [];
    case "self": {
      const card = state.cards[sourceId];
      return card ? [card] : [];
    }
  }
}
