/**
 * Activate Ability Move
 *
 * Activates a card's "Activated" CardEffect (those with timing "Activate:Main"
 * or "Activate:Action"), paying its cost and executing its steps.
 */

import type { Card, CardEffect, EffectCondition, TargetFilter } from "@tcg/gundam-types";
import type {
  GundamMoveDefinition,
  GundamCardMeta,
  PendingEffect,
  ReadonlyGundamG,
} from "../../types.ts";
import type { FrameworkReadAPI } from "../../../types/move-types.ts";
import {
  getActivatedEffects,
  getAvailableResources,
  buildTargetResolutionContext,
  isLinkUnit,
} from "../../rules/derived-state.ts";
import { evaluateCondition, evaluateTargetFilter } from "../../../runtime/target-dsl.ts";
import { gatherAllCardsForTargeting, getFilterCountBounds } from "../../effects/target-legality.ts";
import {
  countPayableDiscardCostCards,
  listPayableDiscardCostCards,
  payCost,
} from "./play-card-shared.ts";
import { resetActionStepOnAction } from "./action-step-reset.ts";
import {
  assignTargetsToGroups,
  enqueuePendingEffect,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
  evaluateLegalTargets,
  nextPendingEffectId,
  requiredTargetAssignmentExists,
} from "../../effects/pending-effects.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";
import { rejectWithKey } from "./validation-error.ts";

function isActionTiming(phase: string | undefined, step: string | undefined): boolean {
  return (phase === "battle-phase" || phase === "end-phase") && step === "action-step";
}

function canBeginActivation(
  effect: CardEffect,
  effectIndex: number,
  cardId: string,
  playerId: string,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
): boolean {
  if (framework.cards.getController(cardId) !== playerId) return false;
  const sourceZone = framework.cards.getZone(cardId)?.split(":")[0];
  if (sourceZone !== "battleArea" && sourceZone !== "baseSection") return false;
  const timing = (effect.activation.timing ?? []) as string[];
  const phase = framework.state.status.phase;
  const validInPhase =
    (timing.includes("activate:main") && phase === "main-phase") ||
    (timing.includes("activate:action") && isActionTiming(phase, framework.state.status.step));
  if (!validInPhase) return false;
  if (timing.includes("duringLink") && !isLinkUnit(cardId, G, framework.cards)) return false;
  if (timing.includes("duringPair") && !(cardId in G.pilotAssignments)) return false;

  const tgtCtx = buildTargetResolutionContext(G, playerId, framework, {
    sourceCardId: cardId,
  });
  if (
    effect.activation.conditions?.some(
      (condition) => !evaluateCondition(condition as EffectCondition, tgtCtx),
    )
  ) {
    return false;
  }

  const cost = effect.cost;
  if (cost?.restSelf) {
    const meta = framework.cards.getMeta(cardId) as GundamCardMeta | undefined;
    if (meta?.exhausted || G.exhausted[cardId]) return false;
  }
  if (
    cost?.payResources !== undefined &&
    getAvailableResources(playerId, G, framework) < cost.payResources
  ) {
    return false;
  }
  if (
    cost?.discardCount &&
    countPayableDiscardCostCards(cost, cardId, playerId, G, framework) < cost.discardCount
  ) {
    return false;
  }
  if (cost?.exileFromTrash) {
    const filter: TargetFilter = { ...cost.exileFromTrash, zone: "trash" };
    const candidates = evaluateTargetFilter(filter, gatherAllCardsForTargeting(tgtCtx), tgtCtx);
    if (candidates.length < getFilterCountBounds(filter).min) return false;
  }
  if (
    cost?.restTarget &&
    evaluateTargetFilter(cost.restTarget, gatherAllCardsForTargeting(tgtCtx), tgtCtx).length === 0
  ) {
    return false;
  }
  if (effect.activation.restrictions?.some((restriction) => restriction.type === "oncePerTurn")) {
    const meta = framework.cards.getMeta(cardId) as GundamCardMeta | undefined;
    if ((meta?.abilityUsesThisTurn?.[String(effectIndex)] ?? 0) >= 1) return false;
  }
  const targetResolution = evaluateLegalTargets(
    {
      id: "__availability__",
      controllerId: playerId,
      sourceCardId: cardId,
      effect,
      effectIndex,
      kind: "activated",
    },
    G,
    framework,
  );
  if (targetResolution && !requiredTargetAssignmentExists(targetResolution.groups)) return false;
  return true;
}

