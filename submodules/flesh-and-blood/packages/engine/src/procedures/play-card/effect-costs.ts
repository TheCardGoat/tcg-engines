import type { FabCardFilter, FabCost, FabEffect, FabZone } from "@tcg/flesh-and-blood-types";
import { isUpToCount } from "@tcg/flesh-and-blood-types";
import type { FabZoneKind } from "../../state.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabEventBindings, FabObjectSnapshot } from "../../rules/events.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { findObjectZone, matchesFabSnapshotFilter } from "../../rules/state-rules-view.ts";

export type FabVariableDestroyPlayCost = Extract<
  FabCost,
  { readonly class: "effect"; readonly type: "destroy" }
> & { readonly count: { readonly type: "x" } };

export type FabPlayCostRole = "additional-cost" | "alternative-cost";

/** One printed play-static or modal additional/alternative cost. */
export interface FabPlayCostSpec {
  readonly abilityId: string;
  readonly role: FabPlayCostRole;
  readonly optional: boolean;
  readonly cost: FabCost;
  readonly then: FabEffect | undefined;
}

export const USURP_COST_ID = "keyword:usurp";

export const PLAY_COST_DECLARED_PREFIX = "declared:";
export const PLAY_COST_PENDING_KEY = "pendingCostDeclaration";
export const PLAY_COST_OPTIONALS_DECLARED_KEY = "optionalCostsDeclared";
export const PLAY_COST_STAR_DECLARED_KEY = "starCostDeclared";
export const PLAY_COST_THEN_APPLIED_KEY = "thenApplied";

export function playCostDeclaredKey(abilityId: string): string {
  return `${PLAY_COST_DECLARED_PREFIX}${abilityId}`;
}

export function isPlayCostDeclared(
  bindings: FabEventBindings,
  abilityId: string,
): boolean | undefined {
  const value = bindings[playCostDeclaredKey(abilityId)];
  return typeof value === "boolean" ? value : undefined;
}

export function pendingPlayCostAbilityId(bindings: FabEventBindings): string | null {
  const value = bindings[PLAY_COST_PENDING_KEY];
  return typeof value === "string" ? value : null;
}

export function optionalPlayCostsDeclared(bindings: FabEventBindings): boolean {
  return bindings[PLAY_COST_OPTIONALS_DECLARED_KEY] === true;
}

export function starPlayCostDeclared(bindings: FabEventBindings): boolean {
  return bindings[PLAY_COST_STAR_DECLARED_KEY] === true;
}

export function playCostThenApplied(bindings: FabEventBindings): boolean {
  return bindings[PLAY_COST_THEN_APPLIED_KEY] === true;
}

function isVariableDestroyPlayCost(cost: FabCost): cost is FabVariableDestroyPlayCost {
  return (
    cost.class === "effect" &&
    cost.type === "destroy" &&
    typeof cost.count === "object" &&
    cost.count.type === "x"
  );
}

export type FabVariableTapPlayCost = Extract<
  FabCost,
  { readonly class: "effect"; readonly type: "tap" }
> & { readonly count: { readonly type: "x" } };

/** "{t} X Seismic Surge tokens you control" (PEN020 Seismic Shift). */
export function isVariableTapPlayCost(cost: FabCost): cost is FabVariableTapPlayCost {
  return (
    cost.class === "effect" &&
    cost.type === "tap" &&
    typeof cost.count === "object" &&
    cost.count.type === "x"
  );
}

export function isStarDestroyPlayCost(cost: FabCost): boolean {
  return (
    cost.class === "effect" &&
    cost.type === "destroy" &&
    typeof cost.count === "object" &&
    (cost.count.type === "all" || cost.count.type === "any-number")
  );
}

export function isFixedDestroyPlayCost(cost: FabCost): boolean {
  return (
    cost.class === "effect" &&
    cost.type === "destroy" &&
    (cost.count === undefined || typeof cost.count === "number")
  );
}

export function isMoveToDeckPlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "move-to-deck" }> {
  return (
    cost.class === "effect" &&
    cost.type === "move-to-deck" &&
    (cost.from === undefined || cost.from === "hand" || cost.from === "arsenal") &&
    (cost.count === undefined || cost.count === 1)
  );
}

