import { grandArchiveBanishmentProvenance } from "../effects/evaluation.ts";
import { grandArchiveSelectionNumericProperty } from "./selection-values.ts";
import type { GrandArchiveAbilityCost, GrandArchiveSelectionCount } from "@tcg/grand-archive-types";
import { grandArchiveObjectFace } from "../../game/card-runtime.ts";
import { deriveGrandArchiveCharacteristics } from "../../rules/state/continuous.ts";
import type {
  GrandArchiveCommand,
  GrandArchiveCostPaymentOrder,
  GrandArchiveReservePaymentSource,
} from "../../commands/commands.ts";
import type { GrandArchiveProposedEvent } from "../../kernel/events.ts";
import {
  compareGrandArchiveNumbers,
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  grandArchiveCounterKey,
  grandArchiveObjectCounterCount,
  matchesGrandArchiveCardFilter,
  resolveGrandArchivePlayers,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
  type GrandArchiveEvaluationContext,
} from "../effects/evaluation.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import { grandArchiveObjectHasActiveKeyword } from "../../rules/abilities/intrinsic-keywords.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { shuffleGrandArchiveObjects } from "../../game/random.ts";
import {
  collectGrandArchiveActionRules,
  grandArchiveActionIsForbidden,
  grandArchivePlayerActionIsForbidden,
} from "../../rules/state/rule-modifications.ts";

export interface GrandArchiveCostPaymentSelection {
  readonly reservePayment?: readonly GrandArchiveReservePaymentSource[];
  readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
  readonly costPaymentOrders?: readonly GrandArchiveCostPaymentOrder[];
  readonly costOptionIndex?: number;
  readonly payOptionalCost?: boolean;
}

type PaymentCommand =
  | GrandArchiveCostPaymentSelection
  | Extract<
      GrandArchiveCommand,
      { readonly move: "activate-ability" | "activate-card" | "bestow-boon" | "materialize" }
    >;

export interface GrandArchiveCostPaymentResult {
  readonly events: readonly GrandArchiveProposedEvent[];
  readonly paidBindings: GrandArchiveEvaluationContext["bindings"];
  /** Number of concrete objects or counters consumed by this structured payment. */
  readonly paidUnits: number;
}

export interface GrandArchiveContextualCost {
  readonly cost: GrandArchiveAbilityCost;
  readonly evaluation: GrandArchiveEvaluationContext;
  readonly payerId: GrandArchivePlayerId;
}

interface CostCursor {
  reservePaymentIndex: number;
  selectionIndex: number;
  readonly reservePayment: readonly GrandArchiveReservePaymentSource[];
  readonly costSelections: readonly (readonly GrandArchiveObjectId[])[];
  readonly costPaymentOrders: ReadonlyMap<string, GrandArchiveCostPaymentOrder>;
  readonly usedCostPaymentOrders: Set<string>;
  readonly events: GrandArchiveProposedEvent[];
  readonly bindings: Record<
    string,
    import("../effects/evaluation.ts").GrandArchiveExecutionBinding
  >;
  previewState: GrandArchiveMatchState;
  random: import("../../game/model.ts").GrandArchiveRandomState;
  paidUnits: number;
}

const paymentPreviewKernel = new GrandArchiveTransactionKernel();

function appendPaymentEvents(
  cursor: CostCursor,
  events: readonly GrandArchiveProposedEvent[],
): void {
  for (const event of events) {
    cursor.events.push(event);
    cursor.previewState = paymentPreviewKernel.transact(cursor.previewState, [event]).state;
  }
}

function paymentMethodIsForbidden(
  evaluation: GrandArchiveEvaluationContext,
  objectId: GrandArchiveObjectId,
  paymentMethodKind: "remove-counter" | "rest",
  counter?: string,
): boolean {
  const object = evaluation.state.objects[objectId];
  if (!object) return false;
  return collectGrandArchiveActionRules({
    action: "pay-cost",
    activationKind: "ability",
    paymentMethodKind,
    ...(counter ? { counter } : {}),
    playerId: evaluation.controllerId,
    candidateId: object.id,
    fromZone: object.zone,
    evaluation: { ...evaluation, candidateId: object.id },
  }).some((rule) => rule.effect.mode === "forbid");
}

