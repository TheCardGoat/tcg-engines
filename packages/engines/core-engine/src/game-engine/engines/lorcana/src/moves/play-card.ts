import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaEnumerableMove, LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

// **4.3.4. Play a card**
// **4.3.4.1.** The player announces which card from their hand they want to play, then reveals that card.
// **4.3.4.2.** The player announces how they intend to play the card: paying its cost in ink (standard cost) or an alternate cost (such as Shift).
// **4.3.4.3.** The player determines the total cost to play the card by applying any cost modifications.
// **4.3.4.4.** The player pays the total cost. If it involves exerting ink cards, the player exerts the appropriate number of ready ink cards.
// **4.3.4.5.** The card enters the appropriate zone. Characters, items, and locations enter play. Actions resolve their effect and go to the discard pile.
// **4.3.4.6.** Effects that would occur as a result of this card being played are added to the bag.

// **6.3.3. **Songs
//
// **6.3.3.1. ** *Songs* are actions that have a special rule in addition to the normal rules for actions \(see 6.3.3.3\).
// **6.3.3.2. **A song is defined as having “Action” and “Song” on the card’s classification line.
// **6.3.3.3. **All songs allow the player to pay an alternate cost instead of their ink cost to play them. Being a song means “Instead of paying the ink cost of this card, you can \{E\} one of your characters in play with ink cost N or greater to play this card for free.” This is called *singing* the song.
// **6.3.3.4. **Some songs also have the keyword **Sing Together**, which functions similarly to the special rule. \(See 10.10, “Sing Together.”\)
// **6.3.3.5. **The standard reminder text for a song is *“\(A character with cost N or more can *\{E\} * to sing this song for free.\)” *
// **6.3.4. **Any effect that’s triggered because of an action being played is placed in the bag and will resolve after the effects of the action are ful y resolved.

export interface PlayCardOptions {
  alternativeCost?: {
    type: "shift" | "sing" | "sing-together";
    targetInstanceId: string[]; // For shift, the character to shift onto
  };
}