export function moveToDeckPlayCostFrom(
  cost: Extract<FabCost, { readonly class: "effect"; readonly type: "move-to-deck" }>,
): "hand" | "arsenal" {
  return cost.from === "arsenal" ? "arsenal" : "hand";
}

export function isResourcePlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "asset"; readonly type: "resources" }> {
  return cost.class === "asset" && cost.type === "resources";
}

/** Effect costs that name a filter expose it; destroy-self and similar do not. */
export function playCostFilter(cost: FabCost): FabCardFilter | undefined {
  return cost.class === "effect" && "filter" in cost ? cost.filter : undefined;
}

export function isRevealHandPlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "reveal" }> {
  return (
    cost.class === "effect" &&
    cost.type === "reveal" &&
    (cost.from === undefined || cost.from === "hand")
  );
}

export function isRandomDiscardHandPlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "discard" }> {
  return (
    cost.class === "effect" &&
    cost.type === "discard" &&
    cost.count === 1 &&
    cost.random === true &&
    (cost.from === undefined || cost.from === "hand")
  );
}

export function isChargePlayCost(cost: FabCost): boolean {
  return cost.class === "effect" && cost.type === "charge";
}

export function isOptionalBanishGraveyardPlayCost(cost: FabCost, optional: boolean): boolean {
  return (
    optional &&
    cost.class === "effect" &&
    cost.type === "banish" &&
    cost.from === "graveyard" &&
    cost.count === 1
  );
}

/** "you may banish a card with blood debt from your hand" (Shadow of Ursur). */
export function isOptionalBanishHandPlayCost(
  cost: FabCost,
  optional: boolean,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "banish" }> {
  return (
    optional &&
    cost.class === "effect" &&
    cost.type === "banish" &&
    cost.from === "hand" &&
    cost.random !== true &&
    (cost.count === undefined || cost.count === 1)
  );
}

/** Required "banish N cards from your hand" additional cost (Elemental Strike). */
export function isRequiredBanishHandPlayCost(
  cost: FabCost,
  optional: boolean,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "banish" }> {
  return (
    !optional &&
    cost.class === "effect" &&
    cost.type === "banish" &&
    cost.from === "hand" &&
    cost.random !== true &&
    typeof cost.count === "number" &&
    cost.count >= 1
  );
}

export function isRandomBanishHandPlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "banish" }> {
  return (
    cost.class === "effect" &&
    cost.type === "banish" &&
    cost.from === "hand" &&
    cost.random === true &&
    typeof cost.count === "number" &&
    cost.count >= 1
  );
}

/** Required "banish your hand" cost — the whole filtered hand, no selection (DTD111). */
export function isAllBanishHandPlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "banish" }> {
  return (
    cost.class === "effect" &&
    cost.type === "banish" &&
    cost.from === "hand" &&
    cost.random !== true &&
    typeof cost.count === "object" &&
    cost.count.type === "all"
  );
}

/** Required "banish any number" hand cost, including the legal choice of zero. */
export function isAnyNumberBanishHandPlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "banish" }> {
  return (
    cost.class === "effect" &&
    cost.type === "banish" &&
    cost.from === "hand" &&
    cost.random !== true &&
    typeof cost.count === "object" &&
    cost.count.type === "any-number"
  );
}

export function isRequiredBanishGraveyardPlayCost(
  cost: FabCost,
  optional: boolean,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "banish" }> {
  return (
    !optional &&
    cost.class === "effect" &&
    cost.type === "banish" &&
    cost.from === "graveyard" &&
    typeof cost.count === "number" &&
    cost.count >= 1
  );
}

export function isSoulBanishPlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "banish" }> {
  return (
    cost.class === "effect" &&
    cost.type === "banish" &&
    cost.from === "soul" &&
    (typeof cost.count === "number" ||
      isUpToCount(cost.count) ||
      (typeof cost.count === "object" && cost.count.type === "x"))
  );
}

export function isSoulBanishXPlayCost(cost: FabCost): cost is Extract<
  FabCost,
  { readonly class: "effect"; readonly type: "banish" }
> & {
  readonly count: { readonly type: "x" };
} {
  return isSoulBanishPlayCost(cost) && typeof cost.count === "object" && cost.count.type === "x";
}

