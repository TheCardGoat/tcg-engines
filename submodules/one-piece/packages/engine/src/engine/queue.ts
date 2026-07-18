import {
  beginBattleCounterStep,
  blockerCandidates,
  completeBattleResolution,
  continueEffectDamage,
  continueLeaderDamage,
  finalizeBattleCleanup,
  finalizeBattle,
  queueBattleLifeTriggerPrompt,
} from "../battle.ts";
import { processEffectBlock, processQueuedEffectAction } from "../effects.ts";
import { processBattleEndEffects } from "../effects/resolution.ts";
import {
  cardName,
  enqueueResolution,
  getCardForInstance,
  getInstance,
  getKeywords,
  getPlayer,
  otherSeat,
} from "../shared.ts";
import {
  beginTurn,
  cleanupTurnEndModifiers,
  createChoicePrompt,
  finalizeBeginTurnRefresh,
  moveCard,
} from "../state.ts";
import type { MatchState } from "../types.ts";
import { hasPendingNonJudgePrompt } from "./shared.ts";

function queueBattleBlockChoice(state: MatchState, battleId: string) {
  const battle = state.battle;
  if (!battle || battle.id !== battleId) {
    return;
  }

  const defendingSeat = battle.defendingSeat;
  if (getKeywords(state, battle.attackerId).has("unblockable")) {
    enqueueResolution(state, { kind: "battleCounterStep", battleId });
    return;
  }
  const blockers = blockerCandidates(state, defendingSeat, battle.targetId);
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
      case "beginTurnRefreshFinalize":
        finalizeBeginTurnRefresh(state, item.seat, item.skipDraw);
        break;
      case "endTurnFinalize":
        cleanupTurnEndModifiers(state, state.turnNumber, item.seat);
        state.turnNumber += 1;
        const nextSeat = state.extraTurnSeat ?? otherSeat(item.seat);
        state.extraTurnSeat = null;
        enqueueResolution(state, {
          kind: "beginTurn",
          seat: nextSeat,
          skipDraw: false,
        });
        break;
      case "effectBlock":
        processEffectBlock(state, item);
        break;
      case "effectAction":
        processQueuedEffectAction(state, item);
        break;
      case "finalizeRevealedDeckCard": {
        const revealed = getInstance(state, item.revealedInstanceId);
        if (revealed.controller === item.owner && revealed.zone === "deck") {
          if (item.position === "choice") {
            createChoicePrompt(state, {
              choiceKind: "chooseOption",
              seat: item.controller,
              label: `${cardName(getCardForInstance(state, item.sourceInstanceId))} deck position`,
              details:
                "Choose whether to leave the revealed card at the top or bottom of the deck.",
              sourceCardId: getInstance(state, item.sourceInstanceId).cardId,
              sourceInstanceId: item.sourceInstanceId,
              eventId: null,
              options: [
                { id: "top", label: "Top of deck", value: "top" },
                { id: "bottom", label: "Bottom of deck", value: "bottom" },
              ],
              minSelections: 1,
              maxSelections: 1,
              context: { action: "revealTopDeckCard", resource: "deck" },
              resolutionContext: {
                intent: "effectRevealedDeckPosition",
                sourceInstanceId: item.sourceInstanceId,
                controller: item.controller,
                revealedInstanceId: item.revealedInstanceId,
                owner: item.owner,
              },
            });
            break;
          }
          moveCard(state, item.revealedInstanceId, item.owner, "deck", {
            deckPosition: item.position,
            faceUp: false,
            publicKnowledge: false,
            actor: item.controller,
            sourceInstanceId: item.sourceInstanceId,
            visibility: "public",
          });
        }
        break;
      }
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
      case "battleDamageContinue":
        if (state.battle?.id === item.battleId) {
          continueLeaderDamage(state);
        }
        break;
      case "battleLifeTriggerPrompt":
        if (state.battle?.id === item.battleId) {
          queueBattleLifeTriggerPrompt(state, item.battleId, item.lifeCardId);
        }
        break;
      case "battleDamageComplete":
        if (state.battle?.id === item.battleId) {
          completeBattleResolution(state);
        }
        break;
      case "battleEndEffects":
        processBattleEndEffects(state, item);
        break;
      case "battleCleanupFinalize":
        finalizeBattleCleanup(state, item.battleId);
        break;
      case "effectDamageContinue":
        continueEffectDamage(
          state,
          item.sourceInstanceId,
          item.controller,
          item.targetSeat,
          item.remaining,
        );
        break;
    }
  }

  if (hasPendingNonJudgePrompt(state)) {
    state.resolutionStatus = "waitingForPrompt";
    return;
  }

  for (const instance of Object.values(state.cards)) {
    if (instance.zone !== "resolution") {
      continue;
    }
    moveCard(state, instance.instanceId, instance.owner, "trash", {
      faceUp: true,
      publicKnowledge: true,
      actor: instance.controller,
    });
  }

  state.resolutionStatus = "idle";
}