export const playCardMove: LorcanaEnumerableMove = {
  execute: (
    { G, coreOps, playerID },
    instanceId: string,
    options?: PlayCardOptions,
  ) => {
    try {
      const lorcanaOps = toLorcanaCoreOps(coreOps);
      // Use getCtx instead of directly accessing ctx
      const ctx = lorcanaOps.getCtx();

      // Ensure we're in the main phase (this is a turn action)
      if (ctx.currentPhase !== "mainPhase") {
        logger.error(`Cannot play card during ${ctx.currentPhase} phase`);
        return createInvalidMove(
          "WRONG_PHASE",
          "moves.playCard.errors.wrongPhase",
          { currentPhase: ctx.currentPhase, expectedPhase: "mainPhase" },
        );
      }

      const cardInstance = lorcanaOps.getCardInstance(instanceId);
      if (!cardInstance) {
        logger.error(
          `Failed to get card instance ${instanceId} or engine not available`,
        );
        return createInvalidMove(
          "CARD_NOT_FOUND",
          "moves.playCard.errors.cardNotFound",
          { instanceId },
        );
      }

      const lorcanaCard = cardInstance;

      // Verify card is in player's hand
      const handCards = lorcanaOps.getCardsInZone("hand", playerID);
      if (!handCards.find((card) => card.instanceId === instanceId)) {
        logger.error(`Card ${instanceId} is not in player ${playerID}'s hand`);
        return createInvalidMove(
          "CARD_NOT_IN_HAND",
          "moves.playCard.errors.cardNotInHand",
          { instanceId, playerId: playerID },
        );
      }

      // Determine the cost to play the card
      let totalCost = lorcanaCard.card.cost;
      let targetZone: "play" | "discard" = "play";

      // Handle alternative costs (like Shift or Sing)
      if (options?.alternativeCost) {
        if (options.alternativeCost.type === "shift") {
          // For shift, verify the target character exists and is valid
          const shiftTarget = lorcanaOps.getCardInstance(
            options.alternativeCost.targetInstanceId[0],
          );
          if (!shiftTarget) {
            return createInvalidMove(
              "SHIFT_TARGET_NOT_FOUND",
              "moves.playCard.errors.shiftTargetNotFound",
              { targetInstanceId: options.alternativeCost.targetInstanceId },
            );
          }

          const lorcanaShiftTarget = shiftTarget;

          // Verify shift target has the same name
          if (lorcanaCard.card.name !== lorcanaShiftTarget.card.name) {
            return createInvalidMove(
              "INVALID_SHIFT_TARGET",
              "moves.playCard.errors.invalidShiftTarget",
              {
                cardName: lorcanaCard.card.name,
                targetName: lorcanaShiftTarget.card.name,
              },
            );
          }

          // Calculate shift cost (typically cost - shift value)
          // Note: shiftCost would need to be added to card definition or instance
          const shiftValue = (lorcanaCard.card as any).shift || 0;
          const shiftCost = lorcanaCard.card.cost - shiftValue;
          totalCost = Math.max(0, shiftCost);
        } else if (options.alternativeCost.type === "sing") {
          // For singing, validate that the card is a song and the singer can sing it
          const songCard = lorcanaCard.card;

          // Check if the card is a song (has "song" in characteristics)
          if (!songCard.characteristics?.includes("song")) {
            return createInvalidMove(
              "NOT_A_SONG",
              "moves.playCard.errors.notASong",
              { cardName: songCard.name, instanceId },
            );
          }

          // Get the singer character
          const singerInstanceId = options.alternativeCost.targetInstanceId[0];
          const singerInstance = lorcanaOps.getCardInstance(singerInstanceId);
          if (!singerInstance) {
            return createInvalidMove(
              "SINGER_NOT_FOUND",
              "moves.playCard.errors.singerNotFound",
              { singerInstanceId },
            );
          }

          // Verify singer is in play and ready
          const playCards = lorcanaOps.getCardsInZone("play", playerID);
          const singerInPlay = playCards.find(
            (card) => card.instanceId === singerInstanceId,
          );
          if (!singerInPlay) {
            return createInvalidMove(
              "SINGER_NOT_IN_PLAY",
              "moves.playCard.errors.singerNotInPlay",
              { singerInstanceId },
            );
          }

          if (singerInPlay.isExerted) {
            return createInvalidMove(
              "SINGER_ALREADY_EXERTED",
              "moves.playCard.errors.singerAlreadyExerted",
              { singerInstanceId },
            );
          }

          // Determine the effective cost of the singer for singing
          let effectiveSingerCost = singerInstance.card.cost;

          // Check if the singer has the Singer keyword ability
          const singerAbilities = (singerInstance.card as any).abilities || [];
          const singerKeyword = singerAbilities.find(
            (ability: any) =>
              ability?.type === "keyword" && ability?.keyword === "singer",
          );

          if (singerKeyword) {
            effectiveSingerCost = singerKeyword.value;
          }

          // Verify the singer can sing this song (cost >= song cost)
          if (effectiveSingerCost < songCard.cost) {
            return createInvalidMove(
              "SINGER_COST_TOO_LOW",
              "moves.playCard.errors.singerCostTooLow",
              {
                singerCost: effectiveSingerCost,
                songCost: songCard.cost,
                singerName: singerInstance.card.name,
                songName: songCard.name,
              },
            );
          }

          // For singing, the ink cost is 0 (free) but we need to exert the singer
          totalCost = 0;
        }
      }

      // Check if player has enough ink to play the card using game operations
      const availableInk = lorcanaOps.getAvailableInk(playerID);
      if (availableInk < totalCost) {
        logger.warn(
          `Player ${playerID} does not have enough ink to play card. Required: ${totalCost}, Available: ${availableInk}`,
        );
        return createInvalidMove(
          "INSUFFICIENT_INK",
          "moves.playCard.errors.insufficientInk",
          {
            required: totalCost,
            available: availableInk,
            playerId: playerID,
          },
        );
      }

      // Pay the ink cost using game operations
      const paymentSuccessful = lorcanaOps.exertInkForCost(playerID, totalCost);
      if (!paymentSuccessful) {
        logger.warn(`Player ${playerID} failed to pay ${totalCost} ink`);
        return createInvalidMove(
          "PAYMENT_FAILED",
          "moves.playCard.errors.paymentFailed",
          {
            required: totalCost,
            playerId: playerID,
          },
        );
      }

      // Determine target zone based on card type
      if (lorcanaCard.type === "action") {
        targetZone = "discard"; // Actions go to discard after resolving
      }

      // Handle alternative cost execution
      if (options?.alternativeCost?.type === "shift") {
        // Handle Shift - banish the target character first
        const banishResult = lorcanaOps.moveCard({
          playerId: playerID,
          instanceId: options.alternativeCost.targetInstanceId[0],
          to: "discard",
          from: "play",
        });

        if (banishResult) {
          logger.error(`Failed to banish shift target: ${banishResult.reason}`);
          return createInvalidMove(
            banishResult.reason,
            "moves.playCard.errors.failedToBanishShiftTarget",
            banishResult.context,
          );
        }
      } else if (options?.alternativeCost?.type === "sing") {
        // Handle Singing - exert the singer character
        const singerInstanceId = options.alternativeCost.targetInstanceId[0];
        lorcanaOps.exertCard(singerInstanceId);
      }

      // Move card to appropriate zone
      const moveResult = lorcanaOps.moveCard({
        playerId: playerID,
        instanceId,
        to: targetZone,
        from: "hand",
      });

      if (moveResult) {
        logger.error(
          `Failed to move card to ${targetZone}: ${moveResult.reason}`,
        );
        return createInvalidMove(
          moveResult.reason,
          "moves.playCard.errors.cardMoveError",
          moveResult.context,
        );
      }

      // Handle card-specific effects based on type
      if (lorcanaCard.card.type.includes("Character")) {
        // Characters enter play "wet" (cannot act immediately unless they have Rush)
        // This should be handled by the card instance state
      }

      // Add triggered effects to the bag (rule 8.7)
      lorcanaOps.addTriggeredEffectsToTheBag("onPlay", instanceId);

      // For actions, resolve their effects immediately
      if (lorcanaCard.card.type.includes("Action")) {
        // Action effects would be resolved here
        // This would need to be implemented based on the specific action
        // Note: Actions resolve immediately rather than adding triggered effects
      }

      logger.info(
        `Player ${playerID} played card ${instanceId} for ${totalCost} ink${
          options?.alternativeCost
            ? ` using ${options.alternativeCost.type}`
            : ""
        }`,
      );

      return G;
    } catch (error) {
      logger.error(`Unexpected error in playCardMove: ${error}`);
      return createInvalidMove(
        "UNEXPECTED_ERROR",
        "moves.playCard.errors.unexpectedError",
        { error: String(error), instanceId, playerId: playerID },
      );
    }
  },
};