export function isNamedDiscardHandPlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "discard" }> {
  return (
    cost.class === "effect" &&
    cost.type === "discard" &&
    cost.random !== true &&
    (cost.from === undefined || cost.from === "hand") &&
    (cost.count === undefined || cost.count === 1 || typeof cost.count === "number")
  );
}

export function isRemoveCountersPlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "effect"; readonly type: "remove-counters" }> {
  return cost.class === "effect" && cost.type === "remove-counters";
}

export function isMixedAlternativePlayCost(
  cost: FabCost,
): cost is Extract<FabCost, { readonly class: "mixed"; readonly type: "alternative" }> {
  return (
    cost.class === "mixed" &&
    cost.type === "alternative" &&
    cost.costs.length > 0 &&
    cost.costs.every((part) => isPayablePlayCost(part, true))
  );
}

export function namedDiscardPlayCostCount(cost: FabCost): number | null {
  if (!isNamedDiscardHandPlayCost(cost)) return null;
  if (cost.count === undefined) return 1;
  return typeof cost.count === "number" ? cost.count : null;
}

export function banishPlayCostCount(cost: FabCost): number | null {
  if (cost.class !== "effect" || cost.type !== "banish") return null;
  if (typeof cost.count === "number") return cost.count;
  return null;
}

export interface FabHandBanishPlayCostBounds {
  readonly min: number;
  /** `null` means every eligible card may be selected. */
  readonly max: number | null;
}

/**
 * Canonical selection bounds for a hand-banish play cost.
 *
 * Quote, declaration, and resume must agree on these bounds. Keeping the
 * interpretation here prevents a cost from being offered under one rule and
 * rejected later under another.
 */
export function handBanishPlayCostBounds(
  cost: FabCost,
  optional: boolean,
): FabHandBanishPlayCostBounds | null {
  if (
    cost.class !== "effect" ||
    cost.type !== "banish" ||
    cost.from !== "hand" ||
    cost.random === true
  )
    return null;
  if (typeof cost.count === "object" && cost.count.type === "any-number") {
    const min = typeof cost.min === "number" ? Math.max(0, cost.min) : 0;
    return { min, max: null };
  }
  if (optional && cost.count === 1) return { min: 1, max: 1 };
  if (!optional && typeof cost.count === "number" && cost.count >= 1)
    return { min: cost.count, max: cost.count };
  return null;
}

export function soulBanishPlayCostMax(cost: FabCost): number | null {
  if (!isSoulBanishPlayCost(cost)) return null;
  if (typeof cost.count === "number") return cost.count;
  if (isUpToCount(cost.count) && typeof cost.count.amount === "number") return cost.count.amount;
  if (typeof cost.count === "object" && cost.count.type === "x") return null;
  return null;
}

export function removeCountersPlayCostMin(cost: FabCost): number {
  if (!isRemoveCountersPlayCost(cost)) return 1;
  if (typeof cost.min === "number") return Math.max(1, cost.min);
  if (typeof cost.count === "number") return cost.count;
  return 1;
}

function valueUsesBoundX(value: unknown): boolean {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(valueUsesBoundX);
  const record = value as Record<string, unknown>;
  if (record.type === "x") return true;
  return Object.values(record).some(valueUsesBoundX);
}

/**
 * Printed cost X: catalog `cost` is numeric-only, so X-cost cards omit it and
 * resolution amounts/filters bind `{ type: "x" }` to the chosen payment.
 */
export function usesPrintedXResourceCost(object: FabObjectSnapshot): boolean {
  // Use printed/base cost. Continuous reductions can materialize current.cost
  // as 0 on an X-cost card and must not hide the X declaration.
  if (typeof object.base.numeric.cost === "number") return false;
  return object.current.abilities.some(valueUsesBoundX);
}

