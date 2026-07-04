import type { Action, Cost } from "@tcg/op-types";
import {
  cardName,
  effectBlocksFor,
  emitEvent,
  emitLog,
  enqueueResolution,
  getCardForInstance,
  getInstance,
  getPlayer,
  recordCapabilityIssue,
  otherSeat,
} from "../shared.ts";
import {
  addDonFromDeck,
  addModifier,
  createChoicePrompt,
  drawCards,
  enqueueJudgePrompt,
  formatCardList,
  moveCard,
} from "../state.ts";
import type { MatchSeat, MatchState, PromptOption } from "../types.ts";
import { candidatePoolForTarget, candidatesForTarget, matchesTargetFilter } from "./targeting.ts";

function promptForTargetSelection(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Action,
  candidateIds: string[],
) {
  const options: PromptOption[] = candidateIds.map((instanceId) => ({
    id: instanceId,
    label: cardName(getCardForInstance(state, instanceId)),
    value: instanceId,
    targetId: instanceId,
  }));
  const sourceCard = getCardForInstance(state, sourceInstanceId);
  createChoicePrompt(state, {
    choiceKind: "selectTargets",
    seat: controller,
    label: `${cardName(sourceCard)} needs a target`,
    details: "Choose valid targets to continue resolving the effect.",
    sourceCardId: sourceCard.id,
    sourceInstanceId,
    eventId: null,
    options,
    minSelections: 1,
    maxSelections: options.length,
    context: {
      action: action.action,
    },
    resolutionContext: {
      intent: "effectTargetSelection",
      sourceInstanceId,
      controller,
      action,
    },
  });
}

function resolveActionTargets(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Action,
  selectedTargetIds: string[] | undefined,
): string[] | null | "prompt" {
  if (!("target" in action) || !action.target || selectedTargetIds) {
    return selectedTargetIds ?? [];
  }

  const targetIds = candidatesForTarget(state, controller, sourceInstanceId, action.target);
  if (targetIds === null) {
    const candidateSeat = action.target.player === "self" ? controller : otherSeat(controller);
    const candidatePlayer = getPlayer(state, candidateSeat);
    const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
    const candidateIds = pool.supported
      ? pool.candidateIds
      : [
          candidatePlayer.leaderInstanceId,
          ...candidatePlayer.characterArea.filter((entry): entry is string => Boolean(entry)),
          ...(candidatePlayer.stageArea ? [candidatePlayer.stageArea] : []),
          ...candidatePlayer.hand,
          ...candidatePlayer.trash,
          ...candidatePlayer.life,
          ...candidatePlayer.deck,
        ];
    promptForTargetSelection(state, controller, sourceInstanceId, action, candidateIds);
    return "prompt";
  }

  return targetIds;
}

