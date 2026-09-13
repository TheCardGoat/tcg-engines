/**
 * Play Command Move
 *
 * Plays a Command card from hand by activating its command effect at the
 * current phase's timing. Rules 3-4-1, 3-4-5, 7-5-2-1, 10-1-8.
 *
 * Rules enforced here:
 *   - 3-4-3  : Commands with active effects are in no specific location.
 *              The card is moved to removalArea while its effect resolves.
 *   - 3-4-4  : Commands are placed into trash after their effects end.
 *   - 3-4-5  : 【Main】 and 【Action】 timing gate when a command can be played.
 *   - 7-5-2-2-1: Reveal the card before paying its cost (COMMAND_REVEALED).
 *   - 7-5-2-2-2/3: Level and resource cost validation (see play-card-shared).
 *   - 10-1-8-1-1: Reject the play when a required public target cannot be chosen.
 *   - 10-1-8-1-2: Only the first portion (before Then / If you do) can block play.
 */

import type {
  Card,
  CardEffect,
  Directive,
  ConditionalDirective,
  EffectAction,
  EffectDirective,
} from "@tcg/gundam-types";
import type { GundamMoveDefinition, ReadonlyGundamG } from "../../types.ts";
import type { FrameworkReadAPI } from "../../../types/move-types.ts";
import {
  validatePlayFromHand,
  validatePaymentResourceIds,
  payCardCostWithDetails,
  payCost,
  resourcePaymentSelection,
} from "./play-card-shared.ts";
import { resetActionStepOnAction } from "./action-step-reset.ts";
import {
  enqueueObserverTriggers,
  enqueuePendingEffect,
  hasLegalRequiredTargets,
  nextPendingEffectId,
} from "../../effects/pending-effects.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";
import {
  buildTargetResolutionContext,
  computeEffectiveCostInHand,
} from "../../rules/derived-state.ts";
import { evaluateTargetFilter, evaluateCondition } from "../../../runtime/target-dsl.ts";
import {
  collectFirstSegmentActivationActions,
  extractActionFilters,
  gatherAllCardsForTargeting,
  getFilterCountBounds,
  isActivationGateFilter,
} from "../../effects/target-legality.ts";
import type { TargetResolutionContext } from "../../../runtime/target-dsl.ts";

type Phase = "main-phase" | "battle-phase" | "end-phase";
type PlayCostSubstitution = Extract<EffectAction, { action: "playCostSubstitution" }>;

function isActionTiming(phase: string | undefined, step: string | undefined): boolean {
  return (phase === "battle-phase" || phase === "end-phase") && step === "action-step";
}

/** Empty `targets: []` is not a precommit — treat it as unresolved. */
function normalizeEffectTargets(
  targets: readonly string[] | undefined,
): readonly string[] | undefined {
  return targets && targets.length > 0 ? targets : undefined;
}

function findPlayableCommandEffect(
  definition: Card,
  phase: Phase,
  step?: string,
): CardEffect | undefined {
  for (const eff of definition.effects ?? []) {
    if (eff.type !== "command") continue;
    const timings = (eff.activation.timing ?? []) as string[];
    if (phase === "main-phase" && timings.includes("main")) return eff as CardEffect;
    if (isActionTiming(phase, step) && timings.includes("action")) return eff as CardEffect;
  }
  return undefined;
}

function commandTimingForPhase(
  effect: CardEffect,
  phase: Phase,
  step?: string,
): "main" | "action" | undefined {
  const timings = (effect.activation.timing ?? []) as string[];
  if (phase === "main-phase" && timings.includes("main")) return "main";
  if (isActionTiming(phase, step) && timings.includes("action")) return "action";
  return undefined;
}

/** Directives that have an `action` field are EffectDirectives (vs. ConditionalDirective). */
function isEffectDirective(directive: unknown): directive is EffectDirective {
  return typeof directive === "object" && directive !== null && "action" in (directive as object);
}

function isConditionalDirective(directive: unknown): directive is ConditionalDirective {
  return (
    typeof directive === "object" &&
    directive !== null &&
    "condition" in (directive as object) &&
    "thenDirectives" in (directive as object)
  );
}

