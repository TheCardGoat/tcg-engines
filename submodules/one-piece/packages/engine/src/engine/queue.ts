import { delayedActionChain, rebindDelayedPrevious } from "../effects/delayed-identity.ts";
import { continueSimultaneousStateChange } from "../effects/actions.ts";
import { settleContinuousCosts } from "./continuous-cost.ts";
import { advanceStartOfGameEffects } from "./setup-effects.ts";
import { withEffectTriggerEvent } from "../effects/trigger-context.ts";
import { prepareReadyEffect } from "./ready-effects.ts";
import { withReplacementProcess } from "../effects/replacement-process.ts";
import { observeOptionalLoop } from "./optional-loop.ts";
import { MandatoryLoopDetector } from "./mandatory-loop.ts";
import { finalizeDraw } from "../state.ts";
import {
  beginBattleCounterStep,
  blockerCandidates,
  completeBattleResolution,
  continueEffectDamage,
  continueLeaderDamage,
  endBattleIfParticipantLeftArea,
  finalizeBattleCleanup,
  finalizeBattle,
  queueBattleLifeTriggerPrompt,
} from "../battle.ts";
import { processEffectBlock, processQueuedEffectAction } from "../effects.ts";
import {
  completeRemovalCostPayment,
  continueRestCostPayment,
  processBattleEndEffects,
  resolveEffectAfterCosts,
} from "../effects/resolution.ts";
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
  promptForLifeReplacementOrder,
  beginTurn,
  cleanupTurnEndModifiers,
  createChoicePrompt,
  finalizeBeginTurnRefresh,
  moveCard,
  processEmptyDeckDefeat,
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
    label: `${getPlayer(state, defendingSeat).playerName} may block the attack.`,
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

// A rule defeat can finish the match inside an action (for example, drawing
// the last deck card). Do not resolve the remaining action or auto-effect queue.
function stopFinishedResolution(state: MatchState): boolean {
  if (state.status !== "finished") return false;
  state.resolutionQueue = [];
  state.pendingAutoEffects = undefined;
  state.readyEffectGroup = undefined;
  state.effectResolving = undefined;
  state.optionalLoopEvidence = undefined;
  state.optionalLoopPlan = undefined;
  state.battle = null;
  for (const prompt of state.promptQueue) {
    if (prompt.status === "pending") prompt.status = "cancelled";
  }
  state.resolutionStatus = "idle";
  return true;
}

