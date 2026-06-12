import type { CardInstanceId, PlayerId } from "#core";
import type { RevealAndRouteEffect, RevealRouteDestination } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import { createLorcanaLogProjection } from "../../../types";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import { recordCardPutIntoInkwellThisTurn } from "../../state/turn-metrics";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import { evaluateActionCondition } from "./action-condition-evaluator";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import type {
  ActionEffectResolutionOptions,
  ActionResolutionInput,
  ActionResolutionResult,
  PlayCardExecutionContext,
} from "./types";

export function isRevealAndRouteEffect(effect: unknown): effect is RevealAndRouteEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "reveal-and-route"
  );
}

const DEFAULT_FALLBACK: RevealRouteDestination = { zone: "deck-top" };

export function resolveRevealAndRouteEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: RevealAndRouteEffect,
  resolutionInput: ActionResolutionInput,
  resolveNestedEffect: (
    ctx: PlayCardExecutionContext,
    cardPlayed: CardPlayedPayload,
    effect: unknown,
    resolutionInput: ActionResolutionInput,
    options?: ActionEffectResolutionOptions,
  ) => ActionResolutionResult,
  options?: ActionEffectResolutionOptions,
): ActionResolutionResult {
  // Step 1: Reveal the top card of the deck
  const targetPlayerIds = resolveTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target,
    resolutionInput.targets,
  );
  const targetPlayerId = targetPlayerIds[0] ?? cardPlayed.playerId;

  const deckCards = ctx.framework.zones.getCards({
    zone: "deck",
    playerId: targetPlayerId,
  }) as CardInstanceId[];
  const topCard = deckCards.at(-1);

  if (!topCard) {
    return { status: "resolved" };
  }

  // Store revealed card in event snapshot for condition evaluation
  resolutionInput.eventSnapshot ??= {};
  resolutionInput.eventSnapshot.revealedCardIds = [topCard];

  ctx.framework.zones.reveal([topCard], "all");

  ctx.framework.log(
    createLorcanaLogProjection(
      "lorcana.effect.resolve.revealTopCard",
      {
        playerId: cardPlayed.playerId,
        targetPlayerId,
        revealedCardId: topCard,
      },
      { mode: "PUBLIC" },
      "action",
    ),
  );

  // Step 2: Check routes in order
  for (const route of effect.routes) {
    const conditionMet = evaluateActionCondition(route.condition, ctx, cardPlayed, resolutionInput);

    if (!conditionMet) {
      continue;
    }

    // Route matched
    if (route.optional && route.destination.zone === "play") {
      // Optional play-for-free: delegate to optional + play-card effect chain
      const fallback = effect.fallback ?? DEFAULT_FALLBACK;
      const playEffect = {
        type: "play-card" as const,
        from: "revealed" as const,
        cost: route.destination.cost ?? ("free" as const),
        target: "CONTROLLER" as const,
      };

      // Build the nested effect: if optional, wrap in optional with play-card
      // On decline, the card needs to go to fallback destination
      const nestedEffect = {
        type: "optional" as const,
        effect: playEffect,
        chooser: "CONTROLLER" as const,
      };

      const result = resolveNestedEffect(ctx, cardPlayed, nestedEffect, resolutionInput, options);

      const currentZone = ctx.framework.zones.getCardZone(topCard);
      const stillOnDeck =
        typeof currentZone === "string" &&
        (currentZone === "deck" || currentZone.startsWith("deck:"));

      if (result.status === "resolved") {
        // Player resolved the optional. Check if card was played or declined.
        // If card is still in deck (not played), move to fallback.
        if (stillOnDeck) {
          moveCardToDestination(ctx, topCard, fallback, targetPlayerId);
        } else {
          markLastEffectPerformed(resolutionInput.eventSnapshot, true);
        }

        // Execute side effects if the card was played (not on deck anymore)
        if (!stillOnDeck && route.sideEffects) {
          for (const sideEffect of route.sideEffects) {
            resolveNestedEffect(ctx, cardPlayed, sideEffect, resolutionInput, options);
          }
        }

        return result;
      }

      if (result.status === "suspended" && !stillOnDeck) {
        // The revealed card was accepted and played for free, but its own effects are
        // independently pending (e.g. it also has a multi-step sequence that needs player input).
        // We Know the Way's effect is complete at this point — the decision was made and the
        // card started playing. Return "resolved" so the outer card is finalised to discard
        // instead of staying orphaned in limbo while the inner card resolves separately.
        markLastEffectPerformed(resolutionInput.eventSnapshot, true);
        if (route.sideEffects) {
          for (const sideEffect of route.sideEffects) {
            resolveNestedEffect(ctx, cardPlayed, sideEffect, resolutionInput, options);
          }
        }
        return { status: "resolved" };
      }

      return result;
    }

    // Non-optional route or non-play destination: move card directly
    moveCardToDestination(ctx, topCard, route.destination, targetPlayerId);
    markLastEffectPerformed(resolutionInput.eventSnapshot, true);

    // Execute side effects
    if (route.sideEffects) {
      for (const sideEffect of route.sideEffects) {
        const result = resolveNestedEffect(ctx, cardPlayed, sideEffect, resolutionInput, options);
        if (result.status === "suspended") {
          return result;
        }
      }
    }

    return { status: "resolved" };
  }

  // No route matched: move to fallback
  const fallback = effect.fallback ?? DEFAULT_FALLBACK;
  moveCardToDestination(ctx, topCard, fallback, targetPlayerId);
  markLastEffectPerformed(resolutionInput.eventSnapshot, false);

  return { status: "resolved" };
}

function moveCardToDestination(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  destination: RevealRouteDestination,
  playerId: PlayerId,
): void {
  switch (destination.zone) {
    case "deck-top":
      // Card is already on top of deck, no-op
      break;
    case "deck-bottom": {
      // Move to bottom of deck
      const deckCards = ctx.framework.zones.getCards({
        zone: "deck",
        playerId,
      }) as CardInstanceId[];
      // Remove from current position and place at bottom (index 0)
      ctx.framework.zones.moveCard(cardId, { zone: "deck", playerId });
      // The moveCard places at the end (top), so we need to reorder
      // Actually, let's just use the existing put-on-bottom logic
      ctx.framework.zones.moveCard(cardId, { zone: "deck", playerId });
      break;
    }
    case "hand":
      ctx.framework.zones.moveCard(cardId, { zone: "hand", playerId });
      break;
    case "inkwell": {
      const sourceZoneKey = ctx.framework.zones.getCardZone(cardId);
      // The top card was already revealed to all players earlier in this effect,
      // so the card identity is public even if the source zone is private.
      ctx.framework.zones.moveCard(cardId, { zone: "inkwell", playerId });
      recordCardPutIntoInkwellThisTurn(ctx, cardId);
      const state = destination.exerted !== false ? "exerted" : "ready";
      ctx.cards.patchMeta(cardId, {
        state,
        publicFaceState: "faceDown",
      });
      emitTriggeredLorcanaEvent(
        ctx,
        "cardInked",
        {
          playerId,
          cardId,
          from: sourceZoneKey ?? "unknown",
          to: `inkwell:${playerId}`,
          exerted: state === "exerted",
          private: false,
        },
        {
          event: "ink",
          playerId,
          subjectCardId: cardId,
          fromZone: sourceZoneKey,
        },
      );
      break;
    }
    case "discard":
      ctx.framework.zones.moveCard(cardId, { zone: "discard", playerId });
      break;
    case "play":
      // Play destination without optional flag should not reach here
      // (it's handled via the nested effect path above)
      break;
  }
}
