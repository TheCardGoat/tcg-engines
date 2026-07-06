import { getCard } from "../../../cards/src/runtime-catalog.ts";
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
import type { EngineCommand, JoKenPoChoice, MatchSeat, MatchState } from "../types.ts";
import { handlePlayerPromptResolution } from "./prompt.ts";
import { hasPendingNonJudgePrompt } from "./shared.ts";

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
      if (state.status !== "setup" || state.setup.started) {
        reason = "The first turn can only be chosen during setup.";
        break;
      }
      if (state.setup.joKenPo.winner !== command.seat) {
        reason = "Only the Jo Ken Po winner can choose who takes the first turn.";
        break;
      }
      if (state.setup.joKenPo.firstPlayerDecided) {
        reason = "The first turn has already been chosen.";
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
      if (state.status !== "setup" || state.setup.started) {
        reason = "Mulligan is only available during setup.";
        break;
      }
      if (!state.setup.joKenPo.firstPlayerDecided) {
        reason = "Resolve Jo Ken Po and choose the first player before mulligan.";
        break;
      }
      const player = getPlayer(state, command.seat);
      if (state.setup.mulliganDecided[command.seat]) {
        reason = "This player already made a mulligan choice.";
        break;
      }
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
      if (state.status !== "setup" || state.setup.started) {
        reason = "Opening hand choices are only available during setup.";
        break;
      }
      if (!state.setup.joKenPo.firstPlayerDecided) {
        reason = "Resolve Jo Ken Po and choose the first player before mulligan.";
        break;
      }
      if (state.setup.mulliganDecided[command.seat]) {
        reason = "This player already made a mulligan choice.";
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
    case "startGame":
      if (state.status !== "setup" || state.setup.started) {
        reason = "The match has already started.";
        break;
      }
      if (command.seat !== state.config.firstPlayer) {
        reason = "Only the first player can start the match in this draft.";
        break;
      }
      if (!state.setup.mulliganDecided.north || !state.setup.mulliganDecided.south) {
        reason = "Both players must choose whether to take a mulligan before starting.";
        break;
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
