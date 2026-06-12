import { getCard } from "../../../cards/src/index.ts";
import { canAttackWith, legalAttackTargets } from "../battle.ts";
import { enqueueEffectsForTrigger } from "../effects.ts";
import { applyJudgeCommand } from "../judge.ts";
import {
  baseCost,
  cardName,
  effectBlocksFor,
  emitEvent,
  emitLog,
  enqueueResolution,
  getCardForInstance,
  getCardPower,
  getInstance,
  getPlayer,
  nextIdentifier,
  otherSeat,
  shuffle,
} from "../shared.ts";
import {
  cleanupTurnEndModifiers,
  drawTopCard,
  formatCardList,
  getOpenCharacterSlots,
  moveCard,
} from "../state.ts";
import type { EngineCommand, MatchState } from "../types.ts";
import { handlePlayerPromptResolution } from "./prompt.ts";
import { hasPendingNonJudgePrompt } from "./shared.ts";

export function applyQueuedCommandMutation(
  state: MatchState,
  command: EngineCommand,
): { accepted: boolean; reason: string | null } {
  let accepted = false;
  let reason: string | null = null;

  if (command.seat === "judge") {
    accepted = applyJudgeCommand(state, command);
    if (!accepted) {
      reason = "Judge command could not be applied.";
    }
    return { accepted, reason };
  }

  switch (command.type) {
    case "mulligan": {
      if (state.status !== "setup" || state.setup.started) {
        reason = "Mulligan is only available during setup.";
        break;
      }
      const player = getPlayer(state, command.seat);
      if (state.setup.mulliganUsed[command.seat]) {
        reason = "This player already used a mulligan.";
        break;
      }
      state.setup.mulliganUsed[command.seat] = true;
      const returned = [...player.hand];
      for (const instanceId of returned) {
        moveCard(state, instanceId, command.seat, "deck", {
          deckPosition: "bottom",
          faceUp: false,
          publicKnowledge: false,
          actor: command.seat,
          visibility: "private",
          suppressLog: true,
        });
      }
      player.deck = shuffle(player.deck, `${state.config.seed ?? "0"}:${command.seat}:mulligan`);
      for (const [index, instanceId] of player.deck.entries()) {
        getInstance(state, instanceId).zoneIndex = index;
      }
      for (let index = 0; index < state.config.openingHandSize; index += 1) {
        drawTopCard(state, command.seat);
      }
      emitEvent(state, "mulligan", command.seat, {
        visibility: "private",
        data: {
          seat: command.seat,
        },
      });
      emitLog(state, command.seat, `${player.playerName} takes a mulligan.`, {
        visibility: "private",
        privateMessages: {
          [command.seat]: `Your new opening hand: ${formatCardList(state, player.hand)}.`,
        },
        judgeMessage: `${player.playerName} mulligan hand: ${formatCardList(state, player.hand)}.`,
      });
      accepted = true;
      break;
    }
    case "startGame":
      if (state.status !== "setup" || state.setup.started) {
        reason = "The match has already started.";
        break;
      }
      if (command.seat !== state.config.firstPlayer) {
        reason = "Only the first player can start the match in this draft.";
        break;
      }
      state.status = "active";
      state.setup.started = true;
      emitEvent(state, "gameStarted", command.seat, {
        visibility: "public",
      });
      emitLog(state, "system", "The match begins.", {
        visibility: "public",
      });
      enqueueResolution(state, {
        kind: "beginTurn",
        seat: state.config.firstPlayer,
        skipDraw: state.config.skipFirstTurnDraw,
      });
      accepted = true;
      break;
    case "endTurn":
      if (state.status !== "active" || state.activeSeat !== command.seat) {
        reason = "It is not this player's turn.";
        break;
      }
      if (hasPendingNonJudgePrompt(state)) {
        reason = "Resolve pending prompts before ending the turn.";
        break;
      }
      state.phase = "end";
      emitEvent(state, "phaseChanged", "system", {
        data: {
          seat: command.seat,
          phase: "end",
        },
      });
      emitLog(state, "system", `${getPlayer(state, command.seat).playerName} ends the turn.`, {
        visibility: "public",
      });
      cleanupTurnEndModifiers(state, state.turnNumber);
      state.turnNumber += 1;
      enqueueResolution(state, {
        kind: "beginTurn",
        seat: otherSeat(command.seat),
        skipDraw: false,
      });
      accepted = true;
      break;
    case "playCard": {
      if (
        state.status !== "active" ||
        state.activeSeat !== command.seat ||
        state.phase !== "main"
      ) {
        reason = "Cards can only be played during your main phase.";
        break;
      }
      const instance = getInstance(state, command.instanceId);
      if (instance.owner !== command.seat || instance.zone !== "hand") {
        reason = "The selected card is not in the active player's hand.";
        break;
      }
      const card = getCard(instance.cardId);
      const player = getPlayer(state, command.seat);
      const cardCost = card.cardType === "leader" ? 0 : baseCost(card);
      if (player.activeDon < cardCost) {
        reason = "Not enough active DON!! to pay the cost.";
        break;
      }

      if (card.cardType === "character") {
        const openSlots = getOpenCharacterSlots(state, command.seat);
        const slotIndex = command.slotIndex ?? openSlots[0];
        if (slotIndex === undefined || !openSlots.includes(slotIndex)) {
          reason = "A valid character slot is required.";
          break;
        }
        player.activeDon -= cardCost;
        player.restedDon += cardCost;
        moveCard(state, command.instanceId, command.seat, "character", {
          slotIndex,
          faceUp: true,
          publicKnowledge: true,
          actor: command.seat,
        });
        getInstance(state, command.instanceId).playedOnTurn = state.turnNumber;
      } else if (card.cardType === "stage") {
        player.activeDon -= cardCost;
        player.restedDon += cardCost;
        const existingStage = player.stageArea;
        if (existingStage) {
          moveCard(state, existingStage, command.seat, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: command.seat,
          });
        }
        moveCard(state, command.instanceId, command.seat, "stage", {
          faceUp: true,
          publicKnowledge: true,
          actor: command.seat,
        });
      } else if (card.cardType === "event") {
        if (!effectBlocksFor(card, "main").length) {
          reason = "This event does not have a playable [Main] effect.";
          break;
        }
        player.activeDon -= cardCost;
        player.restedDon += cardCost;
        emitEvent(state, "cardPlayed", command.seat, {
          sourceCardId: card.id,
          sourceInstanceId: command.instanceId,
          visibility: "public",
        });
        emitLog(state, command.seat, `${player.playerName} plays ${cardName(card)}.`, {
          sourceCardId: card.id,
          sourceInstanceId: command.instanceId,
          visibility: "public",
        });
        enqueueEffectsForTrigger(state, command.instanceId, command.seat, "main", undefined);
        moveCard(state, command.instanceId, command.seat, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: command.seat,
        });
        accepted = true;
        break;
      } else {
        reason = "Leaders cannot be played from hand.";
        break;
      }

      emitEvent(state, "cardPlayed", command.seat, {
        sourceCardId: card.id,
        sourceInstanceId: command.instanceId,
        visibility: "public",
      });
      emitLog(state, command.seat, `${player.playerName} plays ${cardName(card)}.`, {
        sourceCardId: card.id,
        sourceInstanceId: command.instanceId,
        visibility: "public",
      });
      enqueueEffectsForTrigger(state, command.instanceId, command.seat, "onPlay", undefined);
      accepted = true;
      break;
    }
    case "attachDon": {
      if (
        state.status !== "active" ||
        state.activeSeat !== command.seat ||
        state.phase !== "main"
      ) {
        reason = "DON!! can only be attached during your main phase.";
        break;
      }
      const amount = command.amount ?? 1;
      const player = getPlayer(state, command.seat);
      if (player.activeDon < amount) {
        reason = "Not enough active DON!! to attach.";
        break;
      }
      const target = getInstance(state, command.targetId);
      if (
        target.owner !== command.seat ||
        (target.zone !== "leader" && target.zone !== "character")
      ) {
        reason = "DON!! can only be attached to your leader or characters.";
        break;
      }
      player.activeDon -= amount;
      target.attachedDon += amount;
      emitEvent(state, "donAttached", command.seat, {
        sourceCardId: target.cardId,
        sourceInstanceId: command.targetId,
        visibility: "public",
        data: {
          amount,
        },
      });
      emitLog(
        state,
        command.seat,
        `${player.playerName} attaches ${amount} DON!! to ${cardName(getCardForInstance(state, command.targetId))}.`,
        {
          sourceCardId: target.cardId,
          sourceInstanceId: command.targetId,
          visibility: "public",
        },
      );
      accepted = true;
      break;
    }
    case "declareAttack": {
      if (
        state.status !== "active" ||
        state.activeSeat !== command.seat ||
        state.phase !== "main"
      ) {
        reason = "Attacks can only be declared during your main phase.";
        break;
      }
      if (!canAttackWith(state, command.seat, command.attackerId)) {
        reason = "The selected attacker cannot attack.";
        break;
      }
      const targetIds = legalAttackTargets(state, command.seat, command.attackerId);
      if (!targetIds.includes(command.targetId)) {
        reason = "The selected target cannot be attacked.";
        break;
      }
      const attacker = getInstance(state, command.attackerId);
      attacker.rested = true;
      state.battle = {
        id: nextIdentifier(state, "battle"),
        attackerId: command.attackerId,
        originalTargetId: command.targetId,
        targetId: command.targetId,
        defendingSeat: otherSeat(command.seat),
        step: "block",
        blockerId: null,
        counterCardIds: [],
        counterTotal: 0,
        attackPower: getCardPower(state, command.attackerId),
        defensePower: getCardPower(state, command.targetId),
        result: "pending",
      };
      emitEvent(state, "attackDeclared", command.seat, {
        sourceCardId: attacker.cardId,
        sourceInstanceId: command.attackerId,
        targetIds: [command.targetId],
        eventId: state.battle.id,
        visibility: "public",
      });
      emitLog(
        state,
        command.seat,
        `${cardName(getCardForInstance(state, command.attackerId))} attacks ${cardName(getCardForInstance(state, command.targetId))}.`,
        {
          sourceCardId: attacker.cardId,
          sourceInstanceId: command.attackerId,
          targetIds: [command.targetId],
          eventId: state.battle.id,
          visibility: "public",
        },
      );
      enqueueEffectsForTrigger(state, command.attackerId, command.seat, "whenAttacking", undefined);
      enqueueResolution(state, {
        kind: "battleBlockStep",
        battleId: state.battle.id,
      });
      accepted = true;
      break;
    }
    case "activateEffect": {
      if (
        state.status !== "active" ||
        state.activeSeat !== command.seat ||
        state.phase !== "main"
      ) {
        reason = "Effects can only be activated during your main phase.";
        break;
      }
      const source = getInstance(state, command.sourceInstanceId);
      if (
        source.owner !== command.seat ||
        !["leader", "character", "stage"].includes(source.zone)
      ) {
        reason = "The selected source is not controllable from the field.";
        break;
      }
      const card = getCard(source.cardId);
      if (!effectBlocksFor(card, command.trigger).length) {
        reason = "This card does not have that activation timing.";
        break;
      }
      enqueueEffectsForTrigger(
        state,
        command.sourceInstanceId,
        command.seat,
        command.trigger,
        command.trashHandIds,
      );
      accepted = true;
      break;
    }
    case "resolvePrompt":
      accepted = handlePlayerPromptResolution(state, command);
      if (!accepted) {
        reason = "Prompt resolution could not be applied.";
      }
      break;
  }

  return { accepted, reason };
}