/** First-class play costs the procedure can declare and pay without a per-card shim. */
export function isPayablePlayCost(cost: FabCost, optional: boolean): boolean {
  return (
    boundedMixedPlayCostParts(cost) !== null ||
    isResourcePlayCost(cost) ||
    isVariableDestroyPlayCost(cost) ||
    isVariableTapPlayCost(cost) ||
    isStarDestroyPlayCost(cost) ||
    isFixedDestroyPlayCost(cost) ||
    isMoveToDeckPlayCost(cost) ||
    isRevealHandPlayCost(cost) ||
    isRandomDiscardHandPlayCost(cost) ||
    isNamedDiscardHandPlayCost(cost) ||
    isChargePlayCost(cost) ||
    isOptionalBanishGraveyardPlayCost(cost, optional) ||
    isOptionalBanishHandPlayCost(cost, optional) ||
    isRequiredBanishHandPlayCost(cost, optional) ||
    isAnyNumberBanishHandPlayCost(cost) ||
    isAllBanishHandPlayCost(cost) ||
    isRandomBanishHandPlayCost(cost) ||
    isRequiredBanishGraveyardPlayCost(cost, optional) ||
    isSoulBanishPlayCost(cost) ||
    isRemoveCountersPlayCost(cost) ||
    isMixedAlternativePlayCost(cost)
  );
}

/**
 * Whether the optional/alternative cost currently has a legal payment.
 * Unpayable optional costs are auto-declined (CR 1.14 / 5.1.6: you cannot
 * declare a cost you cannot pay).
 */
export function optionalPlayCostIsPayable(
  state: FabRulesSnapshot,
  actorId: string,
  playedInstanceId: string,
  spec: FabPlayCostSpec,
): boolean {
  const { cost, optional } = spec;
  if (!isPayablePlayCost(cost, optional)) return false;
  // Every part of a bounded mixed cost is "up to N", so paying zero from each
  // part is a legal payment; the cost can never be unpayable (CR 5.1.6).
  if (boundedMixedPlayCostParts(cost) !== null) return true;
  // "Banish all cards in your hand" is vacuous with an empty hand.
  if (isAllBanishHandPlayCost(cost)) return true;
  if (isResourcePlayCost(cost)) return true;
  if (isOptionalBanishGraveyardPlayCost(cost, optional)) {
    const graveyard = state.containers.zonesByPlayerId[actorId]?.graveyard ?? [];
    const filter = playCostFilter(cost);
    return graveyard.some((instanceId) => {
      const object = snapshotObject(state, instanceId, actorId, "graveyard");
      return !filter || matchesFabSnapshotFilter(state, object, filter);
    });
  }
  const handBanishBounds = handBanishPlayCostBounds(cost, optional);
  if (handBanishBounds) {
    return (
      zonePlayCostCandidates(state, actorId, playedInstanceId, "hand", playCostFilter(cost))
        .length >= handBanishBounds.min
    );
  }
  if (isVariableTapPlayCost(cost)) return true;
  if (
    isVariableDestroyPlayCost(cost) ||
    isStarDestroyPlayCost(cost) ||
    isFixedDestroyPlayCost(cost)
  ) {
    const candidates =
      spec.abilityId === USURP_COST_ID
        ? usurpRunechantCandidates(state, actorId)
        : variableDestroyCostCandidates(state, actorId, playCostFilter(cost));
    const count = destroyPlayCostCount(cost);
    // Variable and "any number" destroy costs may legally declare zero.
    // Raise an Army's X is therefore 0 when its controller has no Gold.
    if (count === "all" || count === "any-number" || count === "x") return true;
    if (typeof count === "number") return candidates.length >= count;
    return false;
  }
  if (isMoveToDeckPlayCost(cost)) {
    return (
      moveToDeckCostCandidates(
        state,
        actorId,
        playedInstanceId,
        playCostFilter(cost),
        moveToDeckPlayCostFrom(cost),
      ).length > 0
    );
  }
  if (isRevealHandPlayCost(cost)) {
    const candidates = zonePlayCostCandidates(
      state,
      actorId,
      playedInstanceId,
      "hand",
      playCostFilter(cost),
    );
    if (
      typeof cost.count === "object" &&
      (cost.count.type === "all" || cost.count.type === "any-number")
    ) {
      return true;
    }
    const needed = typeof cost.count === "number" ? cost.count : 1;
    return candidates.length >= needed;
  }
  if (isRandomDiscardHandPlayCost(cost) || isChargePlayCost(cost)) {
    return (
      zonePlayCostCandidates(state, actorId, playedInstanceId, "hand", playCostFilter(cost))
        .length > 0
    );
  }
  if (isRandomBanishHandPlayCost(cost) || isNamedDiscardHandPlayCost(cost)) {
    const needed = isRandomBanishHandPlayCost(cost)
      ? (banishPlayCostCount(cost) ?? 1)
      : (namedDiscardPlayCostCount(cost) ?? 1);
    return (
      zonePlayCostCandidates(state, actorId, playedInstanceId, "hand", playCostFilter(cost))
        .length >= needed
    );
  }
  if (isRequiredBanishGraveyardPlayCost(cost, optional)) {
    return (
      zonePlayCostCandidates(state, actorId, playedInstanceId, "graveyard", playCostFilter(cost))
        .length >= (banishPlayCostCount(cost) ?? 1)
    );
  }
  if (isSoulBanishPlayCost(cost)) {
    if (isSoulBanishXPlayCost(cost)) {
      return (
        zonePlayCostCandidates(state, actorId, playedInstanceId, "soul", playCostFilter(cost))
          .length >= 1
      );
    }
    return true;
  }
  if (isRemoveCountersPlayCost(cost)) {
    return removeCountersPlayCostCandidates(state, actorId, cost).length > 0;
  }
  if (isMixedAlternativePlayCost(cost)) {
    return mixedAlternativePlayCostCandidates(state, actorId, playedInstanceId, cost).length > 0;
  }
  return false;
}

