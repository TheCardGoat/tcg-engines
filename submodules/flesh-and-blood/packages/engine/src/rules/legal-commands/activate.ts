import type { FabAmount, FabCardFilter, FabCost } from "@tcg/flesh-and-blood-types";

import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabRulesView } from "../rules-view.ts";
import { evaluatedObject, shortId, type FabLegalCommand } from "./shared.ts";
import { LEGAL_ACTIVATION_QUOTES } from "./types.ts";

type CatalogActivationCandidate = {
  readonly instanceId: string;
  readonly canonicalId: string;
  readonly abilityId: string;
  readonly abilityType: import("@tcg/flesh-and-blood-types").FabAbilityType;
  readonly label: string;
  readonly isAttack: boolean;
  /** Each alternative is a distinct player-declared command (CR 5.1.3c). */
  readonly alternativeCostIndexes: readonly (number | null)[];
  /** Player-facing summaries for each alternative cost. */
  readonly alternativeCostLabels: readonly string[];
};

function activationLabel(name: string, text: string, isAttack: boolean): string {
  if (isAttack) return `Attack with ${name}`;
  const description = text.trim();
  return description ? `Activate ${name} — ${description}` : `Activate ${name}`;
}

function catalogActivationCandidates(
  state: FabRulesSnapshot,
  view: FabRulesView,
  actorId: string,
): readonly CatalogActivationCandidate[] {
  const player = state.players[actorId];
  if (!player) return [];
  const out: CatalogActivationCandidate[] = [];
  const playerZones = state.containers.zonesByPlayerId[actorId]!;
  const sources: string[] = [
    ...playerZones.heroZone,
    ...playerZones.hand,
    ...playerZones.inventory,
  ];
  for (const z of ["weapon1", "weapon2", "head", "chest", "arms", "legs", "arena"] as const) {
    const zone =
      (state.containers.zonesByPlayerId[actorId]! as Readonly<Record<string, readonly string[]>>)[
        z
      ] ?? [];
    for (const instanceId of zone) {
      sources.push(instanceId);
    }
  }
  for (const instanceId of playerZones.banished) {
    const object = evaluatedObject(state, view, instanceId);
    if (!object) continue;
    for (const ability of view.functionalAbilities(object.ref)) {
      if (ability.kind !== "activated") continue;
      if (!ability.functionalZones?.includes("banished")) continue;
      const alternativeCostIndexes = activationAlternativeCostIndexes(ability.cost, false);
      if (alternativeCostIndexes.length === 0) continue;
      const isAttack = ability.abilityType === "attack" || ability.effect.type === "attack-with";
      out.push({
        instanceId,
        canonicalId: object.canonicalId,
        abilityId: ability.id,
        abilityType: ability.abilityType,
        label: activationLabel(
          object.current.names.join(" // ") || shortId(instanceId),
          ability.displayName ?? ability.text,
          isAttack,
        ),
        isAttack,
        alternativeCostIndexes,
        alternativeCostLabels:
          ability.cost.class === "mixed" && ability.cost.type === "alternative"
            ? ability.cost.costs.map(describeActivationCost)
            : [],
      });
    }
  }
  for (const instanceId of playerZones.arsenal) {
    const object = evaluatedObject(state, view, instanceId);
    if (!object) continue;
    for (const ability of view.functionalAbilities(object.ref)) {
      if (ability.kind !== "activated") continue;
      if (!ability.functionalZones?.includes("arsenal")) continue;
      const alternativeCostIndexes = activationAlternativeCostIndexes(ability.cost, false);
      if (alternativeCostIndexes.length === 0) continue;
      const isAttack = ability.abilityType === "attack" || ability.effect.type === "attack-with";
      out.push({
        instanceId,
        canonicalId: object.canonicalId,
        abilityId: ability.id,
        abilityType: ability.abilityType,
        label: activationLabel(
          object.current.names.join(" // ") || shortId(instanceId),
          ability.displayName ?? ability.text,
          isAttack,
        ),
        isAttack,
        alternativeCostIndexes,
        alternativeCostLabels:
          ability.cost.class === "mixed" && ability.cost.type === "alternative"
            ? ability.cost.costs.map(describeActivationCost)
            : [],
      });
    }
  }
  for (const instanceId of playerZones.combatChain) {
    const object = evaluatedObject(state, view, instanceId);
    if (!object) continue;
    for (const ability of view.functionalAbilities(object.ref)) {
      if (ability.kind !== "activated") continue;
      if (!ability.functionalZones?.includes("combat-chain")) continue;
      const alternativeCostIndexes = activationAlternativeCostIndexes(ability.cost, false);
      if (alternativeCostIndexes.length === 0) continue;
      const isAttack = ability.abilityType === "attack" || ability.effect.type === "attack-with";
      out.push({
        instanceId,
        canonicalId: object.canonicalId,
        abilityId: ability.id,
        abilityType: ability.abilityType,
        label: activationLabel(
          object.current.names.join(" // ") || shortId(instanceId),
          ability.displayName ?? ability.text,
          isAttack,
        ),
        isAttack,
        alternativeCostIndexes,
        alternativeCostLabels:
          ability.cost.class === "mixed" && ability.cost.type === "alternative"
            ? ability.cost.costs.map(describeActivationCost)
            : [],
      });
    }
  }
  for (const otherId of state.playerIds) {
    if (otherId === actorId) continue;
    for (const instanceId of state.containers.zonesByPlayerId[otherId]!.arena) {
      const object = evaluatedObject(state, view, instanceId);
      if (!object) continue;
      for (const ability of view.functionalAbilities(object.ref)) {
        if (ability.kind !== "activated") continue;
        if (ability.activatableBy !== "any-hero") continue;
        const alternativeCostIndexes = activationAlternativeCostIndexes(ability.cost, false);
        if (alternativeCostIndexes.length === 0) continue;
        const isAttack = ability.abilityType === "attack" || ability.effect.type === "attack-with";
        out.push({
          instanceId,
          canonicalId: object.canonicalId,
          abilityId: ability.id,
          abilityType: ability.abilityType,
          label: activationLabel(
            object.current.names.join(" // ") || shortId(instanceId),
            ability.displayName ?? ability.text,
            isAttack,
          ),
          isAttack,
          alternativeCostIndexes,
          alternativeCostLabels:
            ability.cost.class === "mixed" && ability.cost.type === "alternative"
              ? ability.cost.costs.map(describeActivationCost)
              : [],
        });
      }
    }
  }
  for (const instanceId of sources) {
    const object = evaluatedObject(state, view, instanceId);
    if (!object) continue;
    const sourceIsInHand = playerZones.hand.includes(instanceId);
    for (const ability of view.functionalAbilities(object.ref)) {
      if (ability.kind !== "activated") continue;
      const alternativeCostIndexes = activationAlternativeCostIndexes(ability.cost, sourceIsInHand);
      if (alternativeCostIndexes.length === 0) continue;
      const isAttack = ability.abilityType === "attack" || ability.effect.type === "attack-with";
      out.push({
        instanceId,
        canonicalId: object.canonicalId,
        abilityId: ability.id,
        abilityType: ability.abilityType,
        label: activationLabel(
          object.current.names.join(" // ") || shortId(instanceId),
          ability.displayName ?? ability.text,
          isAttack,
        ),
        isAttack,
        alternativeCostIndexes,
        alternativeCostLabels:
          ability.cost.class === "mixed" && ability.cost.type === "alternative"
            ? ability.cost.costs.map(describeActivationCost)
            : [],
      });
    }
  }
  return out;
}