export interface GrandArchiveReserveCostPaymentResult {
  readonly events: readonly GrandArchiveProposedEvent[];
  readonly nextIndex: number;
}

function reservePaymentSourceId(source: GrandArchiveReservePaymentSource): GrandArchiveObjectId {
  switch (source.kind) {
    case "card":
      return source.cardId;
    case "reservable":
      return source.objectId;
    default:
      return assertNever(source);
  }
}

export function assertGrandArchiveReservePaymentDistinct(
  payment: readonly GrandArchiveReservePaymentSource[],
): void {
  const ids = payment.map(reservePaymentSourceId);
  if (new Set(ids).size !== ids.length) {
    throw new Error("An object cannot pay more than one unit of the same reserve payment");
  }
}

/**
 * Consumes an ordered portion of one declared reserve payment. A unit is paid
 * either by reserving another hand card or by resting a ready Reservable object.
 */
export function payGrandArchiveReserveCost(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: import("../../game/identity.ts").GrandArchivePlayerId,
  payment: readonly GrandArchiveReservePaymentSource[],
  amount: number,
  startIndex = 0,
  excludedCardId?: GrandArchiveObjectId,
): GrandArchiveReserveCostPaymentResult {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error("A reserve cost must be a non-negative integer");
  }
  const selected = payment.slice(startIndex, startIndex + amount);
  if (selected.length !== amount) {
    throw new Error(`Reserve payment requires exactly ${amount} payment sources`);
  }
  const events = selected.map((source): GrandArchiveProposedEvent => {
    switch (source.kind) {
      case "card": {
        const object = state.objects[source.cardId];
        if (
          !object ||
          object.ownerId !== playerId ||
          object.zone !== "hand" ||
          object.id === excludedCardId
        ) {
          throw new Error("Reserve payment cards must be other cards in the payer's hand");
        }
        return {
          type: "object-moved",
          objectId: object.id,
          from: "hand",
          to: "memory",
          actorId: playerId,
          cause: { kind: "rule", rule: "pay-reserve-cost" },
        };
      }
      case "reservable": {
        const object = state.objects[source.objectId];
        if (
          !object ||
          object.controllerId !== playerId ||
          object.zone !== "field" ||
          object.states.has("rested") ||
          !grandArchiveObjectHasActiveKeyword(program, state, object, "reservable")
        ) {
          throw new Error(
            "Reservable payment sources must be ready field objects controlled by the payer with active Reservable",
          );
        }
        return {
          type: "object-state-changed",
          objectId: object.id,
          state: "rested",
          value: true,
          actorId: playerId,
          cause: { kind: "rule", rule: "pay-reserve-cost-with-reservable" },
        };
      }
      default:
        return assertNever(source);
    }
  });
  return { events, nextIndex: startIndex + amount };
}

function selectionBounds(
  count: GrandArchiveSelectionCount,
  evaluation: GrandArchiveEvaluationContext,
): { readonly minimum: number; readonly maximum: number } {
  switch (count.kind) {
    case "exactly": {
      const amount = evaluateGrandArchiveAmount(count.amount, evaluation);
      return { minimum: amount, maximum: amount };
    }
    case "up-to":
      return { minimum: 0, maximum: evaluateGrandArchiveAmount(count.amount, evaluation) };
    case "at-least":
      return {
        minimum: evaluateGrandArchiveAmount(count.amount, evaluation),
        maximum: Number.POSITIVE_INFINITY,
      };
    case "between":
      return {
        minimum: evaluateGrandArchiveAmount(count.minimum, evaluation),
        maximum: evaluateGrandArchiveAmount(count.maximum, evaluation),
      };
    case "all":
    case "any-number":
      return { minimum: 0, maximum: Number.POSITIVE_INFINITY };
    case "conditional":
      return selectionBounds(
        evaluateGrandArchiveCondition(count.condition, evaluation) ? count.then : count.else,
        evaluation,
      );
    default:
      return assertNever(count);
  }
}