export function destroyPlayCostCount(cost: FabCost): number | "x" | "all" | "any-number" | null {
  if (cost.class !== "effect" || cost.type !== "destroy") return null;
  if (typeof cost.count === "object" && cost.count.type === "x") return "x";
  if (
    typeof cost.count === "object" &&
    (cost.count.type === "all" || cost.count.type === "any-number")
  )
    return cost.count.type;
  if (cost.count === undefined) return 1;
  if (typeof cost.count === "number") return cost.count;
  return null;
}

/** Printed additional/alternative costs attached to a play LKI. */
export function playCostSpecs(object: FabObjectSnapshot): readonly FabPlayCostSpec[] {
  const specs: FabPlayCostSpec[] = [];
  if (object.current.keywords.some((keyword) => keyword.name === "usurp")) {
    specs.push({
      abilityId: USURP_COST_ID,
      role: "additional-cost",
      // The declaration machinery auto-pays this conditional cost if able;
      // it never presents a player-controlled Pay/Decline choice.
      optional: true,
      cost: { class: "effect", type: "destroy", filter: { name: "Runechant" }, count: 1 },
      then: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: { selector: "self" },
        duration: "this-combat-chain",
      },
    });
  }

  for (const ability of object.current.abilities) {
    if (ability.kind === "static" && ability.playEffect) {
      const role = ability.playEffect.role;
      if (role !== "additional-cost" && role !== "alternative-cost") continue;
      if (!ability.playEffect.cost) continue;
      specs.push({
        abilityId: ability.id,
        role,
        optional: ability.playEffect.optional === true || role === "alternative-cost",
        cost: ability.playEffect.cost,
        then: ability.playEffect.then,
      });
      continue;
    }
    if (ability.kind === "modal" && ability.additionalCost) {
      specs.push({
        abilityId: ability.id,
        role: "additional-cost",
        optional: ability.additionalCost.optional === true,
        cost: ability.additionalCost,
        then: undefined,
      });
    }
  }
  return specs;
}

/** The one canonical variable destroy additional cost attached to a play LKI. */
export function variableDestroyPlayCost(
  object: FabObjectSnapshot,
): FabVariableDestroyPlayCost | null {
  const costs = playCostSpecs(object).flatMap((spec) =>
    !spec.optional && isVariableDestroyPlayCost(spec.cost) ? [spec.cost] : [],
  );
  return costs.length === 1 ? costs[0]! : null;
}

export function declaredTapPlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec) => {
    if (!isVariableTapPlayCost(spec.cost)) return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(bindings, spec.abilityId) === true;
    }
    return true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

export function tapPlayCostCount(cost: FabCost): number | "x" | "all" | "any-number" | null {
  if (cost.class !== "effect" || cost.type !== "tap") return null;
  if (cost.count === undefined) return 1;
  if (typeof cost.count === "number") return cost.count;
  if (cost.count.type === "x" || cost.count.type === "all" || cost.count.type === "any-number") {
    return cost.count.type;
  }
  return null;
}

