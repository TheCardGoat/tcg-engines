import type { CardInstanceId, PlayerId } from "#core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import {
  createProjectionState,
  getEffectiveStrength,
  getEffectiveWillpower,
} from "../../rules/derived-state";
import type { PlayCardExecutionContext } from "../resolution/action-effects/types";
import { getOrBuildMoveRegistry } from "../rules/move-registry-cache";
import { moveCardOutOfPlayWithStack, getCharacterIdsAtLocation } from "./shift-stack";
import {
  emitTriggeredLorcanaEvent,
  flushTriggeredEventsToBag,
  snapshotTriggeredCandidatesForCard,
} from "../effects/triggered-abilities";
import { getKeywordsBeforeBanish } from "../shared/banish-snapshot";
import { recordBanishedCharacterThisTurn } from "./turn-metrics";

type SweepCtx = Pick<PlayCardExecutionContext, "G" | "playerId" | "framework" | "cards">;

/**
 * Banish characters/locations in play whose damage is greater than or equal to
 * **effective** (printed + modifiers + static layers) Willpower.
 *
 * Used after board changes that alter static stat layers without dealing new damage
 * (e.g. a +{W} aura source leaves play). Repeats until stable to handle cascades.
 */
export function sweepLethalDamageInPlay(
  ctx: SweepCtx,
  options: { reasonCardId?: CardInstanceId } = {},
): void {
  const actorPlayerId = (ctx.framework.state.priority?.holder ?? ctx.playerId) as PlayerId;
  const playerIds = ctx.framework.state.playerIds ?? [];

  for (let guard = 0; guard < 32; guard++) {
    const registry = getOrBuildMoveRegistry(ctx);
    const derivedState = createProjectionState(ctx.framework.state, ctx.G);
    const getDef = (id: CardInstanceId) => ctx.cards.getDefinition(id);

    let nextTarget: CardInstanceId | undefined;
    outer: for (const playerId of playerIds) {
      const playCards = ctx.framework.zones.getCards({
        zone: "play",
        playerId,
      }) as CardInstanceId[];
      const sorted = [...playCards].sort();
      for (const cardId of sorted) {
        const def = getDef(cardId) as LorcanaCardDefinition | undefined;
        if (def?.cardType !== "character" && def?.cardType !== "location") {
          continue;
        }
        const meta = ctx.cards.require(cardId).meta ?? {};
        const damage = Number(meta.damage ?? 0);
        if (!Number.isFinite(damage) || damage <= 0) {
          continue;
        }
        const effective = getEffectiveWillpower(def, derivedState, cardId, getDef, registry);
        if (damage >= effective) {
          nextTarget = cardId;
          break outer;
        }
      }
    }

    if (!nextTarget) {
      return;
    }

    const targetId = nextTarget;
    const targetDefinition = getDef(targetId);
    if (!targetDefinition) {
      return;
    }
    const meta = ctx.cards.require(targetId).meta ?? {};
    const ownerId = ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined;
    if (!ownerId) {
      return;
    }

    const keywordsBeforeBanish = getKeywordsBeforeBanish(ctx, targetId, actorPlayerId);
    const subjectAtLocationId = meta.atLocationId as CardInstanceId | undefined;
    const cardTriggerCandidates = snapshotTriggeredCandidatesForCard(ctx, targetId);
    const charsAtLocation =
      targetDefinition.cardType === "location"
        ? getCharacterIdsAtLocation(ctx, targetId)
        : undefined;
    const strengthBeforeBanish =
      targetDefinition?.cardType === "character"
        ? getEffectiveStrength(
            targetDefinition as LorcanaCardDefinition,
            derivedState,
            targetId,
            (id) => getDef(id) as LorcanaCardDefinition | undefined,
            registry,
          )
        : undefined;
    const sourceId = options.reasonCardId ?? targetId;

    moveCardOutOfPlayWithStack(ctx, targetId, { zone: "discard", playerId: ownerId });
    emitTriggeredLorcanaEvent(
      ctx,
      "cardBanished",
      {
        cardId: targetId,
        sourceId,
        snapshot: {
          damageDealt: Number(meta.damage ?? 0),
          keywordsBeforeBanish,
          subjectAtLocationId,
          strengthBeforeBanish:
            typeof strengthBeforeBanish === "number" && Number.isFinite(strengthBeforeBanish)
              ? strengthBeforeBanish
              : undefined,
        },
        reason: "lethal damage (state-based)",
      },
      {
        event: "banish",
        playerId: ownerId,
        subjectCardId: targetId,
        triggerSourceCardId: targetId,
        triggerCandidates: cardTriggerCandidates,
        eventSnapshot: {
          keywordsBeforeBanish,
          subjectAtLocationId,
          strengthBeforeBanish:
            typeof strengthBeforeBanish === "number" && Number.isFinite(strengthBeforeBanish)
              ? strengthBeforeBanish
              : undefined,
          charactersAtSourceLocationBeforeBanish: charsAtLocation,
        },
      },
    );
    recordBanishedCharacterThisTurn(ctx, targetId);
    flushTriggeredEventsToBag(ctx);
  }
}