function characteristicValues(
  objectId: GrandArchiveObjectId,
  characteristic: "name" | "type" | "class" | "element" | "subtype",
  evaluation: GrandArchiveEvaluationContext,
): readonly string[] {
  const object = evaluation.state.objects[objectId];
  if (!object) return [];
  const characteristics = deriveGrandArchiveCharacteristics(object, evaluation);
  switch (characteristic) {
    case "name":
      return characteristics.names;
    case "type":
      return characteristics.types;
    case "class":
      return characteristics.classes;
    case "element":
      return characteristics.elements;
    case "subtype":
      return characteristics.subtypes;
    default:
      return assertNever(characteristic);
  }
}

function selectCostObjects(
  cost: Extract<
    GrandArchiveAbilityCost,
    {
      readonly kind:
        | "select-and-sacrifice"
        | "select-and-rest"
        | "select-and-move"
        | "select-and-remove-counters"
        | "select-and-reveal"
        | "reveal";
    }
  >,
  evaluation: GrandArchiveEvaluationContext,
  cursor: CostCursor,
): readonly GrandArchiveObjectId[] {
  const players = resolveGrandArchivePlayers(cost.player, evaluation);
  const eligible = Object.values(evaluation.state.objects).filter((object) => {
    if (cost.kind === "select-and-sacrifice" || cost.kind === "select-and-rest") {
      return (
        object.zone === "field" &&
        players.includes(object.controllerId) &&
        (cost.kind !== "select-and-sacrifice" ||
          !grandArchiveObjectHasActiveKeyword(
            evaluation.program,
            evaluation.state,
            object,
            "immortality",
          )) &&
        (!cost.filter || matchesGrandArchiveCardFilter(object, cost.filter, evaluation)) &&
        (cost.kind !== "select-and-rest" || !object.states.has("rested"))
      );
    }
    if (cost.kind === "select-and-move") {
      if (object.zone !== cost.from) return false;
      if (cost.host) {
        const hosts = resolveGrandArchiveSubjectObjects(cost.host, evaluation);
        if (!object.hostId || !hosts.some((host) => host.id === object.hostId)) return false;
      }
      const related =
        cost.relationship === "owned-by"
          ? players.includes(object.ownerId)
          : cost.relationship === "lineage-of"
            ? (() => {
                const host = object.hostId ? evaluation.state.objects[object.hostId] : undefined;
                return (
                  object.zone === "inner-lineage" &&
                  host !== undefined &&
                  players.includes(host.controllerId)
                );
              })()
            : players.includes(object.controllerId);
      return (
        related && (!cost.filter || matchesGrandArchiveCardFilter(object, cost.filter, evaluation))
      );
    }
    if (cost.kind === "select-and-remove-counters") {
      const subjects = cost.subject
        ? resolveGrandArchiveSubjectObjects(cost.subject, evaluation)
        : undefined;
      return (
        (!subjects || subjects.some((subject) => subject.id === object.id)) &&
        players.includes(object.controllerId) &&
        (!cost.objectFilter ||
          matchesGrandArchiveCardFilter(object, cost.objectFilter, evaluation)) &&
        grandArchiveObjectCounterCount(object, cost.counter) > 0
      );
    }
    if (cost.kind === "reveal") {
      return (
        object.zone === cost.from &&
        players.includes(object.ownerId) &&
        (!cost.filter || matchesGrandArchiveCardFilter(object, cost.filter, evaluation))
      );
    }
    if (cost.relationship === "banished-by") {
      const hosts = cost.host ? resolveGrandArchiveSubjectObjects(cost.host, evaluation) : [];
      if (hosts.length === 0) {
        throw new GrandArchiveUnsupportedRuleError("banished-by cost without a host");
      }
      return (
        object.zone === cost.from &&
        object.banishedBy !== undefined &&
        hosts.some(
          (host) =>
            host.id === object.banishedBy?.sourceId &&
            host.incarnation === object.banishedBy.sourceIncarnation,
        ) &&
        players.includes(object.ownerId) &&
        (!cost.filter || matchesGrandArchiveCardFilter(object, cost.filter, evaluation))
      );
    }
    return (
      object.zone === cost.from &&
      (cost.relationship === "zone-of"
        ? players.includes(object.ownerId)
        : players.includes(object.controllerId)) &&
      (!cost.filter || matchesGrandArchiveCardFilter(object, cost.filter, evaluation))
    );
  });
  const bounds = selectionBounds(cost.count, evaluation);
  const selected =
    cost.kind === "select-and-move" && cost.random
      ? (() => {
          if (!Number.isFinite(bounds.maximum) || bounds.minimum !== bounds.maximum) {
            throw new GrandArchiveUnsupportedRuleError("variable-size random cost selection");
          }
          const shuffled = shuffleGrandArchiveObjects(
            eligible.map((object) => object.id),
            cursor.random,
          );
          cursor.random = shuffled.random;
          appendPaymentEvents(cursor, [
            {
              type: "random-state-changed",
              random: shuffled.random,
              cause: { kind: "rule", rule: "random-cost-selection" },
            },
          ]);
          return shuffled.value.slice(0, bounds.maximum);
        })()
      : (cursor.costSelections[cursor.selectionIndex++] ?? []);
  if (cost.kind !== "select-and-remove-counters" && new Set(selected).size !== selected.length) {
    throw new Error("A cost selection cannot contain the same object twice");
  }
  if (selected.length < bounds.minimum || selected.length > bounds.maximum) {
    throw new Error(`Cost ${cost.kind} has an illegal selection count`);
  }
  if (cost.count.kind === "all" && selected.length !== eligible.length) {
    throw new Error(`Cost ${cost.kind} requires every eligible object`);
  }
  if (selected.some((id) => !eligible.some((object) => object.id === id))) {
    throw new Error(`Cost ${cost.kind} contains an ineligible object`);
  }
  if (cost.kind === "select-and-remove-counters") {
    const selectedCounts = new Map<GrandArchiveObjectId, number>();
    for (const id of selected) selectedCounts.set(id, (selectedCounts.get(id) ?? 0) + 1);
    for (const [id, amount] of selectedCounts) {
      const object = evaluation.state.objects[id];
      if (!object || grandArchiveObjectCounterCount(object, cost.counter) < amount) {
        throw new Error("Not enough counters on a selected cost object");
      }
    }
  }
  if (cost.kind === "select-and-move" && cost.aggregateConstraint) {
    const constraint = cost.aggregateConstraint;
    let total = 0;
    for (const id of selected) {
      const object = evaluation.state.objects[id];
      const value = object
        ? grandArchiveSelectionNumericProperty(
            object,
            constraint.property,
            constraint.basis,
            evaluation,
          )
        : undefined;
      if (value === undefined) throw new Error(`Cost selection lacks ${constraint.property}`);
      total += value;
    }
    if (
      !compareGrandArchiveNumbers(
        total,
        constraint.operator,
        evaluateGrandArchiveAmount(constraint.value, evaluation),
      )
    ) {
      throw new Error("Cost selection fails its aggregate constraint");
    }
  }
  if (cost.kind === "select-and-move" && cost.singleZoneOwner) {
    const owners = new Set(selected.map((id) => evaluation.state.objects[id]?.ownerId));
    if (owners.size > 1) throw new Error("Cost selection must use one zone owner");
  }
  if (cost.kind === "select-and-move" && cost.distinctBy) {
    const seen = new Set<string>();
    for (const id of selected) {
      const values = characteristicValues(id, cost.distinctBy, evaluation);
      const key = [...values].sort().join("\u0000");
      if (seen.has(key)) throw new Error(`Cost selection must have distinct ${cost.distinctBy}`);
      seen.add(key);
    }
  }
  return selected;
}

