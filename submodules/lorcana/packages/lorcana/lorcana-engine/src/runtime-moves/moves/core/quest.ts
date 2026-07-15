// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-topic/turn-actions.md

import type {
  CardInstanceId,
  MoveEnumerationContext,
  MoveInput,
  MoveValidationContext,
  PlayerId,
  RuntimeValidationResult,
} from "#core";
import type { LorcanaCard } from "@tcg/lorcana-types";
import {
  createLorcanaLogProjection,
  type LorcanaG,
  type LorcanaMoveDefinition,
} from "../../../types";
import { normalizeTargetDescriptor, resolveCandidateTargets } from "../../../targeting/runtime";
import { hasKeyword } from "../../../card-utils";
import {
  createProjectionState,
  getEffectiveLore,
  getEffectiveWillpower,
} from "../../../rules/derived-state";
import { getEffectsForCard } from "../../../rules/static-effect-registry";
import {
  hasStaticSelfRestriction,
  hasStaticCardRestriction,
  hasOpponentStaticPlayRestriction,
  getStaticSelfRestrictionBypass,
} from "../../rules/static-ability-utils";
import { getAvailableInk, spendInk } from "../../rules/play-card-rules";
import {
  hasTemporaryKeyword,
  hasTemporaryLostKeyword,
  hasTemporaryPlayerRestriction,
  hasTemporaryRestriction,
} from "../../effects/temporary-effects";
import {
  applyStaticRestrictionBypass,
  buildStaticContexts,
  exertCard,
  gainLore,
  getCardDefinition,
  hasAnyPendingEffects,
  isCardInPlayZone,
  validateNoPendingEffects,
} from "../../../operations";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";
import type { PlayCardExecutionContext } from "../../resolution/action-effects/types";
import { validateExertCost } from "../../rules/play-card-rules";
import {
  emitTriggeredLorcanaEvent,
  flushTriggeredEventsToBag,
  hasPendingBagItems,
} from "../../effects/triggered-abilities";

const QUEST_TARGET_DSL = {
  selector: "chosen",
  count: 1,
  owner: "you",
  zones: ["play"],
  cardTypes: ["character"],
} as const;

type QuestValidationReadContext = Pick<
  MoveValidationContext<MoveInput>,
  "G" | "framework" | "cards"
>;

type QuestEnumerationReadContext = Pick<MoveEnumerationContext, "G" | "framework" | "cards">;

type QuestReadableContext =
  | QuestValidationReadContext
  | QuestEnumerationReadContext
  | PlayCardExecutionContext;