export const activateAbility: GundamMoveDefinition<"activateAbility"> = {
  gatedByPendingEffects: true,

  describeProcedure({ G, playerId, partialInput, framework }) {
    const g = G;
    const cardId = (partialInput as { cardId?: string }).cardId;
    if (!cardId) return [];

    const activated = getActivatedEffects(cardId, g, framework.cards);

    const usableIndices: number[] = [];
    activated.forEach((effect, idx) => {
      if (canBeginActivation(effect, idx, cardId, playerId, g, framework)) {
        usableIndices.push(idx);
      }
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

    const effectIndex = (partialInput as { effectIndex: number }).effectIndex;
    const effect = activated[effectIndex];
    if (effect?.cost?.discardCount) {
      const candidates = listPayableDiscardCostCards(effect.cost, playerId, cardId, g, framework);
      const selected = ((partialInput as { targets?: readonly string[] }).targets ?? []).filter(
        (id) => candidates.includes(id),
      );
      if (selected.length !== effect.cost.discardCount) {
        return [
          {
            kind: "selectTarget",
            role: "cost",
            candidateIds: candidates,
            minTargets: effect.cost.discardCount,
            maxTargets: effect.cost.discardCount,
          },
        ];
      }
    }
    if (effect?.cost?.exileFromTrash) {
      const tgtCtx = buildTargetResolutionContext(g, playerId, framework, { sourceCardId: cardId });
      const filter: TargetFilter = { ...effect.cost.exileFromTrash, zone: "trash" };
      const candidates = evaluateTargetFilter(
        filter,
        gatherAllCardsForTargeting(tgtCtx),
        tgtCtx,
      ) as readonly string[];
      const selected = ((partialInput as { targets?: readonly string[] }).targets ?? []).filter(
        (id) => candidates.includes(id),
      );
      const { min, max } = getFilterCountBounds(filter);
      if (selected.length < min) {
        return [
          {
            kind: "selectTarget",
            role: "cost",
            candidateIds: candidates,
            minTargets: min,
            maxTargets: Number.isFinite(max) ? max : candidates.length,
          },
        ];
      }
    }

    return [];
  },

  enumerateCandidates({ G, playerId, framework }) {
    const phase = framework.state.status.phase;
    const step = framework.state.status.step;
    const isMain = phase === "main-phase";
    const isAction = isActionTiming(phase, step);
    if (!isMain && !isAction) return [];

    const g = G;
    const zones = ["battleArea", "baseSection"] as const;
    const out: string[] = [];
    for (const zone of zones) {
      const ids = framework.zones.getCards({ zone, playerId });
      for (const cardId of ids) {
        const activated = getActivatedEffects(cardId, g, framework.cards);
        const hasUsable = activated.some((effect, effectIndex) =>
          canBeginActivation(effect, effectIndex, cardId, playerId, g, framework),
        );
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
    const controllerId = framework.cards.getController(cardId) as string | undefined;
    if (controllerId !== playerId) {
      return {
        valid: false,
        error: "Only the card's controller can activate this ability",
        errorCode: "NOT_EFFECT_CONTROLLER",
      };
    }
    const sourceZone = framework.cards.getZone(cardId)?.split(":")[0];
    if (sourceZone !== "battleArea" && sourceZone !== "baseSection") {
      return {
        valid: false,
        error: "Activated ability source is not in play",
        errorCode: "ABILITY_SOURCE_NOT_IN_PLAY",
      };
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
      (timing.includes("activate:action") && isActionTiming(phase, framework.state.status.step));

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
    let costTargetIds: string[] = [];

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
      const candidates = listPayableDiscardCostCards(cost, playerId, cardId, g, framework);
      const selected = (targets ?? []).filter((id) => candidates.includes(id));
      if (new Set(selected).size !== selected.length) {
        return {
          valid: false,
          error: "Cost targets must be unique",
          errorCode: "DUPLICATE_TARGETS",
        };
      }
      if (selected.length !== cost.discardCount) {
        return rejectWithKey(
          "gundam.error.ability.wrongTargetCount",
          { min: cost.discardCount, max: cost.discardCount, got: selected.length },
          "WRONG_TARGET_COUNT",
        );
      }
      costTargetIds.push(...selected);
    }

    if (cost?.exileFromTrash) {
      const tgtCtx = buildTargetResolutionContext(g, playerId, framework, {
        sourceCardId: cardId,
      });
      const filter: TargetFilter = { ...cost.exileFromTrash, zone: "trash" };
      const candidates = evaluateTargetFilter(
        filter,
        gatherAllCardsForTargeting(tgtCtx),
        tgtCtx,
      ) as string[];
      const { min, max } = getFilterCountBounds(filter);
      if (candidates.length < min) {
        return {
          valid: false,
          error: "No matching card in trash to exile for cost",
          errorCode: "COST_NOT_PAYABLE",
        };
      }
      const selected = (targets ?? []).filter((id) => candidates.includes(id));
      if (new Set(selected).size !== selected.length) {
        return {
          valid: false,
          error: "Cost targets must be unique",
          errorCode: "DUPLICATE_TARGETS",
        };
      }
      if (selected.length < min || selected.length > max) {
        return rejectWithKey(
          "gundam.error.ability.wrongTargetCount",
          { min, max, got: selected.length },
          "WRONG_TARGET_COUNT",
        );
      }
      costTargetIds.push(...selected);
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
    const syntheticPE: PendingEffect = {
      id: "__validate__",
      controllerId: playerId,
      sourceCardId: cardId,
      effect: effect as CardEffect,
      effectIndex,
      kind: "activated",
    };
    const resolution = evaluateLegalTargets(syntheticPE, g, framework);
    const effectTargets = targets?.filter((id) => !costTargetIds.includes(id));
    const shouldValidateEffectTargets =
      effectTargets !== undefined && (costTargetIds.length === 0 || effectTargets.length > 0);
    if (
      !shouldValidateEffectTargets &&
      resolution &&
      !requiredTargetAssignmentExists(resolution.groups)
    ) {
      if (resolution.legalTargetIds.length > 0) {
        return rejectWithKey(
          "gundam.error.ability.wrongTargetCount",
          {
            min: resolution.minTargets,
            max: resolution.maxTargets,
            got: effectTargets?.length ?? 0,
          },
          "WRONG_TARGET_COUNT",
        );
      }
      return {
        valid: false,
        error: "No legal targets for this activated ability",
        errorCode: "NO_LEGAL_TARGETS",
      };
    }
    if (shouldValidateEffectTargets) {
      if (new Set(effectTargets).size !== effectTargets.length) {
        return {
          valid: false,
          error: "Targets must be unique",
          errorCode: "DUPLICATE_TARGETS",
        };
      }
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
        for (const id of effectTargets) {
          if (!legalSet.has(id)) {
            return rejectWithKey(
              "gundam.error.ability.illegalTarget",
              { cardId: id },
              "ILLEGAL_TARGET",
            );
          }
        }
        if (effectTargets.length < minTargets || effectTargets.length > maxTargets) {
          return rejectWithKey(
            "gundam.error.ability.wrongTargetCount",
            { min: minTargets, max: maxTargets, got: effectTargets.length },
            "WRONG_TARGET_COUNT",
          );
        }
        if (!assignTargetsToGroups(effectTargets, resolution.groups)) {
          return rejectWithKey(
            "gundam.error.ability.wrongTargetCount",
            { min: minTargets, max: maxTargets, got: effectTargets.length },
            "WRONG_TARGET_COUNT",
          );
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
    let costTargetIds: string[] = [];
    if (cost?.discardCount) {
      const candidates = listPayableDiscardCostCards(cost, playerId, cardId, g, framework);
      costTargetIds.push(...(targets ?? []).filter((id) => candidates.includes(id)));
    }
    if (cost?.exileFromTrash) {
      const tgtCtx = buildTargetResolutionContext(g, playerId, framework, { sourceCardId: cardId });
      const filter: TargetFilter = { ...cost.exileFromTrash, zone: "trash" };
      const candidates = evaluateTargetFilter(
        filter,
        gatherAllCardsForTargeting(tgtCtx),
        tgtCtx,
      ) as string[];
      costTargetIds.push(...(targets ?? []).filter((id) => candidates.includes(id)));
    }
    let effectTargets = targets?.filter((id) => !costTargetIds.includes(id));
    if (effectTargets !== undefined) {
      const syntheticPE: PendingEffect = {
        id: "__execute__",
        controllerId: playerId,
        sourceCardId: cardId,
        effect: effect as CardEffect,
        effectIndex,
        kind: "activated",
      };
      const resolution = evaluateLegalTargets(syntheticPE, g, framework);
      const assigned = resolution ? assignTargetsToGroups(effectTargets, resolution.groups) : null;
      if (assigned) effectTargets = assigned.flat();
    }

    payCost(cost, cardId, playerId, g, framework, costTargetIds);
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
        chosenTargets: effectTargets && effectTargets.length > 0 ? effectTargets : undefined,
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
    if (isActionTiming(framework.state.status.phase, framework.state.status.step)) {
      resetActionStepOnAction(playerId, framework);
    }
  },
};
