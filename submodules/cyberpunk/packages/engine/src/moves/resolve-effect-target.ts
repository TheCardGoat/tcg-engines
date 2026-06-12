import type { Effect } from "@tcg/cyberpunk-types";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseTargetPendingChoice } from "../types/match-state.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";
import { resolveEffect } from "../effects/handlers/index.ts";
import {
  enqueueEventTriggers,
  executeAbilityEffects,
  resumeCurrentTrigger,
} from "../ability-executor.ts";
import { buildEffectTargetActionLogDetails } from "../logging/effect-target.ts";
import { defOf } from "../state/lookups.ts";
import type { MatchState } from "../types/match-state.ts";
import type { CardInstanceId, GigDieId, PlayerId } from "../types/branded.ts";
import type { EffectTarget } from "../types/game-events.ts";

export interface ResolveEffectTargetInput extends MoveInput {
  args: {
    targetIds?: string[];
    pass?: boolean;
  };
}

const SELECTED_TARGET_BINDING = "__selectedEffectTarget";

export const resolveEffectTargetMove: MoveDefinition<ResolveEffectTargetInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      return false;
    }
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      return { valid: false, error: "No effect target pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    if (input.args.pass) {
      return choice.payload.canDecline
        ? { valid: true }
        : { valid: false, error: "Cannot pass this target choice", errorCode: "CANNOT_PASS" };
    }
    const eligible = new Set(choice.payload.eligibleIds ?? []);
    const min = choice.payload.min ?? 1;
    const max = choice.payload.max ?? 1;
    const targetIds = input.args.targetIds ?? [];
    if (targetIds.length < min || targetIds.length > max) {
      return {
        valid: false,
        error: `Must select between ${min} and ${max} target(s)`,
        errorCode: "INVALID_AMOUNT",
      };
    }
    if (new Set(targetIds).size !== targetIds.length) {
      return {
        valid: false,
        error: "Duplicate targets are not allowed",
        errorCode: "DUPLICATE_TARGETS",
      };
    }
    for (const id of targetIds) {
      if (!eligible.has(id)) {
        return { valid: false, error: "Target is not a valid choice", errorCode: "INVALID_CHOICE" };
      }
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as ChooseTargetPendingChoice;
    const payload = choice.payload;
    const effect = payload.effect;
    if (!payload.sourceCardId || !payload.sourcePlayerId) return;

    operations.game.setPendingChoice(undefined);

    const targetIds = input.args.targetIds ?? [];
    if (input.args.pass || (payload.canDecline && targetIds.length === 0)) {
      if (payload.selectedBindingId) {
        const current = state.G.turnMetadata.currentTrigger;
        if (current) {
          current.boundTargets = {
            ...current.boundTargets,
            [payload.selectedBindingId]: [],
          };
        }
      }
      if (payload.elseEffects?.length) {
        const ctx: ResolutionContext = {
          state,
          sourceCardId: payload.sourceCardId,
          sourcePlayerId: payload.sourcePlayerId,
          abilityIndex: payload.abilityIndex ?? 0,
          contextTargets: payload.contextTargets ?? {},
          boundTargets: payload.boundTargets ?? {},
        };
        const status = executeAbilityEffects(payload.elseEffects, ctx, operations);
        if (status === "suspended") return;
      }
      resumeCurrentTrigger(state, operations);
      return;
    }

    const actionLog = buildEffectTargetActionLogDetails(
      state as MatchState,
      payload.sourceCardId,
      targetIds,
      playerId,
    );
    const skipGenericTargetLog = isOrderedGigCopyTargetChoice(
      state as MatchState,
      payload,
      targetIds,
    );

    // Emit the targeting beam regardless of which resolution path runs — the
    // selectedBindingId path returns early, and a missing effectTargeted there
    // would silently skip the animation for every Program/Gear that targets
    // via a bound ability.
    const effectTargets = classifyTargets(state, targetIds);
    if (effectTargets.length > 0) {
      operations.event.emit({
        type: "effectTargeted",
        sourceCardId: payload.sourceCardId,
        targets: effectTargets,
        playerId,
      });
    }

    if (payload.selectedBindingId) {
      const current = state.G.turnMetadata.currentTrigger;
      if (current) {
        current.boundTargets = {
          ...current.boundTargets,
          [payload.selectedBindingId]: [...targetIds],
        };
      }
      if (!skipGenericTargetLog) {
        operations.event.emit({
          type: "actionLog",
          messageKey: targetResolvedMessageKey(effect),
          params: actionLog.params,
          playerId,
          category: "trigger",
          cardIds: actionLog.cardIds,
        });
      }
      resumeCurrentTrigger(state, operations);
      return;
    }

    if (!effect) return;

    const ctx: ResolutionContext = {
      state,
      sourceCardId: payload.sourceCardId,
      sourcePlayerId: payload.sourcePlayerId,
      abilityIndex: payload.abilityIndex ?? 0,
      contextTargets: payload.contextTargets ?? {},
      boundTargets: {
        ...payload.boundTargets,
        [SELECTED_TARGET_BINDING]: [...targetIds],
      },
    };

    const selectedEffect = {
      ...effect,
      target: { selector: "bound", id: SELECTED_TARGET_BINDING },
    } as Effect;

    const eventsBefore = operations.event.getEmittedEvents().length;
    resolveEffect(selectedEffect, ctx, operations);
    const eventsAfter = operations.event.getEmittedEvents();
    for (let i = eventsBefore; i < eventsAfter.length; i++) {
      const emitted = eventsAfter[i]!;
      if (
        emitted.type === "gigValueChanged" ||
        emitted.type === "legendFlipped" ||
        emitted.type === "legendCalled" ||
        emitted.type === "cardSpent"
      ) {
        enqueueEventTriggers(emitted, state, operations);
      }
    }

    if (!skipGenericTargetLog) {
      operations.event.emit({
        type: "actionLog",
        messageKey: targetResolvedMessageKey(effect),
        params: actionLog.params,
        playerId,
        category: "trigger",
        cardIds: actionLog.cardIds,
      });
    }
    if (effect.effect === "defeat") {
      operations.event.emit({
        type: "actionLog",
        messageKey: "trigger.defeatedTarget",
        params: actionLog.params,
        playerId,
        category: "trigger",
        cardIds: actionLog.cardIds,
      });
    }

    resumeCurrentTrigger(state, operations);
  },
};