function validateQuestCard(
  ctx: QuestReadableContext,
  cardId: CardInstanceId,
): RuntimeValidationResult {
  const { registry, projectionState } = buildStaticContexts(ctx);
  const getCardWillpowerByInstanceId = (id: CardInstanceId) =>
    getEffectiveWillpower(
      ctx.cards.getDefinition(id) as any,
      projectionState,
      id,
      (innerId) => ctx.cards.getDefinition(innerId) as any,
      registry,
    );

  const pendingFailure = validateNoPendingEffects(ctx, { actionLabel: "quest" });
  if (pendingFailure) {
    return pendingFailure;
  }

  const currentPlayer = ctx.framework.state.currentPlayer!;

  const playCards = ctx.framework.zones.getCards({ zone: "play", playerId: currentPlayer });
  if (!playCards.includes(cardId)) {
    return { valid: false, error: "Character not in play", errorCode: "NOT_IN_PLAY" };
  }

  const cardDef = getCardDefinition(ctx, cardId);
  if (cardDef && cardDef.cardType !== "character") {
    return { valid: false, error: "Only characters can quest", errorCode: "NOT_A_CHARACTER" };
  }

  const questMeta = ctx.cards.require(cardId).meta;
  const exertValidation = validateExertCost(questMeta, cardDef?.cardType);
  if (!exertValidation.valid) {
    if (
      exertValidation.errorCode === "CARD_DRYING" &&
      (getEffectsForCard(registry, cardId, "gain-keyword").some(
        (e) => e.payload.keyword === "QuestWhileDrying",
      ) ||
        hasStaticSelfRestriction({
          state: ctx.framework.state,
          cardId,
          restriction: "can-quest-turn-played",
          getDefinitionByInstanceId: (instanceId) =>
            getCardDefinition(ctx, instanceId) as LorcanaCard | undefined,
        }))
    ) {
      // Card has an ability granting quest-while-drying (e.g. RECORD TIME) — allow it
    } else {
      return exertValidation;
    }
  }

  const currentTurn = ctx.framework.state.status.turn ?? 1;
  const hasTemporaryRecklessLoss = hasTemporaryLostKeyword(questMeta, currentTurn, "Reckless");
  const hasStaticGrantReckless =
    !hasTemporaryRecklessLoss &&
    getEffectsForCard(registry, cardId, "gain-keyword").some(
      (e) => e.payload.keyword === "Reckless",
    );
  const hasReckless =
    ((cardDef ? hasKeyword(cardDef, "Reckless") : false) && !hasTemporaryRecklessLoss) ||
    hasTemporaryKeyword(questMeta, currentTurn, "Reckless") ||
    hasStaticGrantReckless;
  if (hasReckless) {
    return {
      valid: false,
      error: "Character has Reckless and cannot quest",
      errorCode: "RECKLESS_CANT_QUEST",
    };
  }
  if (
    hasTemporaryRestriction(questMeta, currentTurn, "cant-quest", {
      isSourceInPlay: (sourceId) => isCardInPlayZone(ctx, sourceId),
    })
  ) {
    return {
      valid: false,
      error: "Character cannot quest due to an active restriction",
      errorCode: "CANT_QUEST_RESTRICTED",
    };
  }

  if (
    hasStaticSelfRestriction({
      state: ctx.framework.state,
      cardId,
      restriction: "cant-quest",
      getDefinitionByInstanceId: (instanceId) =>
        getCardDefinition(ctx, instanceId) as LorcanaCard | undefined,
      getCardWillpowerByInstanceId,
    })
  ) {
    const bypass = getStaticSelfRestrictionBypass({
      state: ctx.framework.state,
      cardId,
      restriction: "cant-quest",
      getDefinitionByInstanceId: (instanceId) =>
        getCardDefinition(ctx, instanceId) as LorcanaCard | undefined,
    });
    if (!bypass) {
      return {
        valid: false,
        error: "Character cannot quest due to a static restriction",
        errorCode: "CANT_QUEST_RESTRICTED",
      };
    }
    if (getAvailableInk(ctx, currentPlayer as PlayerId) < bypass.cost.ink) {
      return {
        valid: false,
        error: "Not enough ink to pay the quest bypass cost",
        errorCode: "CANT_QUEST_RESTRICTED",
      };
    }
  }

  if (
    hasStaticCardRestriction({
      state: ctx.framework.state,
      cardId,
      restriction: "cant-quest",
      registry,
    })
  ) {
    return {
      valid: false,
      error: "Character cannot quest due to a static restriction from another card",
      errorCode: "CANT_QUEST_RESTRICTED",
    };
  }

  return { valid: true };
}

function isPlayerBlockedFromGainingLore(
  ctx: PlayCardExecutionContext,
  playerId: PlayerId,
): boolean {
  const staticAbilityState = {
    priority: ctx.framework.state.priority,
    status: ctx.framework.state.status,
    _zonesPrivate: ctx.framework.state._zonesPrivate,
    _zonesPublic: ctx.framework.state._zonesPublic,
    G: ctx.G,
  };
  const registry = getOrBuildMoveRegistry(ctx);

  if (
    hasTemporaryPlayerRestriction(
      ctx.G.temporaryPlayerRestrictions,
      playerId,
      ctx.framework.state.status.turn ?? 1,
      "cant-gain-lore",
    )
  ) {
    return true;
  }

  return hasOpponentStaticPlayRestriction({
    state: staticAbilityState,
    playerId,
    restriction: "cant-gain-lore",
    registry,
  });
}

