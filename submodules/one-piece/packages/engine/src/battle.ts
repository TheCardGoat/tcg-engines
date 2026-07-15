import {
  effectBlocksFor,
  cardName,
  enqueueResolution,
  emitEvent,
  emitLog,
  getCardForInstance,
  getCardPower,
  getInstance,
  getKeywords,
  getPlayer,
  hasFlagModifier,
  otherSeat,
} from "./shared.ts";
import { enqueueEffectsForTrigger } from "./effects.ts";
import {
  cleanupBattleModifiers,
  createChoicePrompt,
  enqueueJudgePrompt,
  moveCard,
} from "./state.ts";
import type { GameCommand, MatchSeat, MatchState, PromptOption } from "./types.ts";

export function beginBattleCounterStep(state: MatchState) {
  if (!state.battle) {
    return;
  }

  const defendingSeat = state.battle.defendingSeat;
  const player = getPlayer(state, defendingSeat);
  const options: PromptOption[] = player.hand.map((instanceId) => {
    const card = getCardForInstance(state, instanceId);
    const label =
      card.cardType === "character" && card.counter
        ? `${cardName(card)} (+${card.counter})`
        : effectBlocksFor(card, "counter").length > 0
          ? `${cardName(card)} (Counter)`
          : cardName(card);
    return {
      id: instanceId,
      label,
      value: instanceId,
      targetId: instanceId,
    };
  });

  if (options.length === 0) {
    return;
  }

  createChoicePrompt(state, {
    choiceKind: "selectCards",
    seat: defendingSeat,
    label: `${getPlayer(state, defendingSeat).playerName} counter step`,
    details: "Select counter cards or pass.",
    sourceCardId: getInstance(state, state.battle.attackerId).cardId,
    sourceInstanceId: state.battle.attackerId,
    eventId: state.battle.id,
    options,
    minSelections: 0,
    maxSelections: options.length,
    context: {
      battleId: state.battle.id,
    },
    resolutionContext: {
      intent: "battleCounter",
      battleId: state.battle.id,
    },
  });
}

export function finalizeBattle(state: MatchState) {
  const battle = state.battle;
  if (!battle) {
    return;
  }

  const targetId = battle.targetId;
  const target = getInstance(state, targetId);
  battle.attackPower = getCardPower(state, battle.attackerId);
  battle.defensePower = getCardPower(state, targetId) + battle.counterTotal;
  battle.step = "damage";

  if (battle.attackPower > battle.defensePower) {
    if (target.zone === "leader") {
      const defendingSeat = target.owner;
      const defender = getPlayer(state, defendingSeat);
      if (defender.life.length === 0) {
        state.status = "finished";
        state.phase = "finished";
        state.winner = otherSeat(defendingSeat);
        battle.result = "hit";
        emitEvent(state, "winnerDeclared", otherSeat(defendingSeat), {
          sourceCardId: getInstance(state, battle.attackerId).cardId,
          sourceInstanceId: battle.attackerId,
          targetIds: [targetId],
          eventId: battle.id,
          visibility: "public",
          data: {
            winner: state.winner!,
          },
        });
        emitLog(
          state,
          "system",
          `${getPlayer(state, state.winner!).playerName} wins by dealing the final damage.`,
          {
            sourceCardId: getInstance(state, battle.attackerId).cardId,
            sourceInstanceId: battle.attackerId,
            targetIds: [targetId],
            eventId: battle.id,
            visibility: "public",
          },
        );
      } else {
        const lifeCardId = defender.life.shift()!;
        moveCard(state, lifeCardId, defendingSeat, "hand", {
          faceUp: false,
          publicKnowledge: false,
        });
        battle.result = "hit";
        emitLog(state, "system", `${defender.playerName} takes 1 damage.`, {
          targetIds: [targetId],
          eventId: battle.id,
          visibility: "private",
          privateMessages: {
            [defendingSeat]: `You took ${cardName(getCardForInstance(state, lifeCardId))} from life to hand.`,
          },
          judgeMessage: `${defender.playerName} takes ${cardName(getCardForInstance(state, lifeCardId))} from life to hand.`,
        });

        const lifeCard = getCardForInstance(state, lifeCardId);
        const hasPrintedTrigger =
          (lifeCard.cardType === "character" ||
            lifeCard.cardType === "event" ||
            lifeCard.cardType === "stage") &&
          Boolean(lifeCard.trigger);
        if (hasPrintedTrigger || effectBlocksFor(lifeCard, "trigger").length > 0) {
          createChoicePrompt(state, {
            choiceKind: "confirm",
            seat: defendingSeat,
            label: `${defender.playerName} may activate a trigger`,
            details: `Resolve ${cardName(lifeCard)} from life?`,
            sourceCardId: lifeCard.id,
            sourceInstanceId: lifeCardId,
            eventId: battle.id,
            options: [
              {
                id: "activate",
                label: "Activate trigger",
                value: "activate",
              },
              {
                id: "skip",
                label: "Skip trigger",
                value: "skip",
              },
            ],
            minSelections: 0,
            maxSelections: 1,
            context: {
              battleId: battle.id,
            },
            resolutionContext: {
              intent: "lifeTrigger",
              sourceInstanceId: lifeCardId,
              controller: defendingSeat,
              trigger: "trigger",
            },
          });
        }
      }
    } else {
      const defendingSeat = target.owner;
      if (target.attachedDon > 0) {
        getPlayer(state, defendingSeat).restedDon += target.attachedDon;
        target.attachedDon = 0;
      }
      moveCard(state, targetId, defendingSeat, "trash", {
        faceUp: true,
        publicKnowledge: true,
      });
      battle.result = "ko";
      emitLog(state, "system", `${cardName(getCardForInstance(state, targetId))} is K.O.'d.`, {
        targetIds: [targetId],
        eventId: battle.id,
        visibility: "public",
      });
    }
  } else {
    battle.result = battle.blockerId ? "blocked" : "no_damage";
    emitLog(state, "system", "The attack does not deal damage.", {
      eventId: battle.id,
      visibility: "public",
    });
  }

  emitEvent(state, "battleResolved", "system", {
    sourceCardId: getInstance(state, battle.attackerId).cardId,
    sourceInstanceId: battle.attackerId,
    targetIds: [battle.targetId],
    eventId: battle.id,
    visibility: "public",
    data: {
      result: battle.result,
      attackPower: battle.attackPower,
      defensePower: battle.defensePower,
    },
  });

  cleanupBattleModifiers(state, battle.id);
  state.battle = null;
}

