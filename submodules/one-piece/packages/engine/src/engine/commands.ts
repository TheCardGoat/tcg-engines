import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { attackHandTrashCost, beginAttack } from "../battle.ts";
import {
  enqueueEffectsForTrigger,
  enqueueInPlayEffectsForTrigger,
  enqueueMirroredInPlayEffectsForTrigger,
} from "../effects.ts";
import { applyJudgeCommand } from "../judge.ts";
import {
  cardName,
  emitEvent,
  emitLog,
  enqueueResolution,
  getCardForInstance,
  getCardCost,
  getInstance,
  getPlayer,
  otherSeat,
  shuffle,
} from "../shared.ts";
import {
  createChoicePrompt,
  drawTopCard,
  finalizeMatchImmediately,
  formatCardList,
  getOpenCharacterSlots,
  moveCard,
  placeStartingLife,
} from "../state.ts";
import type { EngineCommand, JoKenPoChoice, MatchSeat, MatchState } from "../types.ts";
import {
  canActivateEffect,
  canAttachDon,
  canChooseFirstPlayer,
  canConcede,
  canDeclareAttack,
  canEndTurn,
  canKeepHand,
  canMulligan,
  canPlayCard,
  canStartGame,
} from "./legality.ts";
import { completeCharacterPlayFromHand, projectCharacterReplacementPrompt } from "./play.ts";
import { handlePlayerPromptResolution } from "./prompt.ts";

interface CommandMutationContext {
  joKenPoChoices: Partial<Record<MatchSeat, JoKenPoChoice>>;
}

export function privateChoicesForJoKenPo(state: MatchState): CommandMutationContext {
  return {
    joKenPoChoices: {
      ...state.setup.joKenPo.hiddenChoices,
      ...(state.setup.joKenPo.winner ? state.setup.joKenPo.choices : {}),
    },
  };
}

export function rememberPrivateJoKenPoChoices(state: MatchState, context: CommandMutationContext) {
  const choices = context.joKenPoChoices;
  state.setup.joKenPo.hiddenChoices =
    state.setup.joKenPo.winner || (!choices.north && !choices.south) ? {} : { ...choices };
}

function joKenPoChoiceLabel(choice: JoKenPoChoice): string {
  switch (choice) {
    case "rock":
      return "Rock";
    case "paper":
      return "Paper";
    case "scissors":
      return "Scissors";
  }
}

function joKenPoWinner(choices: Record<MatchSeat, JoKenPoChoice>): MatchSeat | "draw" {
  if (choices.north === choices.south) {
    return "draw";
  }

  const southWins =
    (choices.south === "rock" && choices.north === "scissors") ||
    (choices.south === "paper" && choices.north === "rock") ||
    (choices.south === "scissors" && choices.north === "paper");

  return southWins ? "south" : "north";
}

function ordinalRound(round: number): string {
  const suffix =
    round % 10 === 1 && round % 100 !== 11
      ? "st"
      : round % 10 === 2 && round % 100 !== 12
        ? "nd"
        : round % 10 === 3 && round % 100 !== 13
          ? "rd"
          : "th";
  return `${round}${suffix}`;
}

function privatePlayerName(state: MatchState, seat: MatchSeat): string {
  const playerName = getPlayer(state, seat).playerName;
  if (seat === "south" && playerName === "South") {
    return "You";
  }
  return playerName;
}

function resolveJoKenPoRound(
  state: MatchState,
  choices: Partial<Record<MatchSeat, JoKenPoChoice>>,
) {
  if (!choices.north || !choices.south) {
    return;
  }

  const round = state.setup.joKenPo.round;
  const result = joKenPoWinner({
    north: choices.north,
    south: choices.south,
  });
  const choiceText = `${getPlayer(state, "south").playerName}: ${joKenPoChoiceLabel(choices.south)}. ${getPlayer(state, "north").playerName}: ${joKenPoChoiceLabel(choices.north)}.`;

  if (result === "draw") {
    state.setup.joKenPo.choices = {
      north: choices.north,
      south: choices.south,
    };
    emitLog(
      state,
      "system",
      `In the ${ordinalRound(round)} Jo Ken Po round it was a draw. ${choiceText}`,
      {
        visibility: "public",
      },
    );
    state.setup.joKenPo.round += 1;
    state.setup.joKenPo.pendingSeats = [];
    state.setup.joKenPo.choices = {};
    state.setup.joKenPo.hiddenChoices = {};
    delete choices.north;
    delete choices.south;
    return;
  }

  state.setup.joKenPo.winner = result;
  state.setup.joKenPo.pendingSeats = [];
  state.setup.joKenPo.choices = {
    north: choices.north,
    south: choices.south,
  };
  state.setup.joKenPo.hiddenChoices = {};
  delete choices.north;
  delete choices.south;
  emitLog(
    state,
    "system",
    `In the ${ordinalRound(round)} Jo Ken Po round ${getPlayer(state, result).playerName} won the Jo Ken Po and will decide who takes the first turn. ${choiceText}`,
    {
      visibility: "public",
    },
  );
}

