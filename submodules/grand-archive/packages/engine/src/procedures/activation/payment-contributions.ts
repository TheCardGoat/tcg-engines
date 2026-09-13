import type { GrandArchiveAbilityCost } from "@tcg/grand-archive-types";
import type { GrandArchivePaymentContributionDeclaration } from "../../commands/commands.ts";
import { payGrandArchiveAbilityCost, type GrandArchiveCostPaymentSelection } from "./costs.ts";
import type { GrandArchiveProposedEvent } from "../../kernel/events.ts";
import {
  evaluateGrandArchiveAmount,
  matchesGrandArchiveCardFilter,
  resolveGrandArchivePlayers,
  GrandArchiveUnsupportedRuleError,
  type GrandArchiveEvaluationContext,
} from "../effects/evaluation.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import type { GrandArchiveAppliedRule } from "../../rules/state/rule-modifications.ts";

type PaymentCostKind = "memory" | "reserve";

export interface GrandArchivePaymentContributionResult {
  readonly cost: GrandArchiveAbilityCost;
  readonly events: readonly GrandArchiveProposedEvent[];
  readonly paidBindings: GrandArchiveEvaluationContext["bindings"];
  readonly contributed: Readonly<Record<PaymentCostKind, number>>;
}

interface ContributionPayment {
  readonly events: readonly GrandArchiveProposedEvent[];
  readonly bindings: GrandArchiveEvaluationContext["bindings"];
  readonly paidUnits: number;
}

function ruleUsesFloatingMemorySource(rule: GrandArchiveAppliedRule | undefined): boolean {
  const filter = rule?.effect.paymentSourceFilter;
  return filter?.kind === "has-keyword" && filter.keyword === "floating-memory";
}

function numericCostAmount(
  cost: GrandArchiveAbilityCost,
  kind: PaymentCostKind,
  evaluation: GrandArchiveEvaluationContext,
  command: GrandArchiveCostPaymentSelection,
): number {
  switch (cost.kind) {
    case "all":
      return cost.costs.reduce(
        (total, child) => total + numericCostAmount(child, kind, evaluation, command),
        0,
      );
    case "one-of": {
      const selected = cost.costs[command.costOptionIndex ?? 0];
      if (!selected) throw new Error("Selected cost option does not exist");
      return numericCostAmount(selected, kind, evaluation, command);
    }
    case "optional":
      return command.payOptionalCost ? numericCostAmount(cost.cost, kind, evaluation, command) : 0;
    case "pay-memory":
      return kind === "memory" ? checkedAmount(cost, evaluation) : 0;
    case "pay-reserve":
      return kind === "reserve" ? checkedAmount(cost, evaluation) : 0;
    default:
      return 0;
  }
}

function checkedAmount(
  cost: Extract<GrandArchiveAbilityCost, { readonly kind: "pay-memory" | "pay-reserve" }>,
  evaluation: GrandArchiveEvaluationContext,
): number {
  const amount = evaluateGrandArchiveAmount(cost.amount, evaluation);
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new Error(`${cost.kind} requires a non-negative integer amount`);
  }
  return amount;
}

function reduceNumericCost(
  cost: GrandArchiveAbilityCost,
  kind: PaymentCostKind,
  reduction: number,
  evaluation: GrandArchiveEvaluationContext,
  command: GrandArchiveCostPaymentSelection,
): GrandArchiveAbilityCost {
  let remaining = reduction;
  const reduce = (current: GrandArchiveAbilityCost): GrandArchiveAbilityCost => {
    switch (current.kind) {
      case "all":
        return {
          kind: "all",
          costs: [reduce(current.costs[0]), ...current.costs.slice(1).map(reduce)],
        };
      case "one-of": {
        const selectedIndex = command.costOptionIndex ?? 0;
        if (!current.costs[selectedIndex]) throw new Error("Selected cost option does not exist");
        const [first, second, ...rest] = current.costs.map((child, index) =>
          index === selectedIndex ? reduce(child) : child,
        );
        if (!first || !second) throw new Error("Alternative cost requires at least two options");
        return {
          kind: "one-of",
          costs: [first, second, ...rest],
        };
      }
      case "optional":
        return command.payOptionalCost ? { ...current, cost: reduce(current.cost) } : current;
      case "pay-memory":
      case "pay-reserve": {
        const currentKind = current.kind === "pay-memory" ? "memory" : "reserve";
        if (currentKind !== kind || remaining === 0) return current;
        const amount = checkedAmount(current, evaluation);
        const applied = Math.min(amount, remaining);
        remaining -= applied;
        return { ...current, amount: amount - applied };
      }
      default:
        return current;
    }
  };
  const result = reduce(cost);
  if (remaining !== 0) {
    throw new Error(`Payment contributions exceed the declared ${kind} cost`);
  }
  return result;
}