export function variableTapCostCandidates(
  state: FabRulesSnapshot,
  actorId: string,
  filter: FabCardFilter | undefined,
): readonly FabObjectSnapshot[] {
  return variableDestroyCostCandidates(state, actorId, filter).filter(
    (object) => !object.markers.some((marker) => marker.kind === "tapped"),
  );
}

/** Payable destroy additional/alternative cost that still needs a declaration. */
export function declaredDestroyPlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec) => {
    if (spec.cost.class !== "effect" || spec.cost.type !== "destroy") return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(bindings, spec.abilityId) === true;
    }
    return true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

export function declaredMoveToDeckPlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec) => {
    if (!isMoveToDeckPlayCost(spec.cost)) return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(bindings, spec.abilityId) === true;
    }
    return true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

/** Controlled permanents currently capable of paying a destroy play-cost. */
const DESTROY_PLAY_COST_ZONES = [
  "arena",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
] as const satisfies readonly FabZoneKind[];

/** UST Usurp: any public arena Runechant, regardless of controller. */
export function usurpRunechantCandidates(
  state: FabRulesSnapshot,
  actorId: string,
): readonly FabObjectSnapshot[] {
  const filter = { name: "Runechant" } as const;
  const candidates: FabObjectSnapshot[] = [];
  for (const playerId of state.playerIds) {
    const arena = state.containers.zonesByPlayerId[playerId]?.arena ?? [];
    for (const instanceId of arena) {
      const object = snapshotObject(state, instanceId, playerId, "arena");
      if (!matchesFabSnapshotFilter(state, object, filter, undefined, actorId)) continue;
      candidates.push(object);
    }
  }
  return candidates;
}

export function destroyPlayCostCandidates(
  state: FabRulesSnapshot,
  actorId: string,
  spec: FabPlayCostSpec,
): readonly FabObjectSnapshot[] {
  if (spec.abilityId === USURP_COST_ID) return usurpRunechantCandidates(state, actorId);
  return variableDestroyCostCandidates(state, actorId, playCostFilter(spec.cost));
}

export function variableDestroyCostCandidates(
  state: FabRulesSnapshot,
  actorId: string,
  filter: FabCardFilter | undefined,
): readonly FabObjectSnapshot[] {
  const zones = state.containers.zonesByPlayerId[actorId];
  if (!zones) return [];
  const candidates: FabObjectSnapshot[] = DESTROY_PLAY_COST_ZONES.flatMap((zone) =>
    zones[zone].flatMap((instanceId) => {
      const object = snapshotObject(state, instanceId, actorId, zone);
      if (object.controllerId !== actorId) return [];
      if (filter && !matchesFabSnapshotFilter(state, object, filter, undefined, actorId)) {
        return [];
      }
      return [object];
    }),
  );
  // CR 3.0.14: sub-cards hosted under a destroy-capable seat are destroyable
  // controlled permanents ("destroy a card under this" play-costs, Evo
  // family). Their control follows the host's seat — the sub-card itself has
  // no arena membership or independent controller.
  for (const zone of DESTROY_PLAY_COST_ZONES) {
    for (const hostId of zones[zone]) {
      const hosted = state.containers.subcardsByHostId[hostId];
      if (!hosted) continue;
      for (const instanceId of hosted) {
        const object = snapshotObject(state, instanceId, actorId, "under");
        if (filter && !matchesFabSnapshotFilter(state, object, filter, undefined, actorId)) {
          continue;
        }
        candidates.push(object);
      }
    }
  }
  return candidates;
}

export function moveToDeckCostCandidates(
  state: FabRulesSnapshot,
  actorId: string,
  playedInstanceId: string,
  filter: FabCardFilter | undefined,
  from: "hand" | "arsenal" = "hand",
): readonly FabObjectSnapshot[] {
  const zones = state.containers.zonesByPlayerId[actorId];
  if (!zones) return [];
  const zoneKind = from === "arsenal" ? "arsenal" : "hand";
  return zones[zoneKind].flatMap((instanceId) => {
    if (instanceId === playedInstanceId) return [];
    const object = snapshotObject(state, instanceId, actorId, zoneKind);
    if (filter && !matchesFabSnapshotFilter(state, object, filter, undefined, actorId)) return [];
    return [object];
  });
}