export function applyQueuedCommandMutation(
  state: MatchState,
  command: EngineCommand,
  context: CommandMutationContext = privateChoicesForJoKenPo(state),
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
    case "concede": {
      // 1-2-3: a player may concede at any point — during setup or while the
      // game is active, in any phase, mid-battle, or mid-prompt — and loses
      // the game immediately. The only illegal moment is after the game has
      // already finished.
      const legality = canConcede(state);
      if (!legality.ok) {
        reason = legality.reason;
        break;
      }
      // 1-2-4: no card effect can affect, replace, or prevent a concession,
      // so this resolves as a direct state transition: no domain event is
      // dispatched and no replacement/effect machinery is consulted.
      const winner = otherSeat(command.seat);
      finalizeMatchImmediately(
        state,
        winner,
        "concession",
        `${getPlayer(state, command.seat).playerName} concedes. ${getPlayer(state, winner).playerName} wins by concession.`,
      );
      accepted = true;
      break;
    }
    case "chooseJoKenPo": {
      if (state.status !== "setup" || state.setup.started) {
        reason = "Jo Ken Po is only available during setup.";
        break;
      }
      if (state.setup.joKenPo.winner) {
        reason = "Jo Ken Po is already resolved.";
        break;
      }
      if (state.setup.joKenPo.pendingSeats.includes(command.seat)) {
        reason = "This player already chose for this Jo Ken Po round.";
        break;
      }
      context.joKenPoChoices[command.seat] = command.choice;
      state.setup.joKenPo.hiddenChoices = { ...context.joKenPoChoices };
      state.setup.joKenPo.pendingSeats.push(command.seat);
      resolveJoKenPoRound(state, context.joKenPoChoices);
      accepted = true;
      break;
    }
    case "resolveJoKenPoTimeout": {
      if (state.status !== "setup" || state.setup.started) {
        reason = "Jo Ken Po is only available during setup.";
        break;
      }
      if (state.setup.joKenPo.winner) {
        reason = "Jo Ken Po is already resolved.";
        break;
      }
      if (command.elapsedMs < 30000) {
        reason = "Jo Ken Po timeout requires 30 seconds to elapse.";
        break;
      }
      state.setup.joKenPo.winner = command.winner;
      state.setup.joKenPo.pendingSeats = [];
      state.setup.joKenPo.hiddenChoices = {};
      state.setup.joKenPo.choices = {};
      const timedOutNames = (command.timedOutSeats ?? [])
        .map((seat) => getPlayer(state, seat).playerName)
        .join(", ");
      const reasonText =
        command.reason === "bothPlayersTimedOut"
          ? "Both players exceeded 30 seconds, so the system randomly decided"
          : `${timedOutNames || "A player"} exceeded 30 seconds`;
      emitLog(
        state,
        "system",
        `${reasonText}. ${getPlayer(state, command.winner).playerName} won the Jo Ken Po and will decide who takes the first turn.`,
        {
          visibility: "public",
        },
      );
      accepted = true;
      break;
    }
    case "chooseFirstPlayer": {
      const legality = canChooseFirstPlayer(state, command.seat);
      if (!legality.ok) {
        reason = legality.reason;
        break;
      }
      state.config.firstPlayer = command.firstPlayer;
      state.activeSeat = command.firstPlayer;
      state.setup.joKenPo.firstPlayerDecided = true;
      const chooser = getPlayer(state, command.seat).playerName;
      const firstPlayer = getPlayer(state, command.firstPlayer).playerName;
      emitLog(
        state,
        "system",
        command.seat === command.firstPlayer
          ? `${chooser} decided to take the first turn.`
          : `${chooser} decided that ${firstPlayer} will take the first turn.`,
        {
          visibility: "public",
        },
      );
      accepted = true;
      break;
    }
    case "mulligan": {
      const legality = canMulligan(state, command.seat);
      if (!legality.ok) {
        reason = legality.reason;
        break;
      }
      const player = getPlayer(state, command.seat);
      state.setup.mulliganDecided[command.seat] = true;
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
        drawTopCard(state, command.seat, { suppressLog: true });
      }
      emitEvent(state, "mulligan", command.seat, {
        visibility: "private",
        data: {
          seat: command.seat,
        },
      });
      emitLog(
        state,
        command.seat,
        `${player.playerName} accepted mulligan and redraws ${state.config.openingHandSize} cards.`,
        {
          visibility: "public",
          privateMessages: {
            [command.seat]: `${privatePlayerName(state, command.seat)} accepted the mulligan and your new opening hand is: ${formatCardList(state, player.hand)}.`,
          },
          judgeMessage: `${player.playerName} mulligan hand: ${formatCardList(state, player.hand)}.`,
        },
      );
      accepted = true;
      break;
    }
    case "keepHand": {
      const legality = canKeepHand(state, command.seat);
      if (!legality.ok) {
        reason = legality.reason;
        break;
      }
      state.setup.mulliganDecided[command.seat] = true;
      const player = getPlayer(state, command.seat);
      emitEvent(state, "mulligan", command.seat, {
        visibility: "private",
        data: {
          seat: command.seat,
          keptHand: true,
        },
      });
      emitLog(state, command.seat, `${player.playerName} keeps their opening hand.`, {
        visibility: "public",
        privateMessages: {
          [command.seat]: "You keep your opening hand.",
        },
        judgeMessage: `${player.playerName} keeps their opening hand.`,
      });
      accepted = true;
      break;
    }
    case "startGame": {
      const legality = canStartGame(state, command.seat);
      if (!legality.ok) {
        reason = legality.reason;
        break;
      }
      // 5-2-1-7: starting Life is placed after the opening-hand redraws
      // (5-2-1-6), just before the first player starts their turn (5-2-1-8).
      for (const seat of ["south", "north"] as const) {
        if (!state.setup.lifePlaced[seat]) {
          placeStartingLife(state, seat);
          state.setup.lifePlaced[seat] = true;
        }
      }
      state.status = "active";
      state.setup.started = true;
      emitEvent(state, "gameStarted", command.seat, {
        visibility: "public",
      });
      emitLog(state, "system", "Setup finished.", {
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
    }
    case "endTurn": {
      const legality = canEndTurn(state, command.seat);
      if (!legality.ok) {
        reason = legality.reason;
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
      const delayedActions = state.delayedEffectActions.filter(
        (item) =>
          item.scheduledBattleId === undefined &&
          item.scheduledPhase === undefined &&
          item.controller === command.seat &&
          item.scheduledTurn === state.turnNumber,
      );
      state.delayedEffectActions = state.delayedEffectActions.filter(
        (item) =>
          item.scheduledBattleId !== undefined ||
          item.scheduledPhase !== undefined ||
          item.controller !== command.seat ||
          item.scheduledTurn !== state.turnNumber,
      );
      for (const item of delayedActions) {
        if (
          item.sourceZoneChangeCounter !== undefined &&
          getInstance(state, item.sourceInstanceId).zoneChangeCounter !==
            item.sourceZoneChangeCounter
        ) {
          continue;
        }
        enqueueResolution(state, {
          kind: "effectAction",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          action: item.action,
          previousActionTargetIds: item.previousActionTargetIds,
        });
      }
      for (const controller of [command.seat, otherSeat(command.seat)] as const) {
        const player = getPlayer(state, controller);
        for (const instance of Object.values(state.cards)) {
          if (instance.controller !== controller) {
            continue;
          }
          const isInPlay =
            (instance.zone === "leader" && player.leaderInstanceId === instance.instanceId) ||
            (instance.zone === "character" && player.characterArea.includes(instance.instanceId)) ||
            (instance.zone === "stage" && player.stageArea === instance.instanceId);
          if (!isInPlay) {
            continue;
          }
          enqueueEffectsForTrigger(
            state,
            instance.instanceId,
            controller,
            controller === command.seat ? "endOfYourTurn" : "endOfOpponentTurn",
            undefined,
          );
        }
      }
      enqueueResolution(state, {
        kind: "endTurnFinalize",
        seat: command.seat,
      });
      accepted = true;
      break;
    }
    case "playCard": {
      const legality = canPlayCard(state, command.seat, command.instanceId, command.slotIndex);
      if (!legality.ok) {
        reason = legality.reason;
        break;
      }
      const instance = getInstance(state, command.instanceId);
      const card = getCard(instance.cardId);
      const player = getPlayer(state, command.seat);
      const cardCost = card.cardType === "leader" ? 0 : getCardCost(state, command.instanceId);

      if (card.cardType === "character") {
        const openSlots = getOpenCharacterSlots(state, command.seat);
        const slotIndex = command.slotIndex ?? openSlots[0];
        if (slotIndex === undefined || !openSlots.includes(slotIndex)) {
          // 3-7-6-1: with a full Character area, the player reveals the card
          // and trashes 1 of their Characters before completing the play.
          projectCharacterReplacementPrompt(state, command.seat, command.instanceId);
          accepted = true;
          break;
        }
        completeCharacterPlayFromHand(state, command.seat, command.instanceId, slotIndex);
        accepted = true;
        break;
      }
      if (card.cardType === "event") {
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
        moveCard(state, command.instanceId, instance.owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: command.seat,
        });
        enqueueMirroredInPlayEffectsForTrigger(
          state,
          command.seat,
          "whenYouActivateEvent",
          "whenOpponentActivatesEvent",
          { instanceId: command.instanceId, effectController: command.seat },
        );
        accepted = true;
        break;
      }
      // canPlayCard rejects Leaders, so only Stages reach the shared play path.
      player.activeDon -= cardCost;
      player.restedDon += cardCost;
      const existingStage = player.stageArea;
      if (existingStage) {
        moveCard(state, existingStage, getInstance(state, existingStage).owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: command.seat,
        });
      }
      moveCard(state, command.instanceId, command.seat, "stage", {
        faceUp: true,
        publicKnowledge: true,
        actor: command.seat,
        // The public "plays X." line below supersedes the raw zone movement.
        suppressLog: true,
      });
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
      const amount = command.amount ?? 1;
      const legality = canAttachDon(state, command.seat, command.targetId, amount);
      if (!legality.ok) {
        reason = legality.reason;
        break;
      }
      const player = getPlayer(state, command.seat);
      const target = getInstance(state, command.targetId);
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
      enqueueInPlayEffectsForTrigger(state, "whenDonGiven", {
        instanceId: command.targetId,
        effectController: command.seat,
      });
      accepted = true;
      break;
    }
    case "declareAttack": {
      const legality = canDeclareAttack(state, command.seat, command.attackerId, command.targetId);
      if (!legality.ok) {
        reason = legality.reason;
        break;
      }
      const handTrashAmount = attackHandTrashCost(state, command.attackerId);
      if (handTrashAmount > 0) {
        const candidateIds = [...getPlayer(state, command.seat).hand];
        createChoicePrompt(state, {
          choiceKind: "costPayment",
          seat: command.seat,
          label: `${cardName(getCardForInstance(state, command.attackerId))} attack cost: trash ${handTrashAmount} card(s) from hand.`,
          details: `Choose ${handTrashAmount} card(s) to trash from hand before attacking.`,
          sourceCardId: getInstance(state, command.attackerId).cardId,
          sourceInstanceId: command.attackerId,
          eventId: null,
          options: candidateIds.map((instanceId) => ({
            id: instanceId,
            label: cardName(getCardForInstance(state, instanceId)),
            value: instanceId,
            targetId: instanceId,
          })),
          minSelections: handTrashAmount,
          maxSelections: handTrashAmount,
          context: { cost: "trashFromHand" },
          resolutionContext: {
            intent: "battleAttackHandTrashCost",
            attackerId: command.attackerId,
            targetId: command.targetId,
            controller: command.seat,
            amount: handTrashAmount,
            candidateIds,
          },
        });
      } else {
        beginAttack(state, command.seat, command.attackerId, command.targetId);
      }
      accepted = true;
      break;
    }
    case "activateEffect": {
      const legality = canActivateEffect(
        state,
        command.seat,
        command.sourceInstanceId,
        command.trigger,
        command.trashHandIds,
      );
      if (!legality.ok) {
        reason = legality.reason;
        break;
      }
      const enqueued = enqueueEffectsForTrigger(
        state,
        command.sourceInstanceId,
        command.seat,
        command.trigger,
        command.trashHandIds,
      );
      if (enqueued === 0) {
        reason = "This effect has already been used this turn.";
        break;
      }
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