function targetResolvedMessageKey(
  effect: Effect | undefined,
): "trigger.targetResolved" | "trigger.targetResolved.deckBottom" {
  if (effect?.effect === "moveCard" && effect.destination === "deckBottom") {
    return "trigger.targetResolved.deckBottom";
  }
  return "trigger.targetResolved";
}

function classifyTargets(state: MatchState, targetIds: ReadonlyArray<string>): EffectTarget[] {
  const out: EffectTarget[] = [];
  const playerIdSet = new Set<string>(state.ctx.playerIds.map((pid) => pid as string));
  for (const id of targetIds) {
    if (state.G.cardIndex[id]) {
      out.push({ kind: "card", cardId: id as CardInstanceId });
    } else if (state.G.gigDice[id]) {
      out.push({ kind: "gig", dieId: id as GigDieId });
    } else if (playerIdSet.has(id)) {
      out.push({ kind: "player", playerId: id as PlayerId });
    }
  }
  return out;
}

function isOrderedGigCopyTargetChoice(
  state: MatchState,
  payload: ChooseTargetPendingChoice["payload"],
  targetIds: ReadonlyArray<string>,
): boolean {
  if (payload.type !== "effectTarget" || payload.targetKind !== "gig" || targetIds.length !== 2) {
    return false;
  }
  const sourceCardId = payload.sourceCardId as string | undefined;
  const sourceCard = sourceCardId ? state.G.cardIndex[sourceCardId] : undefined;
  const rulesText = sourceCard ? (defOf(sourceCard).rulesText ?? "").toLowerCase() : "";
  return rulesText.includes("value of another gig");
}