/**
 * An activated ability on a private card is functional only when paying its
 * cost moves that source out of hand. This keeps ordinary permanent-only
 * abilities out of hand enumeration while retaining "Discard this" instants.
 */
function activationAlternativeCostIndexes(
  cost: FabCost,
  sourceIsInHand: boolean,
): readonly (number | null)[] {
  if (cost.class === "mixed" && cost.type === "alternative") {
    return cost.costs.flatMap((alternative, index) =>
      !sourceIsInHand || costDiscardsSource(alternative) ? [index] : [],
    );
  }
  return !sourceIsInHand || costDiscardsSource(cost) ? [null] : [];
}

function costDiscardsSource(cost: FabCost): boolean {
  if (cost.class === "effect") return cost.type === "discard-self";
  return cost.class === "mixed" && cost.type === "all" && cost.costs.some(costDiscardsSource);
}

function describeActivationCost(cost: FabCost): string {
  if (cost.class === "asset") {
    if (cost.type === "action-points") return "Spend an action point";
    return `Pay ${describeAmount(cost.amount)} ${cost.type.replaceAll("-", " ")}`;
  }
  if (cost.class === "mixed") {
    const separator = cost.type === "all" ? " and " : " or ";
    return cost.costs.map(describeActivationCost).join(separator);
  }

  switch (cost.type) {
    case "destroy":
      return `Destroy ${describeCount(cost.count)}${describeCardFilter(cost.filter)}`;
    case "discard":
      return `Discard ${describeAmount(cost.count)} ${describeCardFilter(cost.filter, "card")}`;
    case "banish":
      return `Banish ${describeAmount(cost.count)} ${describeCardFilter(cost.filter, "card")}`;
    case "destroy-self":
      return "Destroy this";
    case "banish-self":
      return "Banish this";
    case "tap-self":
      return "Tap this";
    case "tap-hero":
      return "Tap your hero";
    case "tap":
      return `Tap ${describeCount(cost.count)}${describeCardFilter(cost.filter)}`;
    case "untap":
      return `Untap ${describeCardFilter(cost.filter)}`;
    case "discard-self":
      return "Discard this";
    case "remove-counters":
      return `Remove ${describeAmount(cost.count)} counter${cost.count === 1 ? "" : "s"}`;
    case "add-counter":
      return `Add ${describeAmount(cost.count)} counter${cost.count === 1 ? "" : "s"}`;
    case "reveal":
      return `Reveal ${describeCount(cost.count)}${describeCardFilter(cost.filter, "card")}`;
    case "move-to-deck":
      return `Put ${describeAmount(cost.count)} ${describeCardFilter(cost.filter, "card")} on your deck`;
    case "turn-face-down":
      return "Turn a card face down";
    case "turn-face-up":
      return "Turn a card face up";
    case "create-token":
      return `Create ${cost.token}`;
    case "charge":
      return "Charge your hero's soul";
    default: {
      const _exhaustiveCost: never = cost;
      void _exhaustiveCost;
      return "Unknown cost";
    }
  }
}