function pay(
  cost: GrandArchiveAbilityCost,
  command: PaymentCommand,
  evaluation: GrandArchiveEvaluationContext,
  cursor: CostCursor,
  payerId: GrandArchivePlayerId,
  path: readonly number[] = [],
): void {
  evaluation = {
    ...evaluation,
    state: cursor.previewState,
    bindings: { ...evaluation.bindings, ...cursor.bindings },
  };
  switch (cost.kind) {
    case "all": {
      const key = costPathKey(path);
      const declaration = cursor.costPaymentOrders.get(key);
      const order = declaration?.order ?? cost.costs.map((_, index) => index);
      if (declaration) {
        assertExactCostPermutation(order, cost.costs.length);
        cursor.usedCostPaymentOrders.add(key);
      }
      for (const index of order) {
        pay(cost.costs[index]!, command, evaluation, cursor, payerId, [...path, index]);
      }
      return;
    }
    case "one-of": {
      const index = command.costOptionIndex ?? 0;
      const selected = cost.costs[index];
      if (!selected) throw new Error("Selected cost option does not exist");
      pay(selected, command, evaluation, cursor, payerId, [...path, index]);
      return;
    }
    case "optional":
      cursor.bindings[cost.bindPaidAs] = command.payOptionalCost === true;
      if (command.payOptionalCost) {
        pay(cost.cost, command, evaluation, cursor, payerId, [...path, 0]);
      }
      return;
    case "pay-reserve": {
      const amount = evaluateGrandArchiveAmount(cost.amount, evaluation);
      const result = payGrandArchiveReserveCost(
        evaluation.program,
        evaluation.state,
        payerId,
        cursor.reservePayment,
        amount,
        cursor.reservePaymentIndex,
        evaluation.sourceId,
      );
      cursor.reservePaymentIndex = result.nextIndex;
      appendPaymentEvents(cursor, result.events);
      cursor.paidUnits += amount;
      if (cost.bindResultAs) cursor.bindings[cost.bindResultAs] = amount;
      return;
    }
    case "pay-memory": {
      const amount = evaluateGrandArchiveAmount(cost.amount, evaluation);
      const memory = evaluation.state.zones[payerId].memory;
      if (memory.length < amount) throw new Error("Not enough cards in memory to pay cost");
      const shuffled = shuffleGrandArchiveObjects(memory, cursor.random);
      cursor.random = shuffled.random;
      appendPaymentEvents(cursor, [
        {
          type: "random-state-changed",
          random: shuffled.random,
          cause: { kind: "rule", rule: "random-ability-memory-payment" },
        },
      ]);
      const paid = shuffled.value.slice(0, amount);
      appendPaymentEvents(
        cursor,
        paid.map((objectId) => ({
          type: "object-moved" as const,
          objectId,
          from: "memory" as const,
          to: "banishment" as const,
          actorId: payerId,
          cause: { kind: "rule" as const, rule: "pay-ability-memory-cost" },
        })),
      );
      cursor.paidUnits += amount;
      if (cost.bindResultAs) cursor.bindings[cost.bindResultAs] = paid;
      return;
    }
    case "rest":
    case "wake": {
      const value = cost.kind === "rest";
      const objects = resolveGrandArchiveSubjectObjects(cost.subject, evaluation);
      if (
        objects.length === 0 ||
        objects.some(
          (object) =>
            object.zone !== "field" ||
            object.states.has("rested") === value ||
            (cost.kind === "rest" && paymentMethodIsForbidden(evaluation, object.id, "rest")) ||
            (cost.kind === "wake" &&
              grandArchiveActionIsForbidden({
                action: "wake",
                activationKind: "ability",
                playerId: evaluation.controllerId,
                candidateId: object.id,
                fromZone: object.zone,
                evaluation: { ...evaluation, candidateId: object.id },
              })),
        )
      ) {
        throw new Error(`Cannot pay ${cost.kind} cost`);
      }
      appendPaymentEvents(
        cursor,
        objects.map((object) => ({
          type: "object-state-changed" as const,
          objectId: object.id,
          state: "rested" as const,
          value,
          actorId: evaluation.controllerId,
          cause: { kind: "rule" as const, rule: `pay-${cost.kind}-cost` },
        })),
      );
      cursor.paidUnits += objects.length;
      return;
    }
    case "sacrifice": {
      const objects = resolveGrandArchiveSubjectObjects(cost.subject, evaluation);
      if (
        objects.length === 0 ||
        objects.some(
          (object) =>
            object.zone !== "field" ||
            grandArchiveObjectHasActiveKeyword(
              evaluation.program,
              evaluation.state,
              object,
              "immortality",
            ),
        )
      ) {
        throw new Error("Cannot pay sacrifice cost");
      }
      appendPaymentEvents(
        cursor,
        objects.map((object) => ({
          type: "object-moved" as const,
          objectId: object.id,
          from: "field" as const,
          to: "graveyard" as const,
          actorId: evaluation.controllerId,
          cause: { kind: "rule" as const, rule: "pay-sacrifice-cost" },
        })),
      );
      cursor.paidUnits += objects.length;
      return;
    }
    case "banish-self":
    case "discard-self": {
      const source = evaluation.sourceId
        ? evaluation.state.objects[evaluation.sourceId]
        : undefined;
      if (!source) throw new Error("Cost source does not exist");
      appendPaymentEvents(cursor, [
        {
          type: "object-moved",
          objectId: source.id,
          from: source.zone,
          to: cost.kind === "banish-self" ? "banishment" : "graveyard",
          actorId: evaluation.controllerId,
          cause: { kind: "rule", rule: `pay-${cost.kind}-cost` },
        },
      ]);
      cursor.paidUnits += 1;
      return;
    }
    case "move-self": {
      const source = evaluation.sourceId
        ? evaluation.state.objects[evaluation.sourceId]
        : undefined;
      if (!source || source.zone !== cost.from)
        throw new Error("Cost source is not in the required zone");
      appendPaymentEvents(cursor, [
        {
          type: "object-moved",
          objectId: source.id,
          from: cost.from,
          to: cost.to,
          actorId: evaluation.controllerId,
          cause: { kind: "rule", rule: "pay-move-self-cost" },
        },
      ]);
      cursor.paidUnits += 1;
      return;
    }
    case "add-counter":
    case "remove-counter": {
      const amount = evaluateGrandArchiveAmount(cost.amount, evaluation);
      const counter = grandArchiveCounterKey(cost.counter);
      const objects = resolveGrandArchiveSubjectObjects(cost.subject, evaluation);
      for (const object of objects) {
        const available = grandArchiveObjectCounterCount(object, cost.counter);
        if (cost.kind === "remove-counter") {
          if (available < amount) throw new Error("Not enough counters to pay cost");
          if (paymentMethodIsForbidden(evaluation, object.id, "remove-counter", counter)) {
            throw new Error("Counter removal is forbidden as a cost payment method");
          }
        }
        appendPaymentEvents(cursor, [
          {
            type: "counter-changed",
            objectId: object.id,
            counter,
            delta: cost.kind === "add-counter" ? amount : -amount,
            actorId: evaluation.controllerId,
            cause: { kind: "rule", rule: `pay-${cost.kind}-cost` },
          },
        ]);
        cursor.paidUnits += amount;
      }
      return;
    }
    case "recover": {
      const amount = evaluateGrandArchiveAmount(cost.amount, evaluation);
      if (!Number.isSafeInteger(amount) || amount <= 0) {
        throw new Error("Recover costs must have a positive integer amount");
      }
      if (
        grandArchivePlayerActionIsForbidden({
          action: "recover",
          playerId: evaluation.controllerId,
          evaluation,
        })
      ) {
        throw new Error("Player is forbidden from recovering to pay this cost");
      }
      const champions = resolveGrandArchiveSubjectObjects(
        { kind: "champion", player: "controller" },
        evaluation,
      );
      if (champions.length === 0 || champions.some((champion) => champion.damage < amount)) {
        throw new Error("Not enough champion damage to pay recover cost");
      }
      appendPaymentEvents(
        cursor,
        champions.map((champion) => ({
          type: "damage-removed" as const,
          objectId: champion.id,
          amount,
          actorId: evaluation.controllerId,
          cause: { kind: "rule" as const, rule: "pay-recover-cost" },
        })),
      );
      cursor.paidUnits += champions.length;
      return;
    }
    case "take-damage": {
      const amount = evaluateGrandArchiveAmount(cost.amount, evaluation);
      const objects = resolveGrandArchiveSubjectObjects(cost.subject, evaluation);
      if (objects.length === 0) throw new Error("Damage cost requires an affected object");
      appendPaymentEvents(
        cursor,
        objects.map((object) => ({
          type: "damage-marked" as const,
          objectId: object.id,
          amount,
          preventable: false as const,
          actorId: evaluation.controllerId,
          cause: { kind: "rule" as const, rule: "pay-take-damage-cost" },
        })),
      );
      cursor.paidUnits += objects.length;
      if (cost.bindResultAs)
        cursor.bindings[cost.bindResultAs] = objects.map((object) => object.id);
      return;
    }
    case "select-and-sacrifice":
    case "select-and-rest":
    case "select-and-move":
    case "select-and-remove-counters":
    case "select-and-reveal":
    case "reveal": {
      const selected = selectCostObjects(cost, evaluation, cursor);
      for (const objectId of selected) {
        const object = evaluation.state.objects[objectId]!;
        switch (cost.kind) {
          case "select-and-sacrifice":
            appendPaymentEvents(cursor, [
              {
                type: "object-moved",
                objectId,
                from: "field",
                to: "graveyard",
                actorId: evaluation.controllerId,
                cause: { kind: "rule", rule: "pay-select-and-sacrifice-cost" },
              },
            ]);
            break;
          case "select-and-rest":
            appendPaymentEvents(cursor, [
              {
                type: "object-state-changed",
                objectId,
                state: "rested",
                value: true,
                actorId: evaluation.controllerId,
                cause: { kind: "rule", rule: "pay-select-and-rest-cost" },
              },
            ]);
            break;
          case "select-and-move":
            appendPaymentEvents(cursor, [
              {
                type: "object-moved",
                objectId,
                from: cost.from,
                to: cost.to,
                ...(cost.to === "graveyard" ? { discarded: true as const } : {}),
                ...(cost.to === "banishment" && evaluation.sourceId
                  ? { banishedBy: grandArchiveBanishmentProvenance(evaluation) }
                  : {}),
                actorId: evaluation.controllerId,
                cause: { kind: "rule", rule: "pay-select-and-move-cost" },
              },
            ]);
            break;
          case "select-and-remove-counters": {
            const counter = grandArchiveCounterKey(cost.counter);
            appendPaymentEvents(cursor, [
              {
                type: "counter-changed",
                objectId,
                counter,
                delta: -1,
                actorId: evaluation.controllerId,
                cause: { kind: "rule", rule: "pay-select-and-remove-counter-cost" },
              },
            ]);
            break;
          }
          case "select-and-reveal":
          case "reveal":
            appendPaymentEvents(cursor, [
              {
                type: "card-revealed",
                objectId,
                playerId: evaluation.controllerId,
                actorId: evaluation.controllerId,
                cause: {
                  kind: "rule",
                  rule: cost.kind === "reveal" ? "pay-reveal-cost" : "pay-select-and-reveal-cost",
                },
              },
            ]);
            break;
          default:
            assertNever(cost);
        }
      }
      if (cost.bindResultAs) cursor.bindings[cost.bindResultAs] = selected;
      cursor.paidUnits += selected.length;
      return;
    }
    case "delevel-champion": {
      const champions = resolveGrandArchiveSubjectObjects(
        { kind: "champion", player: "controller" },
        evaluation,
      );
      if (champions.length !== 1) throw new Error("Delevel cost requires one champion");
      const champion = champions[0]!;
      const lineage = evaluation.state.zones[champion.ownerId]["inner-lineage"].filter(
        (objectId) => evaluation.state.objects[objectId]?.hostId === champion.id,
      );
      const cardId = lineage.at(-1);
      if (!cardId) throw new Error("Champion cannot be deleveled below its base card");
      appendPaymentEvents(cursor, [
        {
          type: "champion-deleveled",
          championId: champion.id,
          cardId,
          actorId: evaluation.controllerId,
          cause: { kind: "rule", rule: "pay-delevel-champion-cost" },
        },
      ]);
      cursor.paidUnits += 1;
      if (cost.bindResultAs) cursor.bindings[cost.bindResultAs] = [cardId];
      return;
    }
    default:
      return assertNever(cost);
  }
}

