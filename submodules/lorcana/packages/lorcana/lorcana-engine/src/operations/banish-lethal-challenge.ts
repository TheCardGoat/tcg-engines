import type { CardInstanceId, PlayerId, RuntimeCardWithDefinition } from "#core";
import type { Classification } from "@tcg/lorcana-types";
import type { LorcanaCardDerived } from "../types/projected-board";
import {
  getCharacterIdsAtLocation,
  moveCardOutOfPlayWithStack,
} from "../runtime-moves/state/shift-stack";
import {
  recordBanishedCharacterInChallengeThisTurn,
  recordBanishedCharacterThisTurn,
} from "../runtime-moves/state/turn-metrics";
import { hasTemporaryAbility as hasTempAbility } from "../runtime-moves/effects/temporary-effects";
import { snapshotTriggeredCandidatesForCard } from "../runtime-moves/effects/triggered-abilities";

type LorcanaRuntimeCard = RuntimeCardWithDefinition & LorcanaCardDerived;

type Ctx = Parameters<typeof moveCardOutOfPlayWithStack>[0] &
  Parameters<typeof getCharacterIdsAtLocation>[0] &
  Parameters<typeof recordBanishedCharacterThisTurn>[0] &
  Parameters<typeof snapshotTriggeredCandidatesForCard>[0] & {
    cards: {
      require: (id: CardInstanceId) => RuntimeCardWithDefinition & {
        meta?: Record<string, unknown>;
        ownerID?: string;
      };
    };
    framework: { state: { status: { turn?: number | null } } };
  };

export type LethalChallengeBanishSnapshot = {
  subjectAtLocationId: CardInstanceId | undefined;
  classificationsBeforeBanish: Classification[] | undefined;
  keywordsBeforeBanish: string[] | undefined;
  strengthBeforeBanish: number | undefined;
  cardsUnderCountBeforeBanish: number;
  cardsUnderIdsBeforeBanish: CardInstanceId[];
  triggerCandidates: ReturnType<typeof snapshotTriggeredCandidatesForCard>;
  charactersAtSourceLocationBeforeBanish: CardInstanceId[] | undefined;
  ownerId: PlayerId;
};

/**
 * Captures everything we need to know about a card being banished by lethal
 * challenge damage *before* it leaves play, then performs the move + turn
 * metric records. The caller is responsible for emitting the `cardBanished`
 * event with the desired sub-event shape (which differs between the
 * attacker-lethal and defender-lethal sides — challenged-and-banished only
 * fires for the original defender, etc.).
 *
 * Pass the actor (controller of the lethal-damage source) as `actorPlayerId`
 * — that's what is forwarded to `getKeywordsBeforeBanish` /
 * `getClassificationsBeforeBanish` callbacks supplied by the caller.
 */
export function snapshotAndBanishLethalCombatant(
  ctx: Ctx,
  params: {
    cardId: CardInstanceId;
    actorPlayerId: PlayerId;
    cardType: string | undefined;
    getKeywords: (
      ctx: Ctx,
      cardId: CardInstanceId,
      actorPlayerId: PlayerId,
    ) => string[] | undefined;
    getClassifications: (
      ctx: Ctx,
      cardId: CardInstanceId,
      actorPlayerId: PlayerId,
    ) => Classification[] | undefined;
  },
): LethalChallengeBanishSnapshot {
  const { cardId, actorPlayerId, cardType, getKeywords, getClassifications } = params;
  const meta = ctx.cards.require(cardId).meta ?? {};
  const subjectAtLocationId = meta.atLocationId as CardInstanceId | undefined;
  const classificationsBeforeBanish = getClassifications(ctx, cardId, actorPlayerId);
  const keywordsBeforeBanish = getKeywords(ctx, cardId, actorPlayerId);
  const rawStrength = (ctx.cards.require(cardId) as LorcanaRuntimeCard).strength;
  const strengthBeforeBanish =
    typeof rawStrength === "number" && Number.isFinite(rawStrength) ? rawStrength : undefined;
  const cardsUnder = Array.isArray(meta.cardsUnder) ? meta.cardsUnder : [];
  const cardsUnderCountBeforeBanish = cardsUnder.length;
  const cardsUnderIdsBeforeBanish = [...cardsUnder] as CardInstanceId[];
  const triggerCandidates = snapshotTriggeredCandidatesForCard(ctx, cardId);
  const charactersAtSourceLocationBeforeBanish =
    cardType === "location" ? getCharacterIdsAtLocation(ctx, cardId) : undefined;
  const ownerId = ctx.cards.require(cardId).ownerID as PlayerId;

  const currentTurn = ctx.framework.state.status.turn ?? 1;
  const destinationZone = hasTempAbility(meta, currentTurn, "return-to-hand-when-banished")
    ? "hand"
    : "discard";

  moveCardOutOfPlayWithStack(ctx, cardId, {
    zone: destinationZone,
    playerId: ownerId,
  });

  recordBanishedCharacterThisTurn(ctx, cardId);
  recordBanishedCharacterInChallengeThisTurn(ctx, cardId);

  return {
    subjectAtLocationId,
    classificationsBeforeBanish,
    keywordsBeforeBanish,
    strengthBeforeBanish,
    cardsUnderCountBeforeBanish,
    cardsUnderIdsBeforeBanish,
    triggerCandidates,
    charactersAtSourceLocationBeforeBanish,
    ownerId,
  };
}