export function processEffectAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Action,
  selectedTargetIds?: string[],
): boolean {
  switch (action.action) {
    case "draw":
      drawCards(
        state,
        action.player === "self" ? controller : otherSeat(controller),
        action.amount,
        `${cardName(getCardForInstance(state, sourceInstanceId))} resolves`,
      );
      return true;
    case "trashFromHand": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const player = getPlayer(state, seat);
      const pool = action.filters
        ? player.hand.filter((instanceId) =>
            action.filters!.every((filter) => {
              const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
              return result.supported && result.matches;
            }),
          )
        : player.hand;
      if (pool.length < action.amount) {
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: trash from hand",
          `${cardName(getCardForInstance(state, sourceInstanceId))} needs ${action.amount} card(s) trashed from hand.`,
        );
        return false;
      }
      const selected = pool.slice(0, action.amount);
      for (const instanceId of selected) {
        moveCard(state, instanceId, seat, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
          visibility: "private",
        });
      }
      emitLog(
        state,
        controller,
        `${getPlayer(state, seat).playerName} trashes ${selected.length} card${selected.length === 1 ? "" : "s"} from hand.`,
        {
          visibility: "private",
          privateMessages: {
            [seat]: `You trashed ${formatCardList(state, selected)}.`,
          },
          judgeMessage: `${getPlayer(state, seat).playerName} trashes ${formatCardList(state, selected)} from hand.`,
        },
      );
      return true;
    }
    case "revealFromHand": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const player = getPlayer(state, seat);
      const selected = player.hand.slice(0, action.amount);
      emitLog(
        state,
        controller,
        `${getPlayer(state, seat).playerName} reveals ${selected.length} card${selected.length === 1 ? "" : "s"} from hand.`,
        {
          visibility: "private",
          privateMessages: {
            [seat]: `You revealed ${formatCardList(state, selected)}.`,
          },
          judgeMessage: `${getPlayer(state, seat).playerName} reveals ${formatCardList(state, selected)} from hand.`,
        },
      );
      return true;
    }
    case "modifyPower": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "power",
          value: action.value,
          duration: action.duration,
          expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      return true;
    }
    case "grantKeyword": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "keyword",
          keyword: action.keyword,
          duration: action.duration,
          expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      return true;
    }
    case "ko": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        const target = getInstance(state, targetId);
        const owner = target.owner;
        if (target.attachedDon > 0) {
          getPlayer(state, owner).restedDon += target.attachedDon;
          target.attachedDon = 0;
        }
        moveCard(state, targetId, owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
        });
      }
      return true;
    }
    case "rest": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        getInstance(state, targetId).rested = true;
      }
      return true;
    }
    case "setActive": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        getInstance(state, targetId).rested = false;
      }
      return true;
    }
    case "returnToHand": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        const target = getInstance(state, targetId);
        if (target.attachedDon > 0) {
          getPlayer(state, target.owner).restedDon += target.attachedDon;
          target.attachedDon = 0;
        }
        moveCard(state, targetId, target.owner, "hand", {
          faceUp: false,
          publicKnowledge: false,
          actor: controller,
        });
      }
      return true;
    }
    case "returnToDeck": {
      if (action.position === "any") {
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: return to deck position",
          "The effect can place cards in any deck position.",
        );
        return false;
      }
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        const target = getInstance(state, targetId);
        moveCard(state, targetId, target.owner, "deck", {
          deckPosition: action.position,
          faceUp: false,
          publicKnowledge: false,
          actor: controller,
        });
      }
      return true;
    }
    case "addDon":
      if (action.count.amount === "all") {
        addDonFromDeck(
          state,
          controller,
          getPlayer(state, controller).donDeckCount,
          action.state === "rested",
        );
        return true;
      }
      addDonFromDeck(state, controller, action.count.amount, action.state === "rested");
      return true;
    case "giveDon": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (
        targetIds === "prompt" ||
        !targetIds ||
        targetIds.length !== 1 ||
        action.count.amount === "all"
      ) {
        return false;
      }
      const amount = action.count.amount;
      const player = getPlayer(state, controller);
      if (action.donState === "rested") {
        if (player.restedDon < amount) {
          enqueueJudgePrompt(
            state,
            sourceInstanceId,
            "Judge review: rested DON!! source",
            "Not enough rested DON!! is available.",
          );
          return false;
        }
        player.restedDon -= amount;
      } else {
        if (player.activeDon < amount) {
          enqueueJudgePrompt(
            state,
            sourceInstanceId,
            "Judge review: active DON!! source",
            "Not enough active DON!! is available.",
          );
          return false;
        }
        player.activeDon -= amount;
      }
      getInstance(state, targetIds[0]!).attachedDon += amount;
      return true;
    }
    case "trashFromField": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        const target = getInstance(state, targetId);
        moveCard(state, targetId, target.owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
        });
      }
      return true;
    }
    case "trashThisCard": {
      const source = getInstance(state, sourceInstanceId);
      moveCard(state, sourceInstanceId, source.owner, "trash", {
        faceUp: true,
        publicKnowledge: true,
        actor: controller,
      });
      return true;
    }
    case "turnLifeFaceDown": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      for (const instanceId of getPlayer(state, seat).life) {
        getInstance(state, instanceId).faceUp = false;
      }
      return true;
    }
    case "activateEffect": {
      const card = getCardForInstance(state, sourceInstanceId);
      const blocks = effectBlocksFor(card, action.effectTrigger);
      for (const [blockIndex] of blocks.entries()) {
        enqueueResolution(state, {
          kind: "effectBlock",
          sourceInstanceId,
          controller,
          trigger: action.effectTrigger,
          blockIndex,
        });
      }
      return true;
    }
    case "winGame":
      state.status = "finished";
      state.phase = "finished";
      state.winner = controller;
      emitEvent(state, "winnerDeclared", controller, {
        data: {
          winner: controller,
        },
      });
      emitLog(state, controller, `${getPlayer(state, controller).playerName} wins the match.`, {
        visibility: "public",
      });
      return true;
    case "play":
    case "search":
    case "setPower":
    case "modifyCost":
    case "negateEffects":
    case "cannotAttack":
    case "cannotBeKod":
    case "cannotBeRemoved":
    case "cannotActivate":
    case "canAttackActive":
    case "addToLife":
    case "removeFromLife":
    case "attackRestriction":
    case "rearrangeDeck":
    case "trashFromDeck":
    case "freeze":
    case "playRestriction":
    case "opponentReturnDon":
    case "choice":
    case "extraTurn":
    case "dealDamage":
    case "redistributeDon":
    case "cannotBeRested":
    case "revealFromLife":
      recordCapabilityIssue(state, {
        kind: "unsupportedAction",
        code: `action:${action.action}`,
        actor: controller,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        details: `${cardName(getCardForInstance(state, sourceInstanceId))} uses ${action.action}, which is not automated yet.`,
      });
      enqueueJudgePrompt(
        state,
        sourceInstanceId,
        "Judge review: unsupported action",
        `${cardName(getCardForInstance(state, sourceInstanceId))} uses ${action.action}, which is not automated yet.`,
      );
      return false;
  }
}

