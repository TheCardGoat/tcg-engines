// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-topic/turn-actions.md

import type { CardInstanceId, PlayerId, RuntimeValidationResult } from "#core";
import type { CardFilter, LorcanaCard } from "@tcg/lorcana-types";
import { getMoveCost, isCharacter, isLocation } from "../../../card-utils";
import {
  createLorcanaLogProjection,
  type Classification,
  type LorcanaMoveDefinition,
} from "../../../types";
import {
  getCardDefinition,
  hasAnyPendingEffects,
  validateNoPendingEffects,
} from "../../../operations";
import { getAvailableInk, spendInk } from "../../rules/play-card-rules";
import {
  emitTriggeredLorcanaEvent,
  flushTriggeredEventsToBag,
} from "../../effects/triggered-abilities";
import {
  evaluateStaticCondition,
  hasStaticCardRestriction,
  hasStaticSelfRestriction,
} from "../../rules/static-ability-utils";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";

type MoveExecutionContext = Parameters<
  LorcanaMoveDefinition<"moveCharacterToLocation">["execute"]
>[0];
type MoveValidationContext = Parameters<
  NonNullable<LorcanaMoveDefinition<"moveCharacterToLocation">["validate"]>
>[0];
type MoveEnumerationContext = Parameters<
  NonNullable<LorcanaMoveDefinition<"moveCharacterToLocation">["available"]>
>[0];
type MoveReadableContext = Pick<
  MoveExecutionContext | MoveValidationContext | MoveEnumerationContext,
  "framework" | "cards" | "G"
>;

type StaticMoveCostReductionEffect = {
  type: "move-cost-reduction";
  location?: "here";
  reduction?: number | "free";
  filter?: {
    name?: string;
    classification?: Classification;
  };
  /**
   * Richer filter list evaluated in addition to `filter`.
   *
   * Currently supports the `exerted` status filter so locations like
   * Ring of Stones - Place of Legends can express "Your exerted characters
   * can move here for free". Other filter variants are ignored until they are
   * needed by a printed card.
   */
  filters?: readonly CardFilter[];
  /** When "SELF", reduction only applies when the source card itself is the moving character */
  target?: "SELF";
};

function getCardOwnerId(ctx: MoveReadableContext, cardId: CardInstanceId): PlayerId | undefined {
  return ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined;
}

function getCurrentPlayerId(ctx: MoveReadableContext): PlayerId | undefined {
  return ctx.framework.state.currentPlayer;
}

function isCharacterExerted(ctx: MoveReadableContext, characterId: CardInstanceId): boolean {
  const card = ctx.cards.get(characterId);
  return card?.meta?.state === "exerted";
}

/**
 * Evaluates the subset of `CardFilter` variants supported by
 * `move-cost-reduction`. Only the filters required by printed cards today
 * are considered; anything else is treated as a non-match so unrecognised
 * filters don't silently grant free moves.
 */
function matchesMoveCostReductionFilters(
  ctx: MoveReadableContext,
  filters: readonly CardFilter[],
  characterId: CardInstanceId,
  characterDefinition: LorcanaCard | undefined,
): boolean {
  for (const filter of filters) {
    if (filter.type === "exerted") {
      if (!isCharacterExerted(ctx, characterId)) {
        return false;
      }
      continue;
    }

    if (filter.type === "classification") {
      const classifications: readonly string[] =
        characterDefinition && characterDefinition.cardType === "character"
          ? (characterDefinition.classifications ?? [])
          : [];
      if (!classifications.includes(filter.classification)) {
        return false;
      }
      continue;
    }

    if (filter.type === "name" && "equals" in filter) {
      if (characterDefinition?.name !== filter.equals) {
        return false;
      }
      continue;
    }

    // Unsupported filter variant: be conservative and treat the
    // reduction as inapplicable rather than silently enabling it.
    return false;
  }

  return true;
}

