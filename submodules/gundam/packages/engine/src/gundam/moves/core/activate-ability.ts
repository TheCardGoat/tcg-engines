/**
 * Activate Ability Move
 *
 * Activates a card's "Activated" CardEffect (those with timing "Activate:Main"
 * or "Activate:Action"), paying its cost and executing its steps.
 */

import type { Card, CardEffect, EffectCondition, TargetFilter } from "@tcg/gundam-types";
import type { GundamMoveDefinition, GundamCardMeta, PendingEffect } from "../../types.ts";
import {
  getActivatedEffects,
  getAvailableResources,
  buildTargetResolutionContext,
  isLinkUnit,
} from "../../rules/derived-state.ts";
import { evaluateCondition, evaluateTargetFilter } from "../../../runtime/target-dsl.ts";
import { gatherAllCardsForTargeting } from "../../effects/target-legality.ts";
import { countPayableDiscardCostCards, payCost } from "./play-card-shared.ts";
import { resetActionStepOnAction } from "./action-step-reset.ts";
import {
  enqueuePendingEffect,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
  evaluateLegalTargets,
  nextPendingEffectId,
} from "../../effects/pending-effects.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";
import { rejectWithKey } from "./validation-error.ts";

export const activateAbility: GundamMoveDefinition<"activateAbility"> = {
  gatedByPendingEffects: true,

  describeProcedure({ G, playerId: _playerId, partialInput, framework }) {
    const g = G;
    const cardId = (partialInput as { cardId?: string }).cardId;
    if (!cardId) return [];

    const phase = framework.state.status.phase;
    const step = framework.state.status.step;
    const isMain = phase === "main-phase";
    const isAction = phase === "end-phase" && step === "action-step";
    const activated = getActivatedEffects(cardId, g, framework.cards);

    const usableIndices: number[] = [];
    activated.forEach((effect, idx) => {
      const timing = (effect.activation.timing ?? []) as string[];
      const validInPhase =
        (timing.includes("activate:main") && isMain) ||
        (timing.includes("activate:action") && (isAction || isMain));
      if (validInPhase) usableIndices.push(idx);
    });

    if (usableIndices.length === 0) return [];

    if ((partialInput as { effectIndex?: number }).effectIndex === undefined) {
      // Always surface the effect picker (even with a single option) so the
      // UI always has a concrete `effectIndex` to dispatch. `validate()`
      // destructures `args.effectIndex` and rejects undefined, so
      // returning `confirm` here would leave the UI unable to construct a
      // legal command envelope.
      return [
        {
          kind: "selectMode",
          modes: usableIndices.map((idx) => ({
            id: String(idx),
            label:
              (activated[idx] as unknown as { sourceText?: string }).sourceText ?? `Effect #${idx}`,
          })),
        },
      ];
    }

    return [];
  },

  enumerateCandidates({ G, playerId, framework }) {
    const phase = framework.state.status.phase;
    const step = framework.state.status.step;
    const isMain = phase === "main-phase";
    const isAction = phase === "end-phase" && step === "action-step";
    if (!isMain && !isAction) return [];

    const g = G;
    const zones = ["battleArea", "baseSection"] as const;
    const out: string[] = [];
    for (const zone of zones) {
      const ids = framework.zones.getCards({ zone, playerId });
      for (const cardId of ids) {
        const activated = getActivatedEffects(cardId, g, framework.cards);
        const hasUsable = activated.some((effect) => {
          const timing = (effect.activation.timing ?? []) as string[];
          if (timing.includes("activate:main") && isMain) return true;
          if (timing.includes("activate:action") && (isAction || isMain)) return true;
          return false;
        });
        if (hasUsable) out.push(cardId);
      }
    }
    return out;
  },

  validate({ G, playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };
    const g = G;
    const { cardId, effectIndex, targets } = args;

    if (!framework.cards.getDefinition(cardId)) {
      return { valid: false, error: "Card not found", errorCode: "UNKNOWN_CARD" };
    }

    // `getActivatedEffects` returns printed activated effects plus
    // keyword-synthesised ones (<Support N>) — see rules/derived-state.ts.
    const activatedEffects = getActivatedEffects(cardId, g, framework.cards);
    const effect = activatedEffects[effectIndex];
    if (!effect) {
      return { valid: false, error: "Activated effect not found", errorCode: "INVALID_EFFECT" };
    }

    // Phase check
    const phase = framework.state.status.phase;
    const timing = (effect.activation.timing ?? []) as string[];
    const validInPhase =
      (timing.includes("activate:main") && phase === "main-phase") ||
      (timing.includes("activate:action") &&
        ((phase === "end-phase" && framework.state.status.step === "action-step") ||
          phase === "main-phase"));

    if (!validInPhase) {
      return {
        valid: false,
        error: "This ability cannot be activated in the current phase",
        errorCode: "WRONG_PHASE",
      };
    }

    // duringLink / duringPair gate: if the timing array includes a
    // continuous qualifier the card must currently satisfy it.
    if (timing.includes("duringLink")) {
      if (!isLinkUnit(cardId, g, framework.cards)) {
        return {
          valid: false,
          error: "This ability requires the unit to be a Link Unit",
          errorCode: "NOT_LINKED",
        };
      }
    }
    if (timing.includes("duringPair")) {
      if (!(cardId in g.pilotAssignments)) {
        return {
          valid: false,
          error: "This ability requires the unit to have a paired pilot",
          errorCode: "NOT_PAIRED",
        };
      }
    }

    // activation.conditions gate (e.g. "If your opponent has 8+ cards")
    if (effect.activation.conditions && effect.activation.conditions.length > 0) {
      const tgtCtx = buildTargetResolutionContext(g, playerId, framework, {
        sourceCardId: cardId,
      });
      for (const cond of effect.activation.conditions) {
        if (!evaluateCondition(cond as EffectCondition, tgtCtx)) {
          return {
            valid: false,
            error: "Activation conditions are not met",
            errorCode: "CONDITIONS_NOT_MET",
          };
        }
      }
    }

    const cost = effect.cost;

    // Cost: rest self
    if (cost?.restSelf) {
      const meta = framework.cards.getMeta(cardId) as GundamCardMeta | undefined;
      if (meta?.exhausted || g.exhausted[cardId]) {
        return rejectWithKey("gundam.error.ability.cardExhausted", {}, "CARD_EXHAUSTED");
      }
    }

    // Cost: pay resources
    if (cost?.payResources !== undefined) {
      const available = getAvailableResources(playerId, g, framework);
      if (available < cost.payResources) {
        return rejectWithKey(
          "gundam.error.play.insufficientResources",
          { required: cost.payResources, have: available },
          "INSUFFICIENT_RESOURCES",
        );
      }
    }

    if (cost?.discardCount) {
      const payable = countPayableDiscardCostCards(cost, cardId, playerId, g, framework);
      if (payable < cost.discardCount) {
        return {
          valid: false,
          error: "No matching card in hand to discard for cost",
          errorCode: "COST_NOT_PAYABLE",
        };
      }
    }

    if (cost?.exileFromTrash) {
      const tgtCtx = buildTargetResolutionContext(g, playerId, framework, {
        sourceCardId: cardId,
      });
      const filter: TargetFilter = { ...cost.exileFromTrash, zone: "trash" };
      const candidates = evaluateTargetFilter(filter, gatherAllCardsForTargeting(tgtCtx), tgtCtx);
      if (candidates.length === 0) {
        return {
          valid: false,
          error: "No matching card in trash to exile for cost",
          errorCode: "COST_NOT_PAYABLE",
        };
      }
    }

    if (cost?.restTarget) {
      const tgtCtx = buildTargetResolutionContext(g, playerId, framework, {
        sourceCardId: cardId,
      });
      const candidates = evaluateTargetFilter(
        cost.restTarget,
        gatherAllCardsForTargeting(tgtCtx),
        tgtCtx,
      );
      if (candidates.length === 0) {
        return {
          valid: false,
          error: "No matching card to rest for cost",
          errorCode: "COST_NOT_PAYABLE",
        };
      }
    }

    // Once per turn
    if (effect.activation.restrictions?.some((r) => r.type === "oncePerTurn")) {
      const meta = framework.cards.getMeta(cardId) as GundamCardMeta | undefined;
      const uses = (meta?.abilityUsesThisTurn ?? {})[String(effectIndex)] ?? 0;
      if (uses >= 1) {
        return {
          valid: false,
          error: "Ability already used this turn",
          errorCode: "ABILITY_LIMIT_REACHED",
        };
      }
    }

    // Target validation (rule 10-3-3): reject illegal / miscounted / duplicate
    // targets at play-time so they can't be snuck in via pre-commit and bypass
    // the resolveEffect path. Same shape as resolveEffect.validate — shared
    // candidate evaluation via `evaluateLegalTargets`.
    if (targets !== undefined) {
      if (new Set(targets).size !== targets.length) {
        return {
          valid: false,
          error: "Targets must be unique",
          errorCode: "DUPLICATE_TARGETS",
        };
      }
      const syntheticPE: PendingEffect = {
        id: "__validate__",
        controllerId: playerId,
        sourceCardId: cardId,
        effect: effect as CardEffect,
        effectIndex,
        kind: "activated",
      };
      const resolution = evaluateLegalTargets(syntheticPE, g, framework);
      if (!resolution) {
        // The effect has no counted target-selection directive (e.g. a
        // self-only action, an "all"-target sweep, or no target at all).
        // Forwarding any explicit `targets` to the executor, including an
        // empty array, can alter semantics by constraining an effect that
        // should resolve without caller-selected targets. Reject any
        // provided `targets` to keep the contract consistent with
        // resolveEffect.validate.
        return {
          valid: false,
          error: "This ability does not take targets",
          errorCode: "UNEXPECTED_TARGETS",
        };
      } else {
        const { legalTargetIds, minTargets, maxTargets } = resolution;
        const legalSet = new Set<string>(legalTargetIds);
        for (const id of targets) {
          if (!legalSet.has(id)) {
            return rejectWithKey(
              "gundam.error.ability.illegalTarget",
              { cardId: id },
              "ILLEGAL_TARGET",
            );
          }
        }
        if (targets.length < minTargets || targets.length > maxTargets) {
          return rejectWithKey(
            "gundam.error.ability.wrongTargetCount",
            { min: minTargets, max: maxTargets, got: targets.length },
            "WRONG_TARGET_COUNT",
          );
        }
        for (const group of resolution.groups) {
          const groupLegalSet = new Set<string>(group.legalTargetIds);
          const groupCount = targets.filter((id) => groupLegalSet.has(id)).length;
          if (groupCount < group.minTargets || groupCount > group.maxTargets) {
            return rejectWithKey(
              "gundam.error.ability.wrongTargetCount",
              { min: group.minTargets, max: group.maxTargets, got: groupCount },
              "WRONG_TARGET_COUNT",
            );
          }
        }
      }
    }

    return { valid: true };
  },

  execute({ G, playerId, args, moveId, framework }) {
    const g = G;
    const { cardId, effectIndex, targets } = args;

    const activatedEffects = getActivatedEffects(cardId, g, framework.cards);
    const effect = activatedEffects[effectIndex]!;
    const cost = effect.cost;

    payCost(cost, cardId, playerId, g, framework);
    const cardDef = framework.cards.getDefinition(cardId) as Card | undefined;
    if (cardDef?.type === "unit" && cost?.payResources !== undefined && cost.payResources > 0) {
      const event = {
        type: "unitEffectCostPaid",
        cardId,
        playerId,
        paidResources: cost.payResources,
      };
      enqueueOwnCardTriggers(g, event, cardId, playerId, framework, {
        originatingMoveId: moveId,
      });
      enqueueObserverTriggers(g, event, framework, cardId, { originatingMoveId: moveId });
    }

    // Track uses for once-per-turn abilities
    if (effect.activation.restrictions?.some((r) => r.type === "oncePerTurn")) {
      const meta = framework.cards.getMeta(cardId) as GundamCardMeta | undefined;
      const uses = (meta?.abilityUsesThisTurn ?? {}) as Record<string, number>;
      framework.cards.patchMeta(cardId, {
        abilityUsesThisTurn: { ...uses, [effectIndex]: (uses[effectIndex] ?? 0) + 1 },
      });
    }

    // Enqueue the activated effect onto g.pendingEffects. Costs already
    // paid (above); the effect body runs via the flow drain — either
    // auto-resolved when no player choice is needed, or held until the
    // controller submits a resolveEffect move with targets / "you may"
    // choices (rules 10-1-7, 10-3-3).
    //
    // `effectIndex` is the position in `getActivatedEffects(cardId, ...)`.
    // For printed effects this still agrees with their index in
    // `definition.effects` (they come first, in definition order). For
    // synthesised keyword abilities (<Support N>) it's a stable tail
    // position — not a printed-effects index, which is fine since
    // pending-effects consumers read the effect, not the definition.
    enqueuePendingEffect(
      g,
      {
        id: nextPendingEffectId(g),
        controllerId: playerId,
        sourceCardId: cardId,
        effect: effect as CardEffect,
        effectIndex,
        kind: "activated",
        chosenTargets: targets,
        originatingMoveId: moveId,
      },
      framework,
    );

    emitGundamEvent(framework.events, {
      kind: "ABILITY_ACTIVATED",
      payload: { cardId, effectIndex, playerId },
    });
    emitGundamLog(framework, {
      type: "gundam.move.activateAbility",
      values: { cardId, playerId, effectIndex },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    // Rule 9-4-1: acting during action-step resets consecutive passes
    if (
      framework.state.status.phase === "end-phase" &&
      framework.state.status.step === "action-step"
    ) {
      resetActionStepOnAction(playerId, framework);
    }
  },
};