function hasChooseOneDirective(directives: readonly Directive[]): boolean {
  return directives.some((directive) => {
    if ("condition" in directive) {
      return (
        hasChooseOneDirective(directive.thenDirectives) ||
        hasChooseOneDirective(directive.elseDirectives ?? [])
      );
    }
    return "kind" in directive && directive.kind === "chooseOne";
  });
}

/**
 * Iterate every EffectAction in a directive list, recursing into
 * ConditionalDirective branches. When a `tgtCtx` is supplied the
 * condition is evaluated at play-time to determine which branch's
 * actions to yield — this prevents a target that only matches the wider
 * branch from being rejected by the narrower branch's min-count check.
 * When `tgtCtx` is omitted, actions from ALL branches are yielded (used
 * by `enumerateCandidates` where we want the widest filter).
 */
function* iterAllActions(
  directives: readonly Directive[],
  tgtCtx?: ReturnType<typeof buildTargetResolutionContext>,
): Generator<EffectAction> {
  for (const directive of directives) {
    if (isEffectDirective(directive)) {
      // Optional selectors are choices made after the Command has legally
      // activated. They cannot make playing the Command illegal when their
      // target set is empty (for example, "you may pair this card from your
      // trash with one of your Units").
      if (tgtCtx && directive.optional) continue;
      yield directive.action;
    } else if (isConditionalDirective(directive)) {
      if (tgtCtx) {
        const condMet = evaluateCondition(directive.condition, tgtCtx);
        if (condMet) {
          yield* iterAllActions(directive.thenDirectives, tgtCtx);
        } else if (directive.elseDirectives) {
          yield* iterAllActions(directive.elseDirectives, tgtCtx);
        }
      } else {
        yield* iterAllActions(directive.thenDirectives);
        if (directive.elseDirectives) {
          yield* iterAllActions(directive.elseDirectives);
        }
      }
    } else if (
      typeof directive === "object" &&
      directive !== null &&
      "kind" in directive &&
      (directive as { kind?: string }).kind === "chooseOne"
    ) {
      // ChooseOne — semantics differ by call site:
      //
      //   • `tgtCtx` set (play-time validation, rule 10-1-8-1-1):
      //     SKIP the chooseOne entirely. Yielding actions from every
      //     option would AND their target filters and reject the play
      //     whenever ANY option lacked legal targets — wrong for cards
      //     like "Choose one: rest an enemy unit / recover a friendly
      //     unit" where one branch is always playable. Correct semantics
      //     are "at least one option's targets are choosable", but
      //     deferring entirely is sound: the chooseOne halts the
      //     pending-effect queue at resolution time, the controller
      //     picks an option, and the executor no-ops actions whose
      //     targets are empty. Worst case the player picks an unplayable
      //     option and the action fizzles — preferable to blocking the
      //     play outright.
      //
      //   • `tgtCtx` undefined (enumerator widest-filter preview):
      //     yield from every option so candidate enumeration sees the
      //     full action set; consumers don't gate on availability here.
      if (tgtCtx) continue;
      const opts = (directive as { options: { directives: Directive[] }[] }).options;
      for (const opt of opts) {
        yield* iterAllActions(opt.directives);
      }
    }
  }
}

/** Iterate every EffectAction in an effect's directive list (including conditional branches). */
function* iterTopLevelActions(
  effect: CardEffect,
  tgtCtx?: ReturnType<typeof buildTargetResolutionContext>,
): Generator<EffectAction> {
  yield* iterAllActions(effect.directives, tgtCtx);
}

/**
 * Yield optional actions from the play-time branch only. Optional targets
 * never make a Command unplayable, but a caller may pre-commit them alongside
 * mandatory targets. Those supplied IDs still need to count as recognized
 * targets during validation.
 */
function* iterOptionalActions(
  directives: readonly Directive[],
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): Generator<EffectAction> {
  for (const directive of directives) {
    if (isEffectDirective(directive)) {
      if (directive.optional) yield directive.action;
      continue;
    }
    if (isConditionalDirective(directive)) {
      if (evaluateCondition(directive.condition, tgtCtx)) {
        yield* iterOptionalActions(directive.thenDirectives, tgtCtx);
      } else if (directive.elseDirectives) {
        yield* iterOptionalActions(directive.elseDirectives, tgtCtx);
      }
    }
  }
}