function getStaticMoveCostReduction(
  ctx: MoveReadableContext,
  characterId: CardInstanceId,
  locationId: CardInstanceId,
  currentPlayer: PlayerId,
): number {
  const characterDefinition = getCardDefinition(ctx, characterId);
  let reduction = 0;

  const playCards = ctx.framework.zones.getCards({
    zone: "play",
    playerId: currentPlayer,
  }) as CardInstanceId[];
  for (const sourceId of playCards) {
    const sourceDefinition = getCardDefinition(ctx, sourceId);
    if (!sourceDefinition) {
      continue;
    }

    for (const ability of sourceDefinition.abilities ?? []) {
      if (ability.type !== "static" || ability.effect?.type !== "move-cost-reduction") {
        continue;
      }

      const effect = ability.effect as StaticMoveCostReductionEffect;
      // "here" means this card's location; undefined on a non-location card means any location
      const sourceCardType = sourceDefinition.cardType;
      if (effect.location === "here") {
        if (sourceId !== locationId) {
          continue;
        }
      } else if (effect.location === undefined && sourceCardType === "location") {
        // Location card with no explicit location: treat as "here"
        if (sourceId !== locationId) {
          continue;
        }
      }
      // effect.location === undefined on a non-location card: applies to all locations (no filter)

      if (
        !evaluateStaticCondition({
          condition: ability.condition,
          state: ctx.framework.state,
          controllerId: currentPlayer,
          sourceId,
          getDefinitionByInstanceId: (instanceId) => getCardDefinition(ctx, instanceId),
        })
      ) {
        continue;
      }

      if (effect.filter?.name && characterDefinition?.name !== effect.filter.name) {
        continue;
      }

      if (
        effect.filter?.classification &&
        (!characterDefinition ||
          characterDefinition.cardType !== "character" ||
          !(characterDefinition.classifications ?? []).includes(effect.filter.classification))
      ) {
        continue;
      }

      if (
        effect.filters &&
        !matchesMoveCostReductionFilters(ctx, effect.filters, characterId, characterDefinition)
      ) {
        continue;
      }

      // "SELF" target means the reduction only applies when the source card (the one with the ability)
      // is the character being moved. This handles "pay X less to move this character" abilities.
      if (effect.target === "SELF" && sourceId !== characterId) {
        continue;
      }

      reduction = Math.max(
        reduction,
        effect.reduction === "free" ? Number.MAX_SAFE_INTEGER : (effect.reduction ?? 0),
      );
    }
  }

  return reduction;
}

function validateMoveCharacterToLocation(
  ctx: MoveReadableContext,
  characterId: CardInstanceId,
  locationId: CardInstanceId,
): RuntimeValidationResult {
  const currentPlayer = getCurrentPlayerId(ctx);
  if (!currentPlayer) {
    return {
      valid: false,
      error: "No active player is set",
      errorCode: "NO_ACTIVE_PLAYER",
    };
  }

  const characterZoneKey = ctx.framework.zones.getCardZone(characterId);
  const locationZoneKey = ctx.framework.zones.getCardZone(locationId);
  if (!characterZoneKey?.startsWith("play:")) {
    return {
      valid: false,
      error: "Character must be in play to move",
      errorCode: "CHARACTER_NOT_IN_PLAY",
    };
  }
  if (!locationZoneKey?.startsWith("play:")) {
    return {
      valid: false,
      error: "Location must be in play",
      errorCode: "LOCATION_NOT_IN_PLAY",
    };
  }

  const characterDefinition = getCardDefinition(ctx, characterId);
  if (!characterDefinition || !isCharacter(characterDefinition)) {
    return {
      valid: false,
      error: "Only characters can move to locations",
      errorCode: "NOT_A_CHARACTER",
    };
  }

  const locationDefinition = getCardDefinition(ctx, locationId);
  if (!locationDefinition || !isLocation(locationDefinition)) {
    return {
      valid: false,
      error: "Destination must be a location",
      errorCode: "NOT_A_LOCATION",
    };
  }

  if (getCardOwnerId(ctx, characterId) !== currentPlayer) {
    return {
      valid: false,
      error: "You can move only your own characters",
      errorCode: "CHARACTER_NOT_CONTROLLED",
    };
  }

  if (getCardOwnerId(ctx, locationId) !== currentPlayer) {
    return {
      valid: false,
      error: "You can move characters only to your own locations",
      errorCode: "LOCATION_NOT_CONTROLLED",
    };
  }

  const currentLocationId = ctx.cards.require(characterId).meta?.atLocationId as
    | CardInstanceId
    | undefined;
  if (currentLocationId === locationId) {
    return {
      valid: false,
      error: "A character at a location must move to another location",
      errorCode: "SAME_LOCATION",
    };
  }

  const registry = getOrBuildMoveRegistry(ctx);

  if (
    hasStaticSelfRestriction({
      state: ctx.framework.state,
      cardId: characterId,
      restriction: "cant-move",
      getDefinitionByInstanceId: (instanceId) => getCardDefinition(ctx, instanceId),
    })
  ) {
    return {
      valid: false,
      error: "Character cannot move to locations due to a static restriction",
      errorCode: "CANT_MOVE_RESTRICTED",
    };
  }

  if (
    hasStaticCardRestriction({
      state: ctx.framework.state,
      cardId: characterId,
      restriction: "cant-move",
      registry,
    })
  ) {
    return {
      valid: false,
      error: "Character cannot move to locations due to a static restriction from another card",
      errorCode: "CANT_MOVE_RESTRICTED",
    };
  }

  const baseMoveCost = getMoveCost(locationDefinition) ?? 0;
  const moveCost = Math.max(
    0,
    baseMoveCost - getStaticMoveCostReduction(ctx, characterId, locationId, currentPlayer),
  );
  const availableInk = getAvailableInk({ framework: ctx.framework }, currentPlayer);
  if (availableInk < moveCost) {
    return {
      valid: false,
      error: "Not enough ready ink to pay the move cost",
      errorCode: "INSUFFICIENT_INK",
    };
  }

  return { valid: true };
}