export function drainResolutionQueue(state: MatchState) {
  if (stopFinishedResolution(state)) return;
  if (!settleContinuousCosts(state)) return;
  state.resolutionStatus = "running";
  const loopDetector = new MandatoryLoopDetector();

  while (
    state.resolutionQueue.length > 0 ||
    state.pendingAutoEffects?.length ||
    state.readyEffectGroup
  ) {
    if (stopFinishedResolution(state)) return;
    if (hasPendingNonJudgePrompt(state)) {
      state.resolutionStatus = "waitingForPrompt";
      return;
    }

    if (!settleContinuousCosts(state)) return;

    // An activated block and all its payment/action continuations finish before
    // another auto effect can activate. Freshly fulfilled effects form the next
    // group only after both controllers exhaust the original ready group.
    if (
      !state.effectResolving &&
      ![
        "effectBlock",
        "effectAfterCostSettlement",
        "battleLifeTriggerPrompt",
        "battleDamageContinue",
        "effectDamageContinue",
      ].includes(state.resolutionQueue[0]?.kind ?? "")
    ) {
      prepareReadyEffect(state);
      if (hasPendingNonJudgePrompt(state)) {
        state.resolutionStatus = "waitingForPrompt";
        return;
      }
    }
    if (!state.resolutionQueue.length) continue;

    // Audit every intervening transition; fulfilled optional boundaries are
    // observed by processEffectBlock after its activation checks.
    observeOptionalLoop(state);

    if (loopDetector.repeats(state)) {
      finalizeDraw(state);
      stopFinishedResolution(state);
      return;
    }

    const item = state.resolutionQueue.shift()!;
    switch (item.kind) {
      case "effectAfterCostSettlement":
        resolveEffectAfterCosts(state, item.continuation, item.block);
        break;
      case "startOfGameContinue":
        advanceStartOfGameEffects(state);
        break;
      case "beginTurn":
        beginTurn(state, item.seat, item.skipDraw);
        break;
      case "beginTurnRefreshFinalize":
        finalizeBeginTurnRefresh(state, item.seat, item.skipDraw);
        break;
      case "endTurnFinalize":
        // 6-2-3-1 variants: a deferred deck-empty defeat resolves once the
        // turn in which the deck reached 0 cards ends. All end-of-turn
        // effects have resolved by this point. A recorded deferred defeat
        // still applies if an effect refilled the deck before turn end.
        for (const seat of [item.seat, otherSeat(item.seat)] as const) {
          if (state.status !== "active") break;
          processEmptyDeckDefeat(state, seat, true);
        }
        if (state.status === "finished") break;
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
      case "effectMovementComplete": {
        const next = state.resolutionQueue[0];
        if (
          next?.kind === "effectAction" &&
          next.sourceInstanceId === item.sourceInstanceId &&
          next.controller === item.controller &&
          delayedActionChain(next.action) === item.delayedActionChainId
        ) {
          next.previousActionTargetIds = item.movedIds;
          next.action = rebindDelayedPrevious(state, next.action, item.movedIds);
        }
        promptForLifeReplacementOrder(state, item.replacedLifeCards ?? []);
        break;
      }
      case "effectKoComplete":
        if (item.successfulTargetIds.length > 0) {
          for (const action of [...item.actions].reverse()) {
            // A source leaving does not stop an effect already resolving. Only
            // a follow-up bound to "this card" must reject a new physical object.
            if (
              "target" in action &&
              action.target?.self &&
              getInstance(state, item.sourceInstanceId).zoneChangeCounter !==
                item.sourceZoneChangeCounter
            )
              continue;
            enqueueResolution(
              state,
              {
                kind: "effectAction",
                effectTriggerEvent: item.effectTriggerEvent,
                sourceInstanceId: item.sourceInstanceId,
                controller: item.controller,
                action: rebindDelayedPrevious(state, action, item.successfulTargetIds),
                previousActionTargetIds: item.successfulTargetIds,
              },
              { next: true },
            );
          }
        }
        break;
      case "effectRestCostContinue":
        withReplacementProcess(state, item.replacementProcess, () =>
          withEffectTriggerEvent(
            state,
            item.effectTriggerEvent ?? item.process.continuation.triggerEvent,
            () => continueRestCostPayment(state, item.process),
          ),
        );
        break;
      case "effectRemovalCostComplete":
        completeRemovalCostPayment(state, item);
        break;
      case "effectComplete":
        state.effectResolving = undefined;
        break;
      case "effectBlock":
        if (!state.effectResolving) {
          state.effectResolving = true;
          enqueueResolution(state, { kind: "effectComplete" }, { next: true });
        }
        processEffectBlock(state, item);
        break;
      case "effectStateChangeContinue":
        withReplacementProcess(state, item.replacementProcess, () =>
          withEffectTriggerEvent(
            state,
            item.effectTriggerEvent ?? item.process.effectTriggerEvent,
            () => continueSimultaneousStateChange(state, item.process),
          ),
        );
        break;
      case "effectAction":
        withReplacementProcess(state, item.replacementProcess, () =>
          withEffectTriggerEvent(state, item.effectTriggerEvent, () =>
            processQueuedEffectAction(state, item),
          ),
        );
        break;
      case "finalizeRevealedDeckCard": {
        const revealed = getInstance(state, item.revealedInstanceId);
        if (revealed.controller === item.owner && revealed.zone === "deck") {
          if (item.position === "choice") {
            createChoicePrompt(state, {
              choiceKind: "chooseOption",
              seat: item.controller,
              label: `${cardName(getCardForInstance(state, item.sourceInstanceId))} deck position.`,
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
        if (state.battle?.id === item.battleId && endBattleIfParticipantLeftArea(state)) {
          break;
        }
        queueBattleBlockChoice(state, item.battleId);
        break;
      case "battleCounterStep": {
        if (state.battle?.id === item.battleId && endBattleIfParticipantLeftArea(state)) {
          break;
        }
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
          queueBattleLifeTriggerPrompt(
            state,
            item.battleId,
            item.lifeCardId,
            item.lifeCountAfterRemoval,
          );
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

  if (stopFinishedResolution(state)) return;
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

  if (!settleContinuousCosts(state)) return;
  state.optionalLoopEvidence = undefined;
  state.resolutionStatus = "idle";
}