function executeQuestCard(ctx: PlayCardExecutionContext, cardId: CardInstanceId): number {
  const currentPlayer: PlayerId = ctx.framework.state.currentPlayer!;
  const { registry, projectionState: execProjectionState } = buildStaticContexts(ctx);
  const getCardWillpowerByInstanceId = (id: CardInstanceId) =>
    getEffectiveWillpower(
      ctx.cards.getDefinition(id) as any,
      execProjectionState,
      id,
      (innerId) => ctx.cards.getDefinition(innerId) as any,
      registry,
    );

  applyStaticRestrictionBypass(ctx, {
    cardId,
    restriction: "cant-quest",
    playerId: currentPlayer as PlayerId,
    getCardWillpowerByInstanceId,
  });

  exertCard(ctx, cardId);

  const loreValue = getEffectiveLore(
    ctx.cards.getDefinition(cardId) as any,
    createProjectionState(ctx.framework.state, ctx.G),
    cardId,
    (id) => ctx.cards.getDefinition(id) as any,
    registry,
  );

  const blocked = isPlayerBlockedFromGainingLore(ctx, currentPlayer);
  const effectiveLoreGain = blocked ? 0 : loreValue;

  gainLore(ctx, currentPlayer, effectiveLoreGain);
  ctx.G.turnMetadata.charactersQuesting.push(cardId);

  emitTriggeredLorcanaEvent(
    ctx,
    "quested",
    {
      playerId: currentPlayer,
      cardId,
      loreGained: loreValue,
    },
    [
      {
        event: "quest",
        playerId: currentPlayer,
        subjectCardId: cardId,
      },
      {
        event: "exert",
        playerId: currentPlayer,
        subjectCardId: cardId,
      },
      ...(loreValue > 0
        ? [
            {
              event: "gain-lore" as const,
              playerId: currentPlayer as PlayerId,
              triggerSourceCardId: cardId,
              eventSnapshot: {
                triggerAmount: loreValue,
              },
            },
          ]
        : []),
    ],
  );
  flushTriggeredEventsToBag(ctx);

  return loreValue;
}

function getQuestableCharacterIds(ctx: QuestReadableContext): CardInstanceId[] {
  return getEligibleQuestCharacters(ctx);
}

/**
 * Returns the cardInstanceIds of the current player's characters that are
 * legally able to quest this turn (ready, dry, no quest restrictions, etc.).
 * Exported for cross-move enforcement — e.g. pass-turn must-quest validation.
 */
export function getEligibleQuestCharacters(ctx: QuestReadableContext): CardInstanceId[] {
  const currentPlayer = ctx.framework.state.currentPlayer!;
  const playCards = ctx.framework.zones.getCards({
    zone: "play",
    playerId: currentPlayer,
  }) as CardInstanceId[];

  return playCards.filter((cardId) => validateQuestCard(ctx, cardId).valid);
}

/**
 * Quest with a character
 */