/**
 * Validate that the player-chosen targets (if any) are legal for this effect,
 * or that legal candidates exist when no explicit choice was made.
 *
 * Returns null on success, or an error tuple.
 */
function validateEffectTargets(
  effect: CardEffect,
  chosenTargets: readonly string[] | undefined,
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
  effectiveCost: number,
  paymentResourceIds?: readonly string[],
): { errorCode: string; error: string } | null {
  // Conditions first (rule 10-1-8: command effects have conditions too)
  if (effect.activation.conditions) {
    for (const cond of effect.activation.conditions) {
      if (!evaluateCondition(cond, tgtCtx)) {
        return {
          errorCode: "PRECONDITION_FAILED",
          error: "Command effect precondition not satisfied",
        };
      }
    }
  }

  const gather = gatherAllCardsForTargeting(tgtCtx);
  const chosenSet = chosenTargets ? new Set(chosenTargets) : undefined;
  // Union of chosen targets that matched at least one action's filter.
  // Used to confirm every chosen target belongs to some action.
  const matchedSet = new Set<string>();
  let previousActionSelectsTargets = false;
  // Rule 10-1-8-1-2: only the first portion (before Then / If you do)
  // can make playing the Command illegal. Later public chooses and
  // private selections (hand/deck/shields, 10-2-2-1) are resolution.
  const firstSegmentActions = new Set(
    collectFirstSegmentActivationActions(effect.directives, tgtCtx).map(({ action }) => action),
  );

  for (const action of iterTopLevelActions(effect, tgtCtx)) {
    const actionFilters = extractCommandActionFilters(
      action,
      tgtCtx,
      effectiveCost,
      paymentResourceIds,
    );
    // `drawIfTargetMatches` evaluates the immediately preceding printed
    // selection in the executor. Its condition must not make a Command
    // unplayable before that selection resolves.
    if (action.action === "drawIfTargetMatches" && previousActionSelectsTargets) {
      previousActionSelectsTargets = actionFilters.length > 0;
      continue;
    }
    const isFirstSegmentGate = firstSegmentActions.has(action);

    for (const filter of actionFilters) {
      const candidates = evaluateTargetFilter(filter, gather, tgtCtx);
      const { min, max } = getFilterCountBounds(filter);
      const gatesPlay = isFirstSegmentGate && isActivationGateFilter(filter);

      if (chosenSet === undefined) {
        // Auto-target path: only first-segment public chooses block play.
        if (gatesPlay && candidates.length < min) {
          return {
            errorCode: "NO_LEGAL_TARGETS",
            error: `No legal targets for command effect (need at least ${min})`,
          };
        }
        continue;
      }

      // Chosen-target path: each action filter picks the subset of chosen
      // IDs that match. For effects with heterogeneous filters across steps
      // (e.g. "rest 2 friendlies; deal damage to 1 enemy"), each chosen
      // target only needs to match one step — not all of them.
      const candidateSet = new Set<string>(candidates as readonly string[]);
      const picked = chosenTargets!.filter((id) => candidateSet.has(id));

      if (picked.length < min) {
        // Later Then/If-you-do chooses do not block the auto-play path
        // (chosenSet undefined above). An explicit precommit is stored as
        // the whole effect's chosenTargets, so any counted filter that
        // currently has candidates must be fully supplied — public or
        // private — or the later prompt is skipped (10-3-3).
        const requireChosenCount = gatesPlay || candidates.length >= min;
        if (requireChosenCount && !(picked.length === 0 && candidates.length === 0 && min === 0)) {
          return {
            errorCode: "INVALID_TARGET",
            error: `Too few targets chosen: need at least ${min}, got ${picked.length}`,
          };
        }
      }
      if (picked.length > max) {
        return {
          errorCode: "INVALID_TARGET",
          error: `Too many targets chosen: max ${max}, got ${picked.length}`,
        };
      }
      for (const id of picked) matchedSet.add(id);
    }
    previousActionSelectsTargets = actionFilters.some(
      (filter) => filter.owner !== "self" && filter.count !== undefined && filter.count !== "all",
    );
  }

  // Optional selectors are resolved after activation, so they do not impose
  // minimum target counts above. When the move pre-commits an optional target,
  // however, recognize it here so the final extraneous-target guard accepts
  // it only when it matches that optional action's filter.
  if (chosenSet !== undefined) {
    for (const action of iterOptionalActions(effect.directives, tgtCtx)) {
      for (const filter of extractCommandActionFilters(
        action,
        tgtCtx,
        effectiveCost,
        paymentResourceIds,
      )) {
        const candidates = new Set(
          evaluateTargetFilter(filter, gather, tgtCtx) as readonly string[],
        );
        for (const id of chosenTargets!) {
          if (candidates.has(id)) matchedSet.add(id);
        }
      }
    }
  }

  // Final check: every chosen target must have matched at least one action's
  // filter. Targets that match no filter are rejected as extraneous.
  if (chosenSet !== undefined && matchedSet.size !== chosenTargets!.length) {
    return {
      errorCode: "INVALID_TARGET",
      error: "One or more chosen targets do not match any effect action's filter",
    };
  }

  return null;
}

