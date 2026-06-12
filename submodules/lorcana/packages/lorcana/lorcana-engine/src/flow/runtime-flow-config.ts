import type { MatchState, PlayerId, RuntimeFlowDefinition, RuntimeLifecycleContext } from "#core";
import { hasTemporaryRestriction } from "../runtime-moves/effects/temporary-effects";
import { hasStaticCardRestriction } from "../runtime-moves/rules/static-ability-utils";
import { getOrBuildMoveRegistry } from "../runtime-moves/rules/move-registry-cache";
import { resolveTurnOwnerId } from "../core/runtime/turn-owner";
import { checkLoreWinCondition } from "../runtime-moves/state/game-state-check";

function canAutoAdvanceBeginningPhase(state: MatchState): boolean {
  return (
    !state.G.pendingTurnTransition &&
    (state.G.triggeredAbilities?.bag?.items?.length ?? 0) === 0 &&
    !state.ctx.priority.pendingChoice &&
    (state.G.pendingEffects?.length ?? 0) === 0
  );
}

/**
 * Lorcana flow definition
 *
 * Game segments:
 * 1. startingAGame - Choose first player (OTP) and mulligan
 * 2. mainGame - Normal gameplay: beginning → main → end per turn
 */
export const lorcanaRuntimeFlow: RuntimeFlowDefinition = {
  initialGameSegment: "startingAGame",
  gameSegments: {
    startingAGame: {
      id: "startingAGame",
      name: "Starting a Game",
      order: 0,
      next: "mainGame",
      turn: {
        initialPhase: "chooseFirstPlayer",
        phases: {
          chooseFirstPlayer: {
            id: "chooseFirstPlayer",
            name: "Choose First Player",
            order: 1,
            // forfeitGame is a server-only move used by timeout/drop handlers;
            // it must remain legal in every phase, including pre-game setup,
            // so a disconnect during mulligan still cleanly ends the game.
            validMoves: ["chooseWhoGoesFirst", "forfeitGame"],
            nextPhase: "mulligan",
            endIf: (state) => state.ctx.status.otp != null,
          },
          mulligan: {
            id: "mulligan",
            name: "Alter Hand",
            order: 2,
            onEnter: (ctx: RuntimeLifecycleContext) => {
              // Draw initial hands for each player (7 cards each)
              for (const playerId of ctx.framework.state.playerIds) {
                ctx.framework.zones.shuffle({ zone: "deck", playerId });
                ctx.framework.zones.drawCards({
                  from: { zone: "deck", playerId },
                  to: { zone: "hand", playerId },
                  count: 7,
                });
              }
            },
            validMoves: ["alterHand", "forfeitGame"],
            endIf: (state) => (state.ctx.status.pendingMulligan?.length ?? 0) === 0,
            // No nextPhase: segment transition to mainGame
          },
        },
      },
    },
    mainGame: {
      id: "mainGame",
      name: "Main Game",
      order: 1,
      onEnter: (ctx: RuntimeLifecycleContext) => {
        ctx.framework.status.incrementTurn(); // turn 0 → 1
        if (ctx.framework.state.status.otp) {
          // This should use the framework helper to set up priority
          ctx.framework.priority.openWindow(ctx.framework.state.status.otp as PlayerId);
        }
      },
      validMoves: [
        "concede",
        "forfeitGame",
        "passTurn",
        "moveCharacterToLocation",
        "resolveBag",
        "resolveEffect",
        "manualMoveCard",
        "manualExertCard",
        "manualReadyCard",
        "manualDryCard",
        "manualSetDamage",
        "manualSetLore",
        "manualShuffleDeck",
        "manualPassTurn",
      ], // For testing purposes, to be removed
      turn: {
        initialPhase: "beginning",
        phases: {
          beginning: {
            id: "beginning",
            name: "Beginning Phase",
            order: 1,
            onEnter: (ctx: RuntimeLifecycleContext) => {
              // Ready exerted cards and clear drying only for the current player (play + inkwell)
              const currentPlayer = resolveTurnOwnerId(ctx.framework.state, ctx.G);
              if (!currentPlayer) {
                return;
              }
              const currentTurn = ctx.framework.state.status.turn ?? 1;
              const playerZoneRefs = [
                { zone: "play", playerId: currentPlayer },
                { zone: "inkwell", playerId: currentPlayer },
              ] as const;
              for (const zone of playerZoneRefs) {
                const cards = ctx.framework.zones.getCards(zone);
                const clearDrying = zone.zone === "play";
                for (const cardId of cards) {
                  const card = ctx.cards.get(cardId);
                  if (!card?.meta) continue;
                  const nextMeta = { ...card.meta } as Record<string, unknown>;
                  const cardMeta = card.meta as Record<string, unknown> | undefined;
                  const atLocId = cardMeta?.atLocationId;
                  const isCardAtLoc =
                    !!atLocId &&
                    typeof atLocId === "string" &&
                    (() => {
                      const zoneKey = ctx.framework.zones.getCardZone(atLocId);
                      return (
                        typeof zoneKey === "string" &&
                        (zoneKey === "play" || zoneKey.startsWith("play:"))
                      );
                    })();
                  const registry = getOrBuildMoveRegistry(ctx);
                  const cantReady =
                    hasTemporaryRestriction(card.meta, currentTurn, "cant-ready", {
                      isSourceInPlay: (sourceId) => {
                        const zoneKey = ctx.framework.zones.getCardZone(sourceId);
                        return (
                          typeof zoneKey === "string" &&
                          (zoneKey === "play" || zoneKey.startsWith("play:"))
                        );
                      },
                      isCardAtLocation: isCardAtLoc,
                    }) ||
                    hasStaticCardRestriction({
                      state: ctx.framework.state,
                      cardId: cardId as never,
                      restriction: "cant-ready-at-start-of-turn",
                      registry,
                    }) ||
                    hasStaticCardRestriction({
                      state: ctx.framework.state,
                      cardId: cardId as never,
                      restriction: "cant-ready",
                      registry,
                    }) ||
                    hasTemporaryRestriction(card.meta, currentTurn, "doesnt-ready", {
                      isSourceInPlay: (sourceId) => {
                        const zoneKey = ctx.framework.zones.getCardZone(sourceId);
                        return (
                          typeof zoneKey === "string" &&
                          (zoneKey === "play" || zoneKey.startsWith("play:"))
                        );
                      },
                      isCardAtLocation: isCardAtLoc,
                    });
                  if (
                    card.meta &&
                    (card.meta as Record<string, unknown>).state === "exerted" &&
                    !cantReady
                  ) {
                    nextMeta.state = "ready";
                  }
                  if (clearDrying) {
                    delete (nextMeta as Record<string, unknown>).isDrying;
                  }
                  ctx.cards.setMeta(cardId, nextMeta);
                }
              }
            },
            validMoves: [
              "concede",
              "forfeitGame",
              "resolveBag",
              "resolveEffect",
              "manualMoveCard",
              "manualExertCard",
              "manualReadyCard",
              "manualDryCard",
              "manualSetDamage",
              "manualSetLore",
              "manualShuffleDeck",
              "manualPassTurn",
            ],
            endIf: canAutoAdvanceBeginningPhase,
            nextPhase: "main",
          },
          main: {
            id: "main",
            name: "Main Phase",
            order: 2,
            validMoves: [
              "playCard",
              "quest",
              "questWithAll",
              "challenge",
              "moveCharacterToLocation",
              "activateAbility",
              "putCardIntoInkwell",
              "passTurn",
              "resolveBag",
              "resolveEffect",
              "concede",
              "forfeitGame",
              "manualMoveCard",
              "manualExertCard",
              "manualReadyCard",
              "manualDryCard",
              "manualSetDamage",
              "manualSetLore",
              "manualShuffleDeck",
              "manualPassTurn",
            ],
            endIf: () => false,
          },
          end: {
            id: "end",
            name: "End Phase",
            order: 3,
            onEnter: (_ctx: RuntimeLifecycleContext) => {},
            validMoves: [
              "concede",
              "forfeitGame",
              "resolveBag",
              "resolveEffect",
              "manualMoveCard",
              "manualExertCard",
              "manualReadyCard",
              "manualDryCard",
              "manualSetDamage",
              "manualSetLore",
              "manualShuffleDeck",
              "manualPassTurn",
            ],
            endIf: () => false,
            nextPhase: "beginning",
          },
        },
      },
      endIf: (state) => {
        // Concession or other game end set on ctx by moves
        if (state.ctx.status.gameEnded) {
          return {
            winner: state.ctx.status.winner ?? Object.keys(state.G.lore)[0],
            reason: state.ctx.status.reason ?? "Game ended",
          };
        }
        // Lore win (§1.8.1.1) — default threshold is 20, but
        // win-condition-modification abilities (e.g. Donald Duck – Flustered
        // Sorcerer) can raise it per player. Modified thresholds are stored in
        // G.loreToWin and kept up-to-date whenever cards enter/leave play.
        const loreWin = checkLoreWinCondition(state.G);
        if (loreWin) {
          return {
            winner: loreWin.winner,
            reason: `Reached ${String(loreWin.loreToWin)} lore`,
          };
        }
        return undefined;
      },
    },
  },
};