export function payGrandArchiveAbilityCost(
  cost: GrandArchiveAbilityCost,
  command: PaymentCommand,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveCostPaymentResult {
  assertGrandArchiveReservePaymentDistinct(command.reservePayment ?? []);
  const costPaymentOrders = indexCostPaymentOrders(command.costPaymentOrders ?? []);
  const cursor: CostCursor = {
    reservePaymentIndex: 0,
    selectionIndex: 0,
    reservePayment: command.reservePayment ?? [],
    costSelections: command.costSelections ?? [],
    costPaymentOrders,
    usedCostPaymentOrders: new Set(),
    events: [],
    bindings: {},
    previewState: evaluation.state,
    random: evaluation.state.random,
    paidUnits: 0,
  };
  pay(cost, command, evaluation, cursor, evaluation.controllerId);
  if (cursor.reservePaymentIndex !== cursor.reservePayment.length) {
    throw new Error("Payment includes reserve sources not required by the declared cost");
  }
  if (cursor.selectionIndex !== cursor.costSelections.length) {
    throw new Error("Payment includes cost selections that were not required");
  }
  assertEveryCostPaymentOrderUsed(cursor);
  return { events: cursor.events, paidBindings: cursor.bindings, paidUnits: cursor.paidUnits };
}

/**
 * Pays one atomic declaration containing costs imposed by independent rule sources.
 * Each cost is evaluated in its own source context while sharing one ordered payment cursor.
 */
export function payGrandArchiveContextualCosts(
  costs: readonly GrandArchiveContextualCost[],
  command: GrandArchiveCostPaymentSelection,
): GrandArchiveCostPaymentResult {
  assertGrandArchiveReservePaymentDistinct(command.reservePayment ?? []);
  const first = costs[0];
  if (!first) {
    if (
      (command.reservePayment?.length ?? 0) > 0 ||
      (command.costSelections?.length ?? 0) > 0 ||
      (command.costPaymentOrders?.length ?? 0) > 0 ||
      command.costOptionIndex !== undefined ||
      command.payOptionalCost !== undefined
    ) {
      throw new Error("Attack includes payment declarations when no attack cost is required");
    }
    return { events: [], paidBindings: {}, paidUnits: 0 };
  }
  const cursor: CostCursor = {
    reservePaymentIndex: 0,
    selectionIndex: 0,
    reservePayment: command.reservePayment ?? [],
    costSelections: command.costSelections ?? [],
    costPaymentOrders: indexCostPaymentOrders(command.costPaymentOrders ?? []),
    usedCostPaymentOrders: new Set(),
    events: [],
    bindings: {},
    previewState: first.evaluation.state,
    random: first.evaluation.state.random,
    paidUnits: 0,
  };
  for (const [index, contextual] of costs.entries()) {
    pay(contextual.cost, command, contextual.evaluation, cursor, contextual.payerId, [index]);
  }
  if (cursor.reservePaymentIndex !== cursor.reservePayment.length) {
    throw new Error("Payment includes reserve sources not required by the declared costs");
  }
  if (cursor.selectionIndex !== cursor.costSelections.length) {
    throw new Error("Payment includes cost selections that were not required");
  }
  assertEveryCostPaymentOrderUsed(cursor);
  return { events: cursor.events, paidBindings: cursor.bindings, paidUnits: cursor.paidUnits };
}

function costPathKey(path: readonly number[]): string {
  if (path.some((segment) => !Number.isSafeInteger(segment) || segment < 0)) {
    throw new Error("Cost payment order paths require non-negative integer segments");
  }
  return path.join(".");
}

function indexCostPaymentOrders(
  declarations: readonly GrandArchiveCostPaymentOrder[],
): ReadonlyMap<string, GrandArchiveCostPaymentOrder> {
  const indexed = new Map<string, GrandArchiveCostPaymentOrder>();
  for (const declaration of declarations) {
    const key = costPathKey(declaration.path);
    if (indexed.has(key))
      throw new Error(`Cost payment order path ${key || "<root>"} is duplicated`);
    indexed.set(key, declaration);
  }
  return indexed;
}

function assertExactCostPermutation(order: readonly number[], length: number): void {
  if (
    order.length !== length ||
    order.some((index) => !Number.isSafeInteger(index) || index < 0 || index >= length) ||
    new Set(order).size !== length
  ) {
    throw new Error("A cost payment order must be an exact permutation of its compound cost");
  }
}

function assertEveryCostPaymentOrderUsed(cursor: CostCursor): void {
  if (cursor.usedCostPaymentOrders.size !== cursor.costPaymentOrders.size) {
    throw new Error("A cost payment order does not address a payable compound cost");
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive cost variant: ${JSON.stringify(value)}`);
}