function extractCommandActionFilters(
  action: EffectAction,
  tgtCtx: TargetResolutionContext,
  effectiveCost: number,
  paymentResourceIds?: readonly string[],
): ReturnType<typeof extractActionFilters> {
  const filters = extractActionFilters(action);
  if (
    action.action !== "chooseAttackTarget" ||
    action.exResourceUnitCount === undefined ||
    !commandWouldUseExResource(tgtCtx, effectiveCost, paymentResourceIds)
  ) {
    return filters;
  }

  return filters.map((filter) =>
    filter === action.unit ? { ...filter, count: action.exResourceUnitCount } : filter,
  );
}

/**
 * Whether the command play is treated as paying with an EX Resource.
 *
 * Explicit `paymentResourceIds` win: if the controller selected an EX token,
 * the EX-powered target count applies even when enough regular Resources are
 * available. Without a selection, fall back to the auto-pay heuristic
 * (EX only when regulars cannot cover the cost).
 */
function commandWouldUseExResource(
  tgtCtx: TargetResolutionContext,
  effectiveCost: number,
  paymentResourceIds?: readonly string[],
): boolean {
  const source = tgtCtx.getCardById(tgtCtx.sourceCardId);
  if (!source) return false;
  const cost = effectiveCost;
  if (cost <= 0) return false;

  if (paymentResourceIds !== undefined) {
    return paymentResourceIds.some((id) => {
      const card = tgtCtx.getCardById(id as never);
      if (!card) return false;
      return tgtCtx.getCardName(card).toLowerCase() === "ex resource";
    });
  }

  const activeResources = tgtCtx
    .getCardsInZone(tgtCtx.sourcePlayerId, "resourceArea")
    .filter((card) => tgtCtx.isActive(card));
  const regularActive = activeResources.filter(
    (card) => tgtCtx.getCardName(card).toLowerCase() !== "ex resource",
  ).length;
  const exActive = activeResources.length - regularActive;
  return exActive > 0 && regularActive < cost;
}

