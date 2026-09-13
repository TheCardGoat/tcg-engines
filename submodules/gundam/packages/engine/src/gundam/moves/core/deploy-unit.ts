/**
 * Deploy Unit Move
 *
 * Plays a Unit card from hand into the battle area.
 * Rules 7-5-2-1: deploy a Unit by paying its cost.
 * Rules 3-2-1: Unit cards are deployed into the battle area.
 * Rules 3-2-4: A newly deployed Unit cannot attack on the turn it is deployed.
 * Rule 3-2-6-3: Link Units are exempt and can attack on the deploy turn.
 */

import type {
  Card,
  CardEffect,
  EffectAction,
  EffectCondition,
  EffectDirective,
} from "@tcg/gundam-types";
import type { CardInstanceId } from "../../../types/branded.ts";
import type { GundamMoveDefinition, ReadonlyGundamG } from "../../types.ts";
import type { FrameworkReadAPI } from "../../../types/move-types.ts";
import {
  validatePlayFromHand,
  validatePaymentResourceIds,
  validateDeployTriggerTargets,
  payCardCost,
  resourcePaymentSelection,
} from "./play-card-shared.ts";
import {
  enqueueMoveCompletionFence,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../../effects/pending-effects.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";
import {
  buildTargetResolutionContext,
  computeEffectiveCostInHand,
} from "../../rules/derived-state.ts";
import { evaluateCondition, evaluateTargetFilter } from "../../../runtime/target-dsl.ts";
import { gatherAllCardsForTargeting, getFilterCountBounds } from "../../effects/target-legality.ts";
import { handleDestroyAction, isDestructionPreventedFor } from "../../effects/handlers/combat.ts";
import { enqueueBattleAreaExcessManagement } from "../../rules/battle-area-excess.ts";

type DeployCostSubstitution = Extract<EffectAction, { action: "deployCostSubstitution" }>;
type DeployCostOverride = Extract<EffectAction, { action: "deployCostOverride" }>;
type DeployCostAlternative = DeployCostSubstitution | DeployCostOverride;

export const deployUnit: GundamMoveDefinition<"deployUnit"> = {
  gatedByPendingEffects: true,

  describeProcedure({ G, playerId, partialInput, framework }) {
    const cardId = (partialInput as { cardId?: string }).cardId;
    if (!cardId) return [];
    const definition = framework.cards.getDefinition(cardId) as Card | undefined;
    const substitution = findDeployCostSubstitution(definition);
    const normal = validatePlayFromHand(cardId, playerId, G, framework).valid;
    const alternateBase = substitution
      ? validatePlayFromHand(cardId, playerId, G, framework, {
          costOverride: substitution.action.cost,
          levelOverride: substitution.action.level,
        }).valid
      : false;
    const candidates =
      alternateBase && substitution
        ? deploySubstitutionCandidates(cardId, playerId, G, framework, substitution.action)
        : [];
    const alternate =
      substitution !== undefined &&
      alternateBase &&
      isDeployAlternativeAvailable(substitution.action, candidates, playerId, G, framework, cardId);
    const mode = (partialInput as { mode?: string }).mode;

    if (substitution && mode === undefined) {
      const modes: { id: string; label: string }[] = [];
      if (normal) modes.push({ id: "normal", label: "Pay printed Lv. and cost." });
      if (alternate) modes.push({ id: "alternate", label: substitution.sourceText });
      return modes.length > 0 ? [{ kind: "selectMode", modes }] : [];
    }

    if (mode === "alternate" && substitution) {
      if (substitution.action.action === "deployCostSubstitution") {
        const selected = ((partialInput as { targets?: readonly string[] }).targets ?? []).filter(
          (id) => candidates.includes(id),
        );
        const { min, max } = getFilterCountBounds(substitution.action.destroyTarget);
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
      }
    }

    const paymentCost =
      mode === "alternate" && substitution
        ? substitution.action.cost
        : computeEffectiveCostInHand(cardId, playerId, G, framework);
    const selectedPayment = (partialInput as { paymentResourceIds?: readonly string[] })
      .paymentResourceIds;
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
    if (framework.state.status.phase !== "main-phase") return [];
    const g = G;
    const handIds = framework.zones.getCards({ zone: "hand", playerId });
    const out: string[] = [];
    for (const cardId of handIds) {
      const def = framework.cards.getDefinition(cardId) as Card | undefined;
      if (!def || def.type !== "unit") continue;
      const check = validatePlayFromHand(cardId, playerId, g, framework);
      if (check.valid) {
        out.push(cardId);
        continue;
      }
      const substitution = findDeployCostSubstitution(def);
      if (!substitution) continue;
      const alternate = validatePlayFromHand(cardId, playerId, g, framework, {
        costOverride: substitution.action.cost,
        levelOverride: substitution.action.level,
      });
      if (
        alternate.valid &&
        isDeployAlternativeAvailable(
          substitution.action,
          deploySubstitutionCandidates(cardId, playerId, g, framework, substitution.action),
          playerId,
          g,
          framework,
          cardId,
        )
      ) {
        out.push(cardId);
      }
    }
    return out;
  },

  validate({ G, playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };
    const g = G;
    const { cardId, mode, targets, paymentResourceIds } = args;

    if (framework.state.status.phase !== "main-phase") {
      return {
        valid: false,
        error: "Can only deploy units during the main phase",
        errorCode: "WRONG_PHASE",
      };
    }

    const definition = framework.cards.getDefinition(cardId) as Card | undefined;
    if (definition && definition.type !== "unit") {
      return {
        valid: false,
        error: "Card is not a Unit",
        errorCode: "NOT_A_UNIT",
      };
    }

    const substitution = findDeployCostSubstitution(definition);
    if (mode !== undefined && mode !== "normal" && mode !== "alternate") {
      return { valid: false, error: "Unknown deployment mode", errorCode: "INVALID_MODE" };
    }
    if (mode === "alternate") {
      if (!substitution) {
        return {
          valid: false,
          error: "This Unit has no alternate deployment cost",
          errorCode: "INVALID_MODE",
        };
      }
      const commonResult = validatePlayFromHand(cardId, playerId, g, framework, {
        costOverride: substitution.action.cost,
        levelOverride: substitution.action.level,
      });
      if (!commonResult.valid) return commonResult;
      const payment = validatePaymentResourceIds(
        paymentResourceIds,
        substitution.action.cost,
        playerId,
        g,
        framework,
      );
      if (!payment.valid) return payment;
      const candidates = deploySubstitutionCandidates(
        cardId,
        playerId,
        g,
        framework,
        substitution.action,
      );
      const selected = (targets ?? []).filter((id) => candidates.includes(id));
      if (substitution.action.action === "deployCostOverride") {
        if (
          !isDeployAlternativeAvailable(
            substitution.action,
            candidates,
            playerId,
            g,
            framework,
            cardId,
          )
        ) {
          return {
            valid: false,
            error: "Alternate deployment condition is not met",
            errorCode: "INVALID_MODE",
          };
        }
        return validateDeployTriggerTargets(cardId, playerId, targets ?? [], g, framework);
      }
      const { min, max } = getFilterCountBounds(substitution.action.destroyTarget);
      if (new Set(selected).size !== selected.length) {
        return {
          valid: false,
          error: "Cost targets must be unique",
          errorCode: "DUPLICATE_TARGETS",
        };
      }
      if (selected.length < min || selected.length > max) {
        return {
          valid: false,
          error: `Alternate deployment requires ${min} cost target(s)`,
          errorCode: "WRONG_TARGET_COUNT",
        };
      }
      const effectTargets = targets?.filter((id) => !selected.includes(id));
      return validateDeployTriggerTargets(cardId, playerId, effectTargets ?? [], g, framework);
    }

    const commonResult = validatePlayFromHand(cardId, playerId, g, framework);
    if (!commonResult.valid) return commonResult;
    const payment = validatePaymentResourceIds(
      paymentResourceIds,
      computeEffectiveCostInHand(cardId, playerId, g, framework),
      playerId,
      g,
      framework,
    );
    if (!payment.valid) return payment;

    return validateDeployTriggerTargets(cardId, playerId, targets ?? [], g, framework);
  },

  execute({ G, playerId, args, moveId, framework }) {
    const g = G;
    const { cardId, mode, targets, paymentResourceIds } = args;
    const definition = framework.cards.getDefinition(cardId) as Card | undefined;
    const substitution = findDeployCostSubstitution(definition);
    const substitutionTargets =
      mode === "alternate" && substitution?.action.action === "deployCostSubstitution"
        ? deploySubstitutionCandidates(cardId, playerId, g, framework, substitution.action).filter(
            (id) => (targets ?? []).includes(id),
          )
        : [];
    const selectedEffectTargets = targets?.filter((id) => !substitutionTargets.includes(id));
    const effectTargets =
      selectedEffectTargets && selectedEffectTargets.length > 0 ? selectedEffectTargets : undefined;
    const paidCost =
      mode === "alternate" && substitution
        ? payCardCost(cardId, playerId, g, framework, {
            costOverride: substitution.action.cost,
            paymentResourceIds,
          })
        : payCardCost(cardId, playerId, g, framework, { paymentResourceIds });
    if (substitutionTargets.length > 0) {
      handleDestroyAction(substitutionTargets as CardInstanceId[], {
        G: g,
        sourcePlayerId: playerId,
        sourceCardId: cardId,
        framework,
      });
    }

    // Deploy to BattleArea
    framework.zones.moveCard(cardId, { zone: "battleArea", playerId });
    g.turnMetadata.deployedThisTurn.push(cardId);
    const entersRested = shouldDeployRested(cardId, playerId, g, framework);
    framework.cards.patchMeta(cardId, { deployedThisTurn: true, exhausted: entersRested });
    g.exhausted[cardId] = entersRested; // Rule: units enter play active unless a replacement applies.

    // Placement event — synchronous zone-change signal. Listeners that
    // need the post-trigger state should subscribe to UNIT_DEPLOYED
    // (fired by the completion fence below) instead.
    emitGundamEvent(framework.events, {
      kind: "UNIT_PLACED",
      payload: { cardId, playerId },
    });
    emitGundamLog(framework, {
      type: "gundam.move.deployUnit",
      values: { cardId, playerId, cost: paidCost },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    // Rule 11-4: settle battle-area excess before Deploy triggers continue.
    enqueueBattleAreaExcessManagement(g, playerId, cardId, framework, moveId);

    // Enqueue 【Deploy】 effects onto g.pendingEffects; the flow engine's
    // onTransitionCheck drains auto-resolvable heads and halts on any
    // head that still needs player input.
    const event = { type: "unitDeployed", cardId, playerId, fromZone: "hand" };
    enqueueOwnCardTriggers(g, event, cardId, playerId, framework, {
      chosenTargets: effectTargets,
      originatingMoveId: moveId,
    });
    enqueueObserverTriggers(g, event, framework, cardId, { originatingMoveId: moveId });

    // Completion fence — fires UNIT_DEPLOYED only after every triggered
    // effect produced by this move has resolved. Tier-sorted strictly
    // last in the queue (see `tierOf`) so observer triggers from the
    // standby player + rule 10-1-6-7 preempts all settle first.
    enqueueMoveCompletionFence(
      g,
      playerId,
      framework,
      [
        {
          kind: "emitEvent",
          event: { kind: "UNIT_DEPLOYED", payload: { cardId, playerId } },
        },
      ],
      moveId,
    );
  },
};

function findDeployCostSubstitution(
  definition: Card | undefined,
): { action: DeployCostAlternative; sourceText: string } | undefined {
  for (const effect of (definition?.effects ?? []) as CardEffect[]) {
    if (effect.type !== "substitution") continue;
    for (const directive of effect.directives) {
      if (!("action" in directive)) continue;
      const action = (directive as EffectDirective).action;
      if (action.action === "deployCostSubstitution" || action.action === "deployCostOverride") {
        return { action, sourceText: effect.sourceText };
      }
    }
  }
  return undefined;
}

function deploySubstitutionCandidates(
  sourceCardId: string,
  playerId: string,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
  action: DeployCostAlternative,
): string[] {
  if (action.action === "deployCostOverride") return [];
  const ctx = buildTargetResolutionContext(G, playerId, framework, { sourceCardId });
  const matching = evaluateTargetFilter(
    action.destroyTarget,
    gatherAllCardsForTargeting(ctx),
    ctx,
  ) as string[];
  return matching.filter((cardId) => !isDestructionPreventedFor(cardId, playerId, G, framework));
}

function isDeployAlternativeAvailable(
  action: DeployCostAlternative,
  candidates: readonly string[],
  playerId: string,
  G: ReadonlyGundamG,
  framework: FrameworkReadAPI,
  sourceCardId: string,
): boolean {
  if (action.action === "deployCostOverride") {
    return evaluateCondition(
      action.condition,
      buildTargetResolutionContext(G, playerId, framework, { sourceCardId }),
    );
  }
  return candidates.length >= getFilterCountBounds(action.destroyTarget).min;
}

function shouldDeployRested(
  cardId: string,
  _playerId: string,
  g: Parameters<GundamMoveDefinition<"deployUnit">["execute"]>[0]["G"],
  framework: Parameters<GundamMoveDefinition<"deployUnit">["execute"]>[0]["framework"],
): boolean {
  const deployed = framework.cards.get(cardId);
  if (!deployed) return false;

  for (const sourcePlayerId of Object.keys(g.players)) {
    for (const sourceId of framework.zones.getCards({
      zone: "battleArea",
      playerId: sourcePlayerId,
    })) {
      const def = framework.cards.getDefinition(sourceId) as Card | undefined;
      if (!def?.effects?.length) continue;
      const ctx = buildTargetResolutionContext(g, sourcePlayerId, framework, {
        sourceCardId: sourceId,
      });
      for (const effect of def.effects as CardEffect[]) {
        if (effect.type !== "constant") continue;
        if (effect.activation.conditions?.length) {
          const met = effect.activation.conditions.every((cond) =>
            evaluateCondition(cond as EffectCondition, ctx),
          );
          if (!met) continue;
        }
        for (const directive of effect.directives) {
          if (!("action" in directive)) continue;
          const action = (directive as EffectDirective).action;
          if (action.action === "deployRestedByFriendlyNameCount") {
            const matches = evaluateTargetFilter(action.target, [deployed], ctx);
            if (!matches.includes(cardId as never)) continue;
            const sourceOwner = framework.cards.getOwner(sourceId);
            const friendlyUnits = sourceOwner
              ? framework.zones.getCards({ zone: "battleArea", playerId: sourceOwner })
              : [];
            const namedCount = friendlyUnits.filter((friendlyId) => {
              const friendlyDef = framework.cards.getDefinition(friendlyId) as Card | undefined;
              return action.names.some((name) => friendlyDef?.name.includes(name));
            }).length;
            const deployedDef = framework.cards.getDefinition(cardId) as Card | undefined;
            if (deployedDef?.type === "unit" && deployedDef.level <= namedCount + 1) return true;
            continue;
          }
          if (action.action !== "deployRested") continue;
          const matches = evaluateTargetFilter(action.target, [deployed], ctx);
          if (matches.includes(cardId as never)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
