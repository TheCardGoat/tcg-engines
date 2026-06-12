import { beginBattleCounterStep, blockerCandidates, finalizeBattle } from "../battle.ts";
import { processEffectBlock, processQueuedEffectAction } from "../effects.ts";
import {
  cardName,
  enqueueResolution,
  getCardForInstance,
  getInstance,
  getPlayer,
} from "../shared.ts";
import { beginTurn, createChoicePrompt } from "../state.ts";
import type { MatchState } from "../types.ts";
import { hasPendingNonJudgePrompt } from "./shared.ts";

function queueBattleBlockChoice(state: MatchState, battleId: string) {
  const battle = state.battle;
  if (!battle || battle.id !== battleId) {
    return;
  }

  const defendingSeat = battle.defendingSeat;
  const blockers = blockerCandidates(state, defendingSeat);
  if (blockers.length === 0) {
    enqueueResolution(state, {
      kind: "battleCounterStep",
      battleId,
    });
    return;
  }

  createChoicePrompt(state, {
    choiceKind: "selectCards",
    seat: defendingSeat,
    label: `${getPlayer(state, defendingSeat).playerName} may block`,
    details: "Select a blocker or skip.",
    sourceCardId: getInstance(state, battle.attackerId).cardId,
    sourceInstanceId: battle.attackerId,
    eventId: battle.id,
    options: [
      {
        id: "skip",
        label: "No block",
        value: "skip",
      },
      ...blockers.map((instanceId) => ({
        id: instanceId,
        label: cardName(getCardForInstance(state, instanceId)),
        value: instanceId,
        targetId: instanceId,
      })),
    ],
    minSelections: 0,
    maxSelections: 1,
    context: {
      battleId,
    },
    resolutionContext: {
      intent: "battleBlocker",
      battleId,
    },
  });
}

export function drainResolutionQueue(state: MatchState) {
  state.resolutionStatus = "running";

  while (state.resolutionQueue.length > 0) {
    if (hasPendingNonJudgePrompt(state)) {
      state.resolutionStatus = "waitingForPrompt";
      return;
    }

    const item = state.resolutionQueue.shift()!;
    switch (item.kind) {
      case "beginTurn":
        beginTurn(state, item.seat, item.skipDraw);
        break;
      case "effectBlock":
        processEffectBlock(state, item);
        break;
      case "effectAction":
        processQueuedEffectAction(state, item);
        break;
      case "battleBlockStep":
        queueBattleBlockChoice(state, item.battleId);
        break;
      case "battleCounterStep": {
        beginBattleCounterStep(state);
        const battle = state.battle;
        if (battle && battle.id === item.battleId && !hasPendingNonJudgePrompt(state)) {
          enqueueResolution(state, {
            kind: "battleFinalize",
            battleId: item.battleId,
          });
        }
        break;
      }
      case "battleFinalize":
        if (state.battle?.id === item.battleId) {
          finalizeBattle(state);
        }
        break;
    }
  }

  state.resolutionStatus = "idle";
}