export const playCommand: GundamMoveDefinition<"playCommand"> = {
  gatedByPendingEffects: true,

  describeProcedure({ G, playerId, partialInput, framework }) {
    const cardId = (partialInput as { cardId?: string }).cardId;
    if (!cardId) return [];
    const definition = framework.cards.getDefinition(cardId) as Card | undefined;
    const substitution = findPlayCostSubstitution(definition);
    const mode = (partialInput as { mode?: string }).mode;

    let paymentCost = computeEffectiveCostInHand(cardId, playerId, G, framework);
    if (substitution) {
      const normal = validatePlayFromHand(cardId, playerId, G, framework).valid;
      const alternateBase = validatePlayFromHand(cardId, playerId, G, framework, {
        costOverride: substitution.action.cost,
        levelOverride: substitution.action.level,
      }).valid;
      const candidates = alternateBase
        ? playSubstitutionCandidates(cardId, playerId, G, framework, substitution.action)
        : [];
      const { min, max } = getFilterCountBounds(substitution.action.discardTarget);
      const alternate = candidates.length >= min;

      if (mode === undefined) {
        const modes: { id: string; label: string }[] = [];
        if (normal) modes.push({ id: "normal", label: "Pay printed Lv. and cost." });
        if (alternate) {
          modes.push({
            id: "alternate",
            label: `Alternate · Lv. ${substitution.action.level} / Cost ${substitution.action.cost}`,
          });
        }
        return modes.length > 0 ? [{ kind: "selectMode", modes }] : [];
      }
      if (mode === "alternate") {
        const selected = ((partialInput as { targets?: readonly string[] }).targets ?? []).filter(
          (id) => candidates.includes(id),
        );
        if (selected.length < min || selected.length > max) {
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
        paymentCost = substitution.action.cost;
      }
    }

    const selectedPayment = (partialInput as { paymentResourceIds?: readonly string[] })
      .paymentResourceIds;
    // Only force an explicit Resource pick when the controller can choose EX
    // vs regular payment. With only regular Resources, auto-pay matches the
    // historical flow and keeps single-tap Command plays working. When EX is
    // available (or already partially selected), collect exact payment IDs so
    // EX-powered target counts can honor the selection.
    if (paymentCost > 0 && selectedPayment?.length !== paymentCost) {
      const activeResources = resourcePaymentSelection(
        paymentCost,
        playerId,
        G,
        framework,
        selectedPayment !== undefined,
      );
      if (activeResources || selectedPayment !== undefined) {
        return [
          {
            kind: "selectTarget",
            role: "resource",
            candidateIds: activeResources ?? [],
            minTargets: paymentCost,
            maxTargets: paymentCost,
          },
        ];
      }
    }
    return [];
  },

  enumerateCandidates({ G, playerId, framework }) {
    const phase = framework.state.status.phase as string;
    const step = framework.state.status.step as string | undefined;
    if (phase !== "main-phase" && !isActionTiming(phase, step)) return [];
    const g = G;
    const handIds = framework.zones.getCards({ zone: "hand", playerId });
    const out: string[] = [];
    for (const cardId of handIds) {
      const def = framework.cards.getDefinition(cardId) as Card | undefined;
      if (!def || def.type !== "command") continue;
      if (!findPlayableCommandEffect(def, phase as Phase, step)) continue;
      const check = validatePlayFromHand(cardId, playerId, g, framework);
      const substitution = findPlayCostSubstitution(def);
      const alternate = substitution
        ? validatePlayFromHand(cardId, playerId, g, framework, {
            costOverride: substitution.action.cost,
            levelOverride: substitution.action.level,
          }).valid &&
          playSubstitutionCandidates(cardId, playerId, g, framework, substitution.action).length >=
            getFilterCountBounds(substitution.action.discardTarget).min
        : false;
      if (!check.valid && !alternate) continue;
      // Ensure at least one legal target arrangement exists (rule 10-1-8-1-1).
      // `validateEffectTargets` returns `null` on success and an error object
      // on failure — skip the card when an error object is returned.
      const effect = findPlayableCommandEffect(def, phase as Phase, step)!;
      if (
        hasChooseOneDirective(effect.directives) &&
        !hasLegalRequiredTargets(effect, "command", g, playerId, cardId, framework)
      ) {
        continue;
      }
      const tgtCtx = buildTargetResolutionContext(g, playerId, framework, {
        sourceCardId: cardId,
      });
      const effectiveCost = check.valid
        ? computeEffectiveCostInHand(cardId, playerId, g, framework)
        : substitution!.action.cost;
      if (validateEffectTargets(effect, undefined, tgtCtx, effectiveCost) !== null) continue;
      out.push(cardId);
    }
    return out;
  },

  validate({ G, playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };
    const g = G;
    const { cardId, mode, targets, paymentResourceIds } = args;

    const phase = framework.state.status.phase as string;
    const step = framework.state.status.step as string | undefined;
    if (phase !== "main-phase" && !isActionTiming(phase, step)) {
      return {
        valid: false,
        error: "Can only play commands during the main phase or action step",
        errorCode: "WRONG_PHASE",
      };
    }

    const definition = framework.cards.getDefinition(cardId) as Card | undefined;
    if (!definition || definition.type !== "command") {
      return { valid: false, error: "Card is not a Command", errorCode: "NOT_A_COMMAND" };
    }

    const substitution = findPlayCostSubstitution(definition);
    if (mode !== undefined && mode !== "normal" && mode !== "alternate") {
      return { valid: false, error: "Unknown command play mode", errorCode: "INVALID_MODE" };
    }
    const commonResult = validatePlayFromHand(
      cardId,
      playerId,
      g,
      framework,
      mode === "alternate" && substitution
        ? { costOverride: substitution.action.cost, levelOverride: substitution.action.level }
        : {},
    );
    if (!commonResult.valid) return commonResult;
    const payment = validatePaymentResourceIds(
      paymentResourceIds,
      mode === "alternate" && substitution
        ? substitution.action.cost
        : computeEffectiveCostInHand(cardId, playerId, g, framework),
      playerId,
      g,
      framework,
    );
    if (!payment.valid) return payment;
    if (mode === "alternate" && !substitution) {
      return {
        valid: false,
        error: "This Command has no alternate play cost",
        errorCode: "INVALID_MODE",
      };
    }

    const costTargets =
      mode === "alternate" && substitution
        ? playSubstitutionCandidates(cardId, playerId, g, framework, substitution.action).filter(
            (id) => (targets ?? []).includes(id),
          )
        : [];
    if (mode === "alternate" && substitution) {
      const { min, max } = getFilterCountBounds(substitution.action.discardTarget);
      if (new Set(costTargets).size !== costTargets.length) {
        return {
          valid: false,
          error: "Cost targets must be unique",
          errorCode: "DUPLICATE_TARGETS",
        };
      }
      if (costTargets.length < min || costTargets.length > max) {
        return {
          valid: false,
          error: `Alternate play requires ${min} discard target(s)`,
          errorCode: "WRONG_TARGET_COUNT",
        };
      }
    }

    const effect = findPlayableCommandEffect(definition, phase as Phase, step);
    if (!effect) {
      return {
        valid: false,
        error: `Command has no 【${phase === "main-phase" ? "Main" : "Action"}】 effect`,
        errorCode: "WRONG_TIMING",
      };
    }
    if (!commandTimingForPhase(effect, phase as Phase, step)) {
      return {
        valid: false,
        error: "Command effect is missing a valid timing",
        errorCode: "INVALID_EFFECT_TIMING",
      };
    }

    // Rule 10-1-8-1-1: target legality at play time.
    const tgtCtx = buildTargetResolutionContext(g, playerId, framework, {
      sourceCardId: cardId,
    });
    const effectiveCost =
      mode === "alternate" && substitution
        ? substitution.action.cost
        : computeEffectiveCostInHand(cardId, playerId, g, framework);
    const effectTargets = normalizeEffectTargets(
      targets?.filter((id) => !costTargets.includes(id)),
    );
    if (
      hasChooseOneDirective(effect.directives) &&
      !hasLegalRequiredTargets(effect, "command", g, playerId, cardId, framework)
    ) {
      return {
        valid: false,
        error: "No legal targets for any command effect option",
        errorCode: "NO_LEGAL_TARGETS",
      };
    }
    const tgtError = validateEffectTargets(
      effect,
      effectTargets,
      tgtCtx,
      effectiveCost,
      paymentResourceIds,
    );
    if (tgtError) {
      return { valid: false, ...tgtError };
    }

    return { valid: true };
  },

  execute({ G, playerId, args, moveId, framework }) {
    const g = G;
    const { cardId, mode, targets, paymentResourceIds } = args;
    const definition = framework.cards.getDefinition(cardId) as Card;
    const substitution = findPlayCostSubstitution(definition);
    const costTargets =
      mode === "alternate" && substitution
        ? playSubstitutionCandidates(cardId, playerId, g, framework, substitution.action).filter(
            (id) => (targets ?? []).includes(id),
          )
        : [];
    const effectTargets = normalizeEffectTargets(
      targets?.filter((id) => !costTargets.includes(id)),
    );

    // Rule 7-5-2-2-1: reveal before paying cost.
    emitGundamEvent(framework.events, {
      kind: "COMMAND_REVEALED",
      payload: { cardId, playerId },
    });

    // Rule 7-5-2-2-3: pay cost.
    if (mode === "alternate" && substitution) {
      payCost(
        {
          discardCount: costTargets.length,
          discardFilter: substitution.action.discardTarget,
        },
        cardId,
        playerId,
        g,
        framework,
        costTargets,
      );
    }
    const paidCost = payCardCostWithDetails(
      cardId,
      playerId,
      g,
      framework,
      mode === "alternate" && substitution
        ? { costOverride: substitution.action.cost, paymentResourceIds }
        : { paymentResourceIds },
    );
    emitGundamLog(framework, {
      type: "gundam.move.playCommand",
      values: { cardId, playerId, cost: paidCost.total },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    // Rule 3-4-3: move card to removalArea while the effect resolves.
    framework.zones.moveCard(cardId, { zone: "removalArea" });

    // Rule 3-4-5 (tightened): only fire the effect that matches the current phase.
    const phase = framework.state.status.phase as Phase;
    const step = framework.state.status.step as string | undefined;
    const effect = findPlayableCommandEffect(definition, phase, step);
    if (effect) {
      if (!g.turnMetadata.activatedCommandThisTurn.includes(cardId)) {
        g.turnMetadata.activatedCommandThisTurn.push(cardId);
      }
      const commandTiming = commandTimingForPhase(effect, phase, step);
      if (!commandTiming) {
        throw new Error("Command effect is missing a valid timing");
      }
      const ownerId = (framework.cards.getOwner(cardId) as string | undefined) ?? playerId;
      const fullEffectIndex = (definition.effects ?? []).findIndex((e) => e === effect);

      // Rule 3-4-3: card stays in removalArea while the effect resolves.
      // Rule 3-4-4: moveToTrash + COMMAND_PLAYED fire AFTER the effect body,
      // scripted via postActions so the queue entry stays serializable.
      enqueuePendingEffect(
        g,
        {
          id: nextPendingEffectId(g),
          controllerId: playerId,
          sourceCardId: cardId,
          commandActivationOrigin: {
            kind: "playedFromHand",
            paidResources: paidCost.total,
            paidExResources: paidCost.exRemovedCount,
          },
          effect,
          effectIndex: fullEffectIndex >= 0 ? fullEffectIndex : 0,
          kind: "command",
          chosenTargets: effectTargets,
          trigger: {
            type: "commandPlayed",
            cardId,
            playerId,
            paidResources: paidCost.total,
            paidExResources: paidCost.exRemovedCount,
          },
          originatingMoveId: moveId,
          postActions: [
            { kind: "moveToTrash", cardId, playerId: ownerId },
            {
              kind: "emitEvent",
              event: { kind: "COMMAND_PLAYED", payload: { cardId, playerId } },
            },
          ],
        },
        framework,
      );
      enqueueObserverTriggers(
        g,
        {
          type: "commandEffectActivated",
          cardId,
          playerId,
          timing: commandTiming,
          paidResources: paidCost.total,
          paidExResources: paidCost.exRemovedCount,
        },
        framework,
        cardId,
        { originatingMoveId: moveId },
      );
    } else {
      // No matching effect for the current phase — still retire the card per
      // 3-4-4 and emit COMMAND_PLAYED so observers stay in sync.
      const ownerId = (framework.cards.getOwner(cardId) as string | undefined) ?? playerId;
      framework.zones.moveCard(cardId, { zone: "trash", playerId: ownerId });
      emitGundamEvent(framework.events, {
        kind: "COMMAND_PLAYED",
        payload: { cardId, playerId },
      });
    }

    // Rule 9-4-1: acting during action-step resets consecutive passes.
    // Fires on activation (when the player played the card), not on
    // effect resolution.
    if (isActionTiming(framework.state.status.phase, framework.state.status.step)) {
      resetActionStepOnAction(playerId, framework);
    }
  },
};

function findPlayCostSubstitution(
  definition: Card | undefined,
): { action: PlayCostSubstitution; sourceText: string } | undefined {
  for (const effect of (definition?.effects ?? []) as CardEffect[]) {
    if (effect.type !== "substitution") continue;
    for (const directive of effect.directives) {
      if (!("action" in directive)) continue;
      const action = (directive as EffectDirective).action;
      if (action.action === "playCostSubstitution") {
        return { action, sourceText: effect.sourceText };
      }
    }
  }
  return undefined;
}

function playSubstitutionCandidates(
  sourceCardId: string,
  playerId: string,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
  action: PlayCostSubstitution,
): string[] {
  const ctx = buildTargetResolutionContext(G, playerId, framework, { sourceCardId });
  return evaluateTargetFilter(
    action.discardTarget,
    gatherAllCardsForTargeting(ctx),
    ctx,
  ) as string[];
}