export const quest: LorcanaMoveDefinition<"quest"> = {
  validate: (ctx): RuntimeValidationResult => {
    const { cardId } = ctx.args;
    if (ctx.validationMode === "preflight" && cardId == null) {
      return { valid: true };
    }
    return validateQuestCard(ctx, cardId as CardInstanceId);
  },

  execute: (ctx) => {
    const cardId = ctx.args.cardId as CardInstanceId;
    const loreGained = executeQuestCard(ctx, cardId);
    ctx.framework.log(
      createLorcanaLogProjection(
        "lorcana.move.quest",
        {
          playerId: ctx.framework.state.currentPlayer!,
          cardId,
          loreGained,
        },
        { mode: "PUBLIC" },
        "action",
      ),
    );
  },

  available: (ctx) => {
    if (hasAnyPendingEffects(ctx)) {
      return false;
    }

    const registry = getOrBuildMoveRegistry(ctx);
    const descriptor = normalizeTargetDescriptor(QUEST_TARGET_DSL);
    const candidates = resolveCandidateTargets(ctx, descriptor, {
      controllerId: ctx.playerId as PlayerId,
      // Must not have quested this turn
      extraPredicate: (cardId) => {
        const cardDef = getCardDefinition(ctx, cardId);

        // Must not be exerted; must not be drying (cardMeta)
        const meta = ctx.cards.require(cardId).meta;
        if (meta?.state === "exerted") {
          return false;
        }
        if (meta?.isDrying) {
          const hasQuestWhileDrying = getEffectsForCard(
            registry,
            cardId as CardInstanceId,
            "gain-keyword",
          ).some((e) => e.payload.keyword === "QuestWhileDrying");
          const hasCanQuestTurnPlayed = hasStaticSelfRestriction({
            state: ctx.framework.state,
            cardId: cardId as CardInstanceId,
            restriction: "can-quest-turn-played",
            getDefinitionByInstanceId: (instanceId) =>
              getCardDefinition(ctx, instanceId) as LorcanaCard | undefined,
          });
          if (!hasQuestWhileDrying && !hasCanQuestTurnPlayed) return false;
        }
        const currentTurn = ctx.framework.state.status.turn ?? 1;
        const hasTemporaryRecklessLoss = hasTemporaryLostKeyword(meta, currentTurn, "Reckless");
        const hasStaticGrantReckless =
          !hasTemporaryRecklessLoss &&
          getEffectsForCard(registry, cardId as CardInstanceId, "gain-keyword").some(
            (e) => e.payload.keyword === "Reckless",
          );
        if (
          ((cardDef ? hasKeyword(cardDef, "Reckless") : false) && !hasTemporaryRecklessLoss) ||
          hasTemporaryKeyword(meta, currentTurn, "Reckless") ||
          hasStaticGrantReckless
        ) {
          return false;
        }
        if (
          hasTemporaryRestriction(meta, currentTurn, "cant-quest", {
            isSourceInPlay: (sourceId) => isCardInPlayZone(ctx, sourceId),
          })
        ) {
          return false;
        }
        if (
          hasStaticSelfRestriction({
            state: ctx.framework.state,
            cardId: cardId as CardInstanceId,
            restriction: "cant-quest",
            getDefinitionByInstanceId: (instanceId) =>
              getCardDefinition(ctx, instanceId) as LorcanaCard | undefined,
          })
        ) {
          const bypass = getStaticSelfRestrictionBypass({
            state: ctx.framework.state,
            cardId: cardId as CardInstanceId,
            restriction: "cant-quest",
            getDefinitionByInstanceId: (instanceId) =>
              getCardDefinition(ctx, instanceId) as LorcanaCard | undefined,
          });
          if (!bypass) {
            return false;
          }
          if (getAvailableInk(ctx, ctx.playerId as PlayerId) < bypass.cost.ink) {
            return false;
          }
        }

        if (
          hasStaticCardRestriction({
            state: ctx.framework.state,
            cardId: cardId as CardInstanceId,
            restriction: "cant-quest",
            registry,
          })
        ) {
          return false;
        }

        return true;
      },
    });

    return candidates.length > 0;
  },
};

export const questWithAll: LorcanaMoveDefinition<"questWithAll"> = {
  validate: (ctx): RuntimeValidationResult => {
    const pendingFailure = validateNoPendingEffects(ctx, { actionLabel: "quest" });
    if (pendingFailure) {
      return pendingFailure;
    }

    if (getQuestableCharacterIds(ctx).length === 0) {
      return {
        valid: false,
        error: "No eligible characters can quest",
        errorCode: "NO_ELIGIBLE_QUESTERS",
      };
    }

    return { valid: true };
  },

  execute: (ctx) => {
    const cardIds = getQuestableCharacterIds(ctx);
    let loreGained = 0;

    for (const cardId of cardIds) {
      loreGained += executeQuestCard(ctx, cardId);
    }

    ctx.framework.log(
      createLorcanaLogProjection(
        "lorcana.move.questWithAll",
        {
          playerId: ctx.framework.state.currentPlayer!,
          cardIds,
          loreGained,
          count: cardIds.length,
        },
        { mode: "PUBLIC" },
        "action",
      ),
    );
  },

  available: (ctx) => {
    if (hasAnyPendingEffects(ctx)) {
      return false;
    }

    if (getQuestableCharacterIds(ctx).length === 0) {
      return false;
    }

    return true;
  },
};