export const moveCharacterToLocation: LorcanaMoveDefinition<"moveCharacterToLocation"> = {
  validate: (ctx): RuntimeValidationResult => {
    const { characterId, locationId } = ctx.args;
    if (ctx.validationMode === "preflight" && (characterId == null || locationId == null)) {
      return { valid: true };
    }

    const pendingFailure = validateNoPendingEffects(ctx, { actionLabel: "move a character" });
    if (pendingFailure) {
      return pendingFailure;
    }

    return validateMoveCharacterToLocation(
      ctx,
      characterId as CardInstanceId,
      locationId as CardInstanceId,
    );
  },

  execute: (ctx) => {
    const { characterId, locationId } = ctx.args;
    const currentPlayer = getCurrentPlayerId(ctx);
    if (!currentPlayer) {
      return;
    }

    const locationDefinition = getCardDefinition(ctx, locationId as CardInstanceId);
    const baseMoveCost = locationDefinition ? (getMoveCost(locationDefinition) ?? 0) : 0;
    const moveCost = Math.max(
      0,
      baseMoveCost -
        getStaticMoveCostReduction(
          ctx,
          characterId as CardInstanceId,
          locationId as CardInstanceId,
          currentPlayer,
        ),
    );
    const currentLocationId = ctx.cards.require(characterId as CardInstanceId).meta
      ?.atLocationId as CardInstanceId | undefined;

    if (moveCost > 0) {
      spendInk(ctx, currentPlayer, moveCost);
    }

    ctx.cards.patchMeta(characterId as CardInstanceId, {
      atLocationId: locationId as CardInstanceId,
    });

    emitTriggeredLorcanaEvent(
      ctx,
      "cardMoved",
      {
        cardId: characterId as CardInstanceId,
        fromZone: currentLocationId ? `location:${currentLocationId}` : "play",
        toZone: `location:${locationId as CardInstanceId}`,
        playerId: currentPlayer,
      },
      {
        event: "move",
        fromZone: currentLocationId ? `location:${currentLocationId}` : "play",
        toZone: `location:${locationId as CardInstanceId}`,
        playerId: currentPlayer,
        subjectCardId: characterId as CardInstanceId,
      },
    );
    ctx.framework.log(
      createLorcanaLogProjection(
        "lorcana.move.moveCharacterToLocation",
        {
          playerId: currentPlayer,
          characterId: characterId as CardInstanceId,
          locationId: locationId as CardInstanceId,
        },
        { mode: "PUBLIC" },
        "action",
      ),
    );

    flushTriggeredEventsToBag(ctx);
  },

  available: (ctx) => {
    if (hasAnyPendingEffects(ctx)) {
      return false;
    }

    const currentPlayer = getCurrentPlayerId(ctx);
    if (!currentPlayer || ctx.playerId !== currentPlayer) {
      return false;
    }

    const playCards = ctx.framework.zones.getCards({
      zone: "play",
      playerId: currentPlayer,
    }) as CardInstanceId[];
    const characterIds = playCards.filter((cardId) => {
      const definition = getCardDefinition(ctx, cardId);
      return Boolean(definition && isCharacter(definition));
    });
    const locationIds = playCards.filter((cardId) => {
      const definition = getCardDefinition(ctx, cardId);
      return Boolean(definition && isLocation(definition));
    });

    return characterIds.some((characterId) =>
      locationIds.some(
        (locationId) => validateMoveCharacterToLocation(ctx, characterId, locationId).valid,
      ),
    );
  },
};