function describeAmount(
  amount: FabAmount | import("@tcg/flesh-and-blood-types").FabSelectionCount,
): string {
  if (typeof amount === "number") return String(amount);
  return amount.type.toUpperCase();
}

function describeCount(
  count: import("@tcg/flesh-and-blood-types").FabSelectionCount | undefined,
): string {
  return count === undefined ? "a " : `${describeAmount(count)} `;
}

function describeCardFilter(filter: FabCardFilter | undefined, fallback = "permanent"): string {
  if (filter?.name) return filter.name;
  if (filter?.typeBox?.subtypes?.length) return filter.typeBox.subtypes.join(" ");
  if (filter?.typeBox?.types?.length) return filter.typeBox.types.join(" ");
  return fallback;
}

/** Singles, then combinations of 2..maxSize from hand, equipment, and arsenal. */

/** Instantiates every legal activate command (catalog activated abilities). */
export function instantiateActivateLegalCommands(context: {
  readonly state: FabRulesSnapshot;
  readonly view: FabRulesView;
  readonly actorId: string;
  readonly push: (command: FabLegalCommand) => void;
}): void {
  const { state, view, actorId, push } = context;
  // Production catalog activated abilities (OMN heroes / weapons / equipment).
  for (const activation of catalogActivationCandidates(state, view, actorId)) {
    const targetIds = activation.isAttack
      ? view
          .quoteAttackTargets({ actorId, attackInstanceId: activation.instanceId })
          .candidates.map((candidate) => candidate.targetId)
      : [null];
    for (const alternativeCostIndex of activation.alternativeCostIndexes) {
      for (const attackTargetId of targetIds) {
        const quote = view.quoteActivation({
          actorId,
          instanceId: activation.instanceId,
          abilityId: activation.abilityId,
          attackTargetId,
          alternativeCostIndex,
        });
        if (!quote.allowed) continue;
        const command: FabLegalCommand = {
          move: "activate",
          payload: {
            instanceId: activation.instanceId,
            ability: activation.abilityId,
            ...(attackTargetId ? { target: attackTargetId } : {}),
            ...(alternativeCostIndex === null ? {} : { alternativeCostIndex }),
          },
          label:
            alternativeCostIndex === null
              ? activation.label
              : `${activation.label} (${activation.alternativeCostLabels[alternativeCostIndex]})`,
          sourceInstanceId: activation.instanceId,
          ...(activation.abilityType === "instant"
            ? {
                priorityYield: {
                  kind: "instant-use" as const,
                  canonicalId: activation.canonicalId,
                },
              }
            : {}),
        };
        LEGAL_ACTIVATION_QUOTES.set(command, { quote, isAttack: activation.isAttack });
        push(command);
      }
    }
  }
}