export function thenBenefitEffects(then: FabEffect | undefined): readonly FabEffect[] {
  if (!then) return [];
  if (then.type === "sequence") return then.steps.flatMap((step) => thenBenefitEffects(step));
  return [then];
}

const CATALOG_ZONE_TO_KIND: Record<
  Extract<FabZone, "hand" | "graveyard" | "soul" | "combat-chain">,
  FabZoneKind
> = {
  hand: "hand",
  graveyard: "graveyard",
  soul: "soul",
  "combat-chain": "combatChain",
};

export function zonePlayCostCandidates(
  state: FabRulesSnapshot,
  actorId: string,
  playedInstanceId: string,
  from: "hand" | "graveyard" | "soul",
  filter: FabCardFilter | undefined,
): readonly FabObjectSnapshot[] {
  const zones = state.containers.zonesByPlayerId[actorId];
  if (!zones) return [];
  const zoneKind = CATALOG_ZONE_TO_KIND[from];
  return zones[zoneKind].flatMap((instanceId) => {
    if (instanceId === playedInstanceId) return [];
    const object = snapshotObject(state, instanceId, actorId, zoneKind);
    if (filter && !matchesFabSnapshotFilter(state, object, filter, undefined, actorId)) return [];
    return [object];
  });
}

export function numericCounterCountOnObject(
  state: FabRulesSnapshot,
  instanceId: string,
  cost: Extract<FabCost, { readonly class: "effect"; readonly type: "remove-counters" }>,
): number {
  const live = state.objects[instanceId];
  if (!live || cost.counter.kind !== "numeric" || typeof cost.counter.value !== "number") return 0;
  const property = cost.counter.property;
  const value = cost.counter.value;
  return live.counters.reduce((total, counter) => {
    if (counter.kind === "numeric" && counter.property === property && counter.value === value) {
      return total + counter.count;
    }
    return total;
  }, 0);
}

export function removeCountersPlayCostCandidates(
  state: FabRulesSnapshot,
  actorId: string,
  cost: Extract<FabCost, { readonly class: "effect"; readonly type: "remove-counters" }>,
): readonly FabObjectSnapshot[] {
  const min = removeCountersPlayCostMin(cost);
  const zones = state.containers.zonesByPlayerId[actorId];
  if (!zones) return [];
  const zoneKinds: readonly FabZoneKind[] =
    cost.zone === "combat-chain"
      ? ["combatChain", "weapon1", "weapon2"]
      : ["combatChain", "weapon1", "weapon2", "arena"];
  const seen = new Set<string>();
  const out: FabObjectSnapshot[] = [];
  for (const zoneKind of zoneKinds) {
    for (const instanceId of zones[zoneKind]) {
      if (seen.has(instanceId)) continue;
      const object = snapshotObject(state, instanceId, actorId, zoneKind);
      if (object.controllerId !== actorId) continue;
      if (
        cost.filter &&
        !matchesFabSnapshotFilter(state, object, cost.filter, undefined, actorId)
      ) {
        continue;
      }
      if (numericCounterCountOnObject(state, instanceId, cost) < min) continue;
      seen.add(instanceId);
      out.push(object);
    }
  }
  return out;
}

export function mixedAlternativePlayCostCandidates(
  state: FabRulesSnapshot,
  actorId: string,
  playedInstanceId: string,
  cost: Extract<FabCost, { readonly class: "mixed"; readonly type: "alternative" }>,
): readonly FabObjectSnapshot[] {
  const seen = new Set<string>();
  const out: FabObjectSnapshot[] = [];
  for (const part of cost.costs) {
    const partCandidates = isNamedDiscardHandPlayCost(part)
      ? zonePlayCostCandidates(state, actorId, playedInstanceId, "hand", playCostFilter(part))
      : part.class === "effect" && part.type === "destroy"
        ? variableDestroyCostCandidates(state, actorId, playCostFilter(part))
        : [];
    for (const candidate of partCandidates) {
      if (seen.has(candidate.instanceId)) continue;
      seen.add(candidate.instanceId);
      out.push(candidate);
    }
  }
  return out;
}

export function declaredOptionalBanishHandPlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec) => {
    if (!isOptionalBanishHandPlayCost(spec.cost, spec.optional)) return false;
    return isPlayCostDeclared(bindings, spec.abilityId) === true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

export function declaredRequiredBanishHandPlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec) => {
    if (!isRequiredBanishHandPlayCost(spec.cost, spec.optional)) return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(bindings, spec.abilityId) === true;
    }
    return true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

export function declaredAnyNumberBanishHandPlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec) => {
    if (!isAnyNumberBanishHandPlayCost(spec.cost)) return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(bindings, spec.abilityId) === true;
    }
    return true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

export function declaredAllBanishHandPlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec) => {
    if (!isAllBanishHandPlayCost(spec.cost)) return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(bindings, spec.abilityId) === true;
    }
    return true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

export function declaredNamedDiscardPlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec) => {
    if (!isNamedDiscardHandPlayCost(spec.cost)) return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(bindings, spec.abilityId) === true;
    }
    return true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

export type FabSoulBanishPlayCostSpec = FabPlayCostSpec & {
  readonly cost: Extract<FabCost, { readonly class: "effect"; readonly type: "banish" }>;
};

export function declaredSoulBanishPlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabSoulBanishPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec): spec is FabSoulBanishPlayCostSpec => {
    if (!isSoulBanishPlayCost(spec.cost)) return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(bindings, spec.abilityId) === true;
    }
    return true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

export function declaredRemoveCountersPlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec) => {
    if (!isRemoveCountersPlayCost(spec.cost)) return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(bindings, spec.abilityId) === true;
    }
    return true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

export function declaredMixedAlternativePlayCost(
  object: FabObjectSnapshot,
  bindings: FabEventBindings,
): FabPlayCostSpec | null {
  const specs = playCostSpecs(object).filter((spec) => {
    if (!isMixedAlternativePlayCost(spec.cost)) return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(bindings, spec.abilityId) === true;
    }
    return true;
  });
  return specs.length === 1 ? specs[0]! : null;
}

export function snapshotPlayCostObject(
  state: FabRulesSnapshot,
  actorId: string,
  instanceId: string,
): FabObjectSnapshot | null {
  const zone = findObjectZone(state, instanceId);
  if (!zone) return null;
  return snapshotObject(state, instanceId, actorId, zone.zone);
}

export interface BoundedMixedPlayCostPart {
  readonly type: "destroy" | "discard";
  readonly maximum: number;
  readonly filter: import("@tcg/flesh-and-blood-types").FabCardFilter | undefined;
}
/** Independent bounded effect costs, each of which may be paid zero times. */
export function boundedMixedPlayCostParts(
  cost: FabCost,
): readonly BoundedMixedPlayCostPart[] | null {
  if (cost.class !== "mixed" || cost.type !== "all" || cost.costs.length === 0) return null;
  const parts: BoundedMixedPlayCostPart[] = [];
  for (const part of cost.costs) {
    if (
      part.class !== "effect" ||
      (part.type !== "destroy" && part.type !== "discard") ||
      typeof part.count !== "object" ||
      part.count.type !== "up-to" ||
      typeof part.count.amount !== "number" ||
      !Number.isSafeInteger(part.count.amount) ||
      part.count.amount < 0 ||
      (part.type === "discard" && (part.random || (part.from && part.from !== "hand"))) ||
      (part.type === "destroy" && part.from)
    )
      return null;
    parts.push({ type: part.type, maximum: part.count.amount, filter: part.filter });
  }
  return parts;
}
export function boundedMixedCostCandidates(
  state: FabRulesSnapshot,
  actorId: string,
  sourceId: string,
  part: BoundedMixedPlayCostPart,
): readonly FabObjectSnapshot[] {
  return part.type === "destroy"
    ? variableDestroyCostCandidates(state, actorId, part.filter)
    : zonePlayCostCandidates(state, actorId, sourceId, "hand", part.filter);
}
export function boundedMixedObjectCostParts(
  object: FabObjectSnapshot,
): readonly BoundedMixedPlayCostPart[] | null {
  const specs = playCostSpecs(object).filter(
    (spec) => boundedMixedPlayCostParts(spec.cost) !== null,
  );
  return specs.length === 1 ? boundedMixedPlayCostParts(specs[0]!.cost) : null;
}