export function canPayCosts(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  costs: Cost[] | undefined,
  trashHandIds: string[] | undefined,
): boolean {
  if (!costs?.length) {
    return true;
  }

  for (const cost of costs) {
    switch (cost.cost) {
      case "restDon":
        if (getPlayer(state, controller).activeDon < cost.amount) {
          return false;
        }
        break;
      case "returnDon":
        if (
          getPlayer(state, controller).activeDon + getPlayer(state, controller).restedDon <
          cost.amount
        ) {
          return false;
        }
        break;
      case "restThisCard":
        if (getInstance(state, sourceInstanceId).rested) {
          return false;
        }
        break;
      case "trashThisCard":
        break;
      case "trashFromHand":
        if (trashHandIds?.length === cost.amount) {
          break;
        }
        if (getPlayer(state, controller).hand.length < cost.amount) {
          return false;
        }
        break;
      case "turnLifeFaceUp":
      case "restCards":
        return false;
    }
  }

  return true;
}

export function payCosts(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  costs: Cost[] | undefined,
  trashHandIds: string[] | undefined,
): boolean {
  if (!costs?.length) {
    return true;
  }

  if (!canPayCosts(state, controller, sourceInstanceId, costs, trashHandIds)) {
    return false;
  }

  for (const cost of costs) {
    switch (cost.cost) {
      case "restDon":
        getPlayer(state, controller).activeDon -= cost.amount;
        getPlayer(state, controller).restedDon += cost.amount;
        break;
      case "returnDon": {
        let remaining = cost.amount;
        const player = getPlayer(state, controller);
        const fromActive = Math.min(player.activeDon, remaining);
        player.activeDon -= fromActive;
        remaining -= fromActive;
        const fromRested = Math.min(player.restedDon, remaining);
        player.restedDon -= fromRested;
        player.donDeckCount += fromActive + fromRested;
        break;
      }
      case "restThisCard":
        getInstance(state, sourceInstanceId).rested = true;
        break;
      case "trashThisCard": {
        const source = getInstance(state, sourceInstanceId);
        moveCard(state, sourceInstanceId, source.owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
        });
        break;
      }
      case "trashFromHand": {
        const seat = controller;
        const player = getPlayer(state, seat);
        const selected =
          trashHandIds?.length === cost.amount ? trashHandIds : player.hand.slice(0, cost.amount);
        for (const instanceId of selected) {
          moveCard(state, instanceId, seat, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: controller,
            visibility: "private",
          });
        }
        break;
      }
      case "turnLifeFaceUp":
      case "restCards":
        return false;
    }
  }

  return true;
}
