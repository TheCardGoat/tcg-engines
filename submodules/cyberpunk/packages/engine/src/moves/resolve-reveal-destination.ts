import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { RevealDestinationPendingChoice } from "../types/match-state.ts";
import { resumeCurrentTrigger } from "../ability-executor.ts";
import { resumeSuspendedEndTurn } from "./pass-phase.ts";
import { privateField } from "../logging/private-field.ts";
import { defOf } from "../state/lookups.ts";

export interface ResolveRevealDestinationInput extends MoveInput {
  args: {
    destination: "hand" | "trash";
  };
}

export const resolveRevealDestinationMove: MoveDefinition<ResolveRevealDestinationInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    return choice?.type === "revealDestination" && choice.chooserId === playerId;
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "revealDestination") {
      return {
        valid: false,
        error: "No reveal destination choice pending",
        errorCode: "NO_PENDING_CHOICE",
      };
    }
    if (choice.chooserId !== playerId) {
      return { valid: false, error: "Not your reveal choice", errorCode: "NOT_YOUR_CHOICE" };
    }
    if (!choice.payload.destinations.includes(input.args.destination)) {
      return {
        valid: false,
        error: "Destination is not a valid choice",
        errorCode: "INVALID_DESTINATION",
      };
    }
    return { valid: true };
  },

  execute({ state, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as RevealDestinationPendingChoice;
    const destination = input.args.destination;
    const player = state.G.players[choice.payload.player as string];
    if (!player) return;

    for (const cardId of choice.payload.revealedCardIds) {
      operations.zone.moveCard(cardId, destination, choice.payload.player);
    }

    operations.game.setPendingChoice(undefined);

    operations.event.emit({
      type: "searchPerformed",
      playerId: choice.payload.player,
      zone: "deck",
      found: choice.payload.revealedCardIds.length,
    });

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.resolveRevealDestination",
      params: {
        count: choice.payload.revealedCardIds.length,
        destination,
        chooserId: choice.chooserId,
        chooserLabel: "Rival",
      },
      playerId: choice.payload.player,
      category: "search",
      cardIds: choice.payload.revealedCardIds.map((id) => id as string),
    });

    if (choice.payload.drawIfDestination?.destination === destination) {
      const drawPlayerId = choice.payload.drawIfDestination.player;
      const drawnCardIds = operations.zone.drawCards(
        drawPlayerId,
        choice.payload.drawIfDestination.amount,
      );
      if (drawnCardIds.length > 0) {
        const sourceCard = choice.payload.sourceCardId
          ? state.G.cardIndex[choice.payload.sourceCardId as string]
          : undefined;
        const drawnCardNames = drawnCardIds
          .map((cardId) => state.G.cardIndex[cardId as string])
          .filter((card): card is NonNullable<typeof card> => card !== undefined)
          .map((card) => {
            const definition = defOf(card);
            return definition.displayName ?? definition.name;
          });
        operations.event.emit({
          type: "actionLog",
          messageKey: "effect.draw.resolved",
          params: {
            sourceCardName: sourceCard
              ? (defOf(sourceCard).displayName ?? defOf(sourceCard).name)
              : "That effect",
            drawnCount: drawnCardIds.length,
            drawnCardIds: privateField(drawnCardIds as readonly string[], [drawPlayerId]),
            drawnCardNames: privateField(drawnCardNames.join(", "), [drawPlayerId]),
          },
          playerId: choice.payload.sourcePlayerId ?? choice.payload.player,
          category: "effect",
          cardIds: choice.payload.sourceCardId ? [choice.payload.sourceCardId as string] : [],
        });
      }
    }

    resumeCurrentTrigger(state, operations);
    resumeSuspendedEndTurn(state, operations);
  },
};
