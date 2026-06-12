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
 *   - 10-1-8-1-1: Reject the play when a required target cannot be chosen.
 */

import type {
  Card,
  CardEffect,
  Directive,
  ConditionalDirective,
  EffectAction,
  EffectDirective,
} from "@tcg/gundam-types";
import type { GundamMoveDefinition } from "../../types.ts";
import { validatePlayFromHand, payCardCostWithDetails } from "./play-card-shared.ts";
import { resetActionStepOnAction } from "./action-step-reset.ts";
import {
  enqueueObserverTriggers,
  enqueuePendingEffect,
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
  extractActionFilters,
  gatherAllCardsForTargeting,
  getFilterCountBounds,
} from "../../effects/target-legality.ts";
import type { TargetResolutionContext } from "../../../runtime/target-dsl.ts";

type Phase = "main-phase" | "battle-phase" | "end-phase";

function isActionTiming(phase: string, step: string | undefined): boolean {
  return (phase === "battle-phase" || phase === "end-phase") && step === "action-step";
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

  for (const action of iterTopLevelActions(effect, tgtCtx)) {
    for (const filter of extractCommandActionFilters(action, tgtCtx, effectiveCost)) {
      const candidates = evaluateTargetFilter(filter, gather, tgtCtx);
      const { min, max } = getFilterCountBounds(filter);

      if (chosenSet === undefined) {
        // Auto-target path: candidates must cover at least `min` for the play to be legal.
        if (candidates.length < min) {
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
        // Too few (below min) — allow zero when candidates are also zero (empty-set legal play)
        if (!(picked.length === 0 && candidates.length === 0 && min === 0)) {
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
): ReturnType<typeof extractActionFilters> {
  const filters = extractActionFilters(action);
  if (
    action.action !== "chooseAttackTarget" ||
    action.exResourceUnitCount === undefined ||
    !commandWouldUseExResource(tgtCtx, effectiveCost)
  ) {
    return filters;
  }

  return filters.map((filter) =>
    filter === action.unit ? { ...filter, count: action.exResourceUnitCount } : filter,
  );
}

function commandWouldUseExResource(
  tgtCtx: TargetResolutionContext,
  effectiveCost: number,
): boolean {
  const source = tgtCtx.getCardById(tgtCtx.sourceCardId);
  if (!source) return false;
  const cost = effectiveCost;
  if (cost <= 0) return false;

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
      if (!check.valid) continue;
      // Ensure at least one legal target arrangement exists (rule 10-1-8-1-1).
      // `validateEffectTargets` returns `null` on success and an error object
      // on failure — skip the card when an error object is returned.
      const effect = findPlayableCommandEffect(def, phase as Phase, step)!;
      const tgtCtx = buildTargetResolutionContext(g, playerId, framework, {
        sourceCardId: cardId,
      });
      const effectiveCost = computeEffectiveCostInHand(cardId, playerId, g, framework);
      if (validateEffectTargets(effect, undefined, tgtCtx, effectiveCost) !== null) continue;
      out.push(cardId);
    }
    return out;
  },

  validate({ G, playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };
    const g = G;
    const { cardId, targets } = args;

    const phase = framework.state.status.phase as string;
    const step = framework.state.status.step as string | undefined;
    if (phase !== "main-phase" && !isActionTiming(phase, step)) {
      return {
        valid: false,
        error: "Can only play commands during the main phase or action step",
        errorCode: "WRONG_PHASE",
      };
    }

    // Common checks: card in hand, level, cost
    const commonResult = validatePlayFromHand(cardId, playerId, g, framework);
    if (!commonResult.valid) return commonResult;

    const definition = framework.cards.getDefinition(cardId) as Card | undefined;
    if (!definition || definition.type !== "command") {
      return { valid: false, error: "Card is not a Command", errorCode: "NOT_A_COMMAND" };
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
    const effectiveCost = computeEffectiveCostInHand(cardId, playerId, g, framework);
    const tgtError = validateEffectTargets(effect, targets, tgtCtx, effectiveCost);
    if (tgtError) {
      return { valid: false, ...tgtError };
    }

    return { valid: true };
  },

  execute({ G, playerId, args, moveId, framework }) {
    const g = G;
    const { cardId, targets } = args;
    const definition = framework.cards.getDefinition(cardId) as Card;

    // Rule 7-5-2-2-1: reveal before paying cost.
    emitGundamEvent(framework.events, {
      kind: "COMMAND_REVEALED",
      payload: { cardId, playerId },
    });

    // Rule 7-5-2-2-3: pay cost.
    const paidCost = payCardCostWithDetails(cardId, playerId, g, framework);
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
          effect,
          effectIndex: fullEffectIndex >= 0 ? fullEffectIndex : 0,
          kind: "command",
          chosenTargets: targets,
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
    if (
      framework.state.status.phase === "end-phase" &&
      framework.state.status.step === "action-step"
    ) {
      resetActionStepOnAction(playerId, framework);
    }
  },
};