function implicitPayment(
  rule: GrandArchiveAppliedRule,
  declaration: GrandArchivePaymentContributionDeclaration,
): ContributionPayment {
  const effect = rule.effect;
  const fromZone = effect.fromZone;
  if (!fromZone || !effect.paymentOwner || !effect.paymentSourceFilter) {
    throw new GrandArchiveUnsupportedRuleError(
      `payment contribution ${rule.id} has neither a cost nor a complete payment-source filter`,
    );
  }
  if ((declaration.costSelections?.length ?? 0) > 0) {
    throw new Error("A filter-based payment contribution cannot include structured selections");
  }
  if (
    (declaration.reservePayment?.length ?? 0) > 0 ||
    (declaration.costPaymentOrders?.length ?? 0) > 0 ||
    declaration.costOptionIndex !== undefined ||
    declaration.payOptionalCost !== undefined
  ) {
    throw new Error("A filter-based contribution cannot include a structured cost declaration");
  }
  const selected = declaration.paymentSourceIds ?? [];
  if (selected.length === 0 || new Set(selected).size !== selected.length) {
    throw new Error("A filter-based payment contribution requires distinct payment sources");
  }
  const owners = resolveGrandArchivePlayers(effect.paymentOwner, rule.evaluation);
  for (const objectId of selected) {
    const object = rule.evaluation.state.objects[objectId];
    if (
      !object ||
      object.zone !== fromZone ||
      !owners.includes(object.ownerId) ||
      !matchesGrandArchiveCardFilter(object, effect.paymentSourceFilter, {
        ...rule.evaluation,
        candidateId: object.id,
      })
    ) {
      throw new Error(`Object ${objectId} is not an eligible payment contribution source`);
    }
  }
  return {
    events: selected.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: fromZone,
      to: "banishment" as const,
      actorId: rule.evaluation.controllerId,
      cause: { kind: "rule" as const, rule: "pay-filtered-cost-contribution" },
    })),
    bindings: {},
    paidUnits: selected.length,
  };
}

function structuredPayment(
  rule: GrandArchiveAppliedRule,
  declaration: GrandArchivePaymentContributionDeclaration,
): ContributionPayment {
  if (!rule.effect.cost) return implicitPayment(rule, declaration);
  if ((declaration.paymentSourceIds?.length ?? 0) > 0) {
    throw new Error("A structured payment contribution cannot include payment source ids");
  }
  const payment = payGrandArchiveAbilityCost(
    rule.effect.cost,
    {
      reservePayment: declaration.reservePayment,
      costSelections: declaration.costSelections,
      costPaymentOrders: declaration.costPaymentOrders,
      costOptionIndex: declaration.costOptionIndex,
      payOptionalCost: declaration.payOptionalCost,
    },
    rule.evaluation,
  );
  return {
    events: payment.events,
    bindings: payment.paidBindings,
    paidUnits: payment.paidUnits,
  };
}

/**
 * Pays every declared optional contribution in declaration order, then reduces only the
 * selected payable reserve/memory components. Card characteristics remain unchanged.
 */
export function applyGrandArchivePaymentContributions(
  cost: GrandArchiveAbilityCost,
  rules: readonly GrandArchiveAppliedRule[],
  declarations: readonly GrandArchivePaymentContributionDeclaration[] | undefined,
  evaluation: GrandArchiveEvaluationContext,
  command: GrandArchiveCostPaymentSelection,
): GrandArchivePaymentContributionResult {
  const selected = declarations ?? [];
  if (new Set(selected.map((declaration) => declaration.ruleId)).size !== selected.length) {
    throw new Error("A payment contribution rule cannot be declared more than once");
  }
  const rulesById = new Map(rules.map((rule) => [rule.id, rule]));
  let reducedCost = cost;
  const events: GrandArchiveProposedEvent[] = [];
  let paidBindings: GrandArchiveEvaluationContext["bindings"] = {};
  const contributed: Record<PaymentCostKind, number> = { memory: 0, reserve: 0 };
  const usedPaymentSourceIds = new Set<GrandArchiveObjectId>();
  const ordered = [...selected].sort((left, right) => {
    const leftUsesFloatingMemory = ruleUsesFloatingMemorySource(rulesById.get(left.ruleId));
    const rightUsesFloatingMemory = ruleUsesFloatingMemorySource(rulesById.get(right.ruleId));
    return Number(rightUsesFloatingMemory) - Number(leftUsesFloatingMemory);
  });
  for (const declaration of ordered) {
    const rule = rulesById.get(declaration.ruleId);
    if (!rule) throw new Error(`Payment contribution rule ${declaration.ruleId} is not active`);
    const kind = rule.effect.costKind;
    if (!kind) {
      throw new GrandArchiveUnsupportedRuleError(
        `payment contribution ${rule.id} does not identify a cost kind`,
      );
    }
    const payment = structuredPayment(rule, declaration);
    const paymentSourceIds = new Set(
      payment.events.flatMap((event) => ("objectId" in event ? [event.objectId] : [])),
    );
    for (const objectId of paymentSourceIds) {
      if (usedPaymentSourceIds.has(objectId)) {
        throw new Error(`Object ${objectId} cannot fund multiple payment contributions`);
      }
      usedPaymentSourceIds.add(objectId);
    }
    if (payment.paidUnits === 0) {
      throw new Error("A declared payment contribution must pay at least one object or counter");
    }
    const amount = rule.effect.amount
      ? evaluateGrandArchiveAmount(rule.effect.amount, rule.evaluation)
      : 1;
    if (!Number.isSafeInteger(amount) || amount < 0) {
      throw new Error("A payment contribution amount must be a non-negative integer");
    }
    const contribution =
      rule.effect.contributionBasis === "per-paid-object" ? amount * payment.paidUnits : amount;
    const available = numericCostAmount(reducedCost, kind, evaluation, command);
    if (contribution <= 0 || contribution > available) {
      throw new Error(`Payment contribution must pay a positive part of the ${kind} cost`);
    }
    reducedCost = reduceNumericCost(reducedCost, kind, contribution, evaluation, command);
    contributed[kind] += contribution;
    events.push(...payment.events);
    paidBindings = { ...paidBindings, ...payment.bindings };
  }
  return { cost: reducedCost, events, paidBindings, contributed };
}