export function blockerCandidates(state: MatchState, seat: MatchSeat): string[] {
  return getPlayer(state, seat)
    .characterArea.filter((instanceId): instanceId is string => Boolean(instanceId))
    .filter((instanceId) => {
      const instance = getInstance(state, instanceId);
      return !instance.rested && getKeywords(state, instanceId).has("blocker");
    });
}

export function canAttackWith(state: MatchState, seat: MatchSeat, attackerId: string): boolean {
  const attacker = getInstance(state, attackerId);
  if (attacker.owner !== seat || (attacker.zone !== "leader" && attacker.zone !== "character")) {
    return false;
  }
  if (attacker.rested || hasFlagModifier(state, attackerId, "cannotAttack")) {
    return false;
  }
  if (state.turnNumber === 1 && state.activeSeat === state.config.firstPlayer) {
    return false;
  }
  if (attacker.zone === "character" && attacker.playedOnTurn === state.turnNumber) {
    const keywords = getKeywords(state, attackerId);
    if (!keywords.has("rush") && !keywords.has("rushCharacter")) {
      return false;
    }
  }
  return true;
}

export function legalAttackTargets(
  state: MatchState,
  seat: MatchSeat,
  attackerId: string,
): string[] {
  const defender = getPlayer(state, otherSeat(seat));
  const targets = [defender.leaderInstanceId];
  for (const instanceId of defender.characterArea) {
    if (!instanceId) {
      continue;
    }
    const target = getInstance(state, instanceId);
    if (target.rested || hasFlagModifier(state, attackerId, "canAttackActive")) {
      targets.push(instanceId);
    }
  }
  return targets;
}

export function resolvePrompt(
  state: MatchState,
  command: Extract<GameCommand, { type: "resolvePrompt" }>,
): boolean {
  const prompt = state.promptQueue.find((candidate) => candidate.id === command.promptId);
  if (!prompt || prompt.seat !== command.seat) {
    return false;
  }

  switch (prompt.resolutionContext?.intent) {
    case "battleBlocker": {
      const battle = state.battle;
      if (!battle) {
        return true;
      }
      const blockerId = command.optionId && command.optionId !== "skip" ? command.optionId : null;
      if (blockerId) {
        battle.blockerId = blockerId;
        battle.targetId = blockerId;
        getInstance(state, blockerId).rested = true;
        emitLog(
          state,
          command.seat,
          `${cardName(getCardForInstance(state, blockerId))} blocks the attack.`,
          {
            targetIds: [blockerId],
            eventId: battle.id,
            visibility: "public",
          },
        );
      } else {
        emitLog(
          state,
          command.seat,
          `${getPlayer(state, command.seat).playerName} declines to block.`,
          {
            eventId: battle.id,
            visibility: "public",
          },
        );
      }
      battle.step = "counter";
      enqueueResolution(state, {
        kind: "battleCounterStep",
        battleId: battle.id,
      });
      return true;
    }
    case "battleCounter": {
      const battle = state.battle;
      if (!battle) {
        return true;
      }
      const selectedIds = command.selectedIds ?? [];
      let counterTotal = 0;

      for (const instanceId of selectedIds) {
        const card = getCardForInstance(state, instanceId);
        if (card.cardType === "character" && card.counter) {
          counterTotal += card.counter;
          moveCard(state, instanceId, command.seat, "trash", {
            faceUp: true,
            publicKnowledge: true,
          });
        } else if (effectBlocksFor(card, "counter").length > 0) {
          moveCard(state, instanceId, command.seat, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: command.seat,
          });
          enqueueEffectsForTrigger(state, instanceId, command.seat, "counter", undefined);
        } else {
          enqueueJudgePrompt(
            state,
            instanceId,
            "Judge review: invalid counter card",
            `${cardName(card)} cannot be used as a counter here.`,
          );
        }
      }

      battle.counterCardIds = selectedIds;
      battle.counterTotal += counterTotal;
      enqueueResolution(state, {
        kind: "battleFinalize",
        battleId: battle.id,
      });
      return true;
    }
    case "lifeTrigger": {
      if (command.optionId === "activate" && prompt.sourceInstanceId) {
        enqueueEffectsForTrigger(
          state,
          prompt.sourceInstanceId,
          command.seat,
          "trigger",
          undefined,
        );
      } else {
        emitLog(
          state,
          command.seat,
          `${getPlayer(state, command.seat).playerName} skips the trigger.`,
          {
            sourceCardId: prompt.sourceCardId,
            sourceInstanceId: prompt.sourceInstanceId,
            visibility: "public",
          },
        );
      }
      return true;
    }
    case "judge":
      emitLog(state, "judge", command.note ?? "Judge acknowledged the prompt.", {
        sourceCardId: prompt.sourceCardId,
        sourceInstanceId: prompt.sourceInstanceId,
        visibility: "judge",
        judgeMessage: command.note ?? "Judge acknowledged the prompt.",
      });
      return true;
    default:
      return true;
  }
}
