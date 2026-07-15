import type { CardInstanceId, PlayerId } from "#core";
import type {
  CardInput,
  LorcanaDynamicCard,
  LorcanaMatchState,
  LorcanaProjectedCard,
  LorcanaStaticCard,
} from "./types";

export type CardResolutionErrorCode =
  | "CARD_SELECTOR_REQUIRED"
  | "CARD_NOT_FOUND"
  | "CARD_SELECTOR_AMBIGUOUS";

export class CardResolutionError extends Error {
  readonly code: CardResolutionErrorCode;
  readonly candidates?: CardInstanceId[];

  constructor(code: CardResolutionErrorCode, message: string, candidates?: CardInstanceId[]) {
    super(message);
    this.name = "CardResolutionError";
    this.code = code;
    this.candidates = candidates;
  }
}

type ResolveCardInputOptions = {
  input: CardInput | LorcanaStaticCard;
  state: LorcanaMatchState;
  cards: Record<string, LorcanaProjectedCard | undefined>;
  actorPlayerId?: PlayerId;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaStaticCard | undefined;
};

function asCardInstanceId(value: string): CardInstanceId {
  return value as CardInstanceId;
}

function isDynamicCard(value: unknown): value is LorcanaDynamicCard {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as { instanceId?: unknown }).instanceId === "string",
  );
}

function isStaticCard(value: unknown): value is LorcanaStaticCard {
  return Boolean(
    value && typeof value === "object" && typeof (value as { id?: unknown }).id === "string",
  );
}

function getZonePriority(zone: string | undefined): number {
  switch (zone) {
    case "play":
      return 0;
    case "hand":
      return 1;
    case "discard":
      return 2;
    case "inkwell":
      return 3;
    case "deck":
      return 4;
    case "limbo":
      return 5;
    default:
      return Number.MAX_SAFE_INTEGER;
  }
}

function getZoneFromZoneKey(zoneKey: string | undefined): string | undefined {
  if (!zoneKey) {
    return undefined;
  }

  return zoneKey.includes(":") ? zoneKey.split(":", 1)[0] : zoneKey;
}

function getOrderedMatchingCards(
  options: ResolveCardInputOptions,
  definitionId: string,
): CardInstanceId[] {
  const zoneCardIndex = options.state.ctx.zones.private.cardIndex;
  const stateMatches = Object.entries(zoneCardIndex)
    .filter(([, entry]) => Boolean(entry))
    .filter(
      ([instanceId]) =>
        options.getDefinitionByInstanceId(asCardInstanceId(instanceId))?.id === definitionId,
    )
    .sort(([leftInstanceId, leftEntry], [rightInstanceId, rightEntry]) => {
      const leftOwnerMatch = leftEntry?.ownerID === options.actorPlayerId ? 0 : 1;
      const rightOwnerMatch = rightEntry?.ownerID === options.actorPlayerId ? 0 : 1;
      if (leftOwnerMatch !== rightOwnerMatch) {
        return leftOwnerMatch - rightOwnerMatch;
      }

      const leftZonePriority = getZonePriority(getZoneFromZoneKey(leftEntry?.zoneKey));
      const rightZonePriority = getZonePriority(getZoneFromZoneKey(rightEntry?.zoneKey));
      if (leftZonePriority !== rightZonePriority) {
        return leftZonePriority - rightZonePriority;
      }

      const leftIndex =
        typeof leftEntry?.index === "number" ? leftEntry.index : Number.MAX_SAFE_INTEGER;
      const rightIndex =
        typeof rightEntry?.index === "number" ? rightEntry.index : Number.MAX_SAFE_INTEGER;
      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }

      return leftInstanceId.localeCompare(rightInstanceId);
    })
    .map(([instanceId]) => asCardInstanceId(instanceId));

  if (stateMatches.length > 0) {
    return stateMatches;
  }

  return Object.entries(options.cards)
    .filter(([, projectedCard]) => Boolean(projectedCard))
    .filter(
      ([instanceId]) =>
        options.getDefinitionByInstanceId(asCardInstanceId(instanceId))?.id === definitionId,
    )
    .sort(([leftInstanceId, leftCard], [rightInstanceId, rightCard]) => {
      const leftOwnerMatch = leftCard?.ownerId === options.actorPlayerId ? 0 : 1;
      const rightOwnerMatch = rightCard?.ownerId === options.actorPlayerId ? 0 : 1;
      if (leftOwnerMatch !== rightOwnerMatch) {
        return leftOwnerMatch - rightOwnerMatch;
      }

      const leftZonePriority = getZonePriority(leftCard?.zone);
      const rightZonePriority = getZonePriority(rightCard?.zone);
      if (leftZonePriority !== rightZonePriority) {
        return leftZonePriority - rightZonePriority;
      }

      const leftIndex =
        typeof leftCard?.zoneIndex === "number" ? leftCard.zoneIndex : Number.MAX_SAFE_INTEGER;
      const rightIndex =
        typeof rightCard?.zoneIndex === "number" ? rightCard.zoneIndex : Number.MAX_SAFE_INTEGER;
      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }

      return leftInstanceId.localeCompare(rightInstanceId);
    })
    .map(([instanceId]) => asCardInstanceId(instanceId));
}

function resolveFromStaticCard(
  input: LorcanaStaticCard,
  options: ResolveCardInputOptions,
): CardInstanceId {
  const definitionId = input.id;
  const matchingCards = getOrderedMatchingCards(options, definitionId);

  if (matchingCards.length === 0) {
    throw new CardResolutionError(
      "CARD_NOT_FOUND",
      `Static card '${definitionId}' not found in game state.`,
    );
  }

  return matchingCards[0];
}

export function resolveCardInstanceIdFromInput(options: ResolveCardInputOptions): CardInstanceId {
  const { input } = options;

  if (typeof input === "string") {
    return input as CardInstanceId;
  }

  if (isDynamicCard(input)) {
    return input.instanceId as CardInstanceId;
  }

  if (isStaticCard(input)) {
    return resolveFromStaticCard(input, options);
  }

  throw new CardResolutionError("CARD_NOT_FOUND", "Unable to resolve card input.");
}
