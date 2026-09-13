import {
  FAB_CLASS_SUPERTYPES,
  FAB_METATYPES,
  FAB_SUBTYPES,
  FAB_TALENT_SUPERTYPES,
  FAB_TRAITS,
  FAB_TYPES,
  type FabAmount,
  type FabComparison,
  type FabCondition,
  type FabPlayer,
  type FabTarget,
} from "@tcg/flesh-and-blood-types";
import type { FabObjectRef } from "../continuous/ir.ts";
import type { FabEvalContext, FabRulesBaseObject } from "../rules-view.ts";
import { FabRulesEvaluationError } from "./errors.ts";
import {
  type MutableObject,
  type MutableProperties,
  createMutableObject,
  cloneBase,
  isDefined,
  refKey,
} from "./mutable.ts";
import { engineZoneToCatalog as toCatalogZone } from "../zones.ts";
export { toCatalogZone };

export { refKey, isDefined, createMutableObject, cloneBase, cloneMutable } from "./mutable.ts";
export type { MutableObject, MutableProperties } from "./mutable.ts";

export function normalizeText(value: string | null | undefined): string {
  return value?.toLocaleLowerCase("en-US") ?? "";
}

export function comparePrimitive(
  left: number,
  operation: FabComparison["op"],
  right: number,
): boolean {
  switch (operation) {
    case "eq":
      return left === right;
    case "neq":
      return left !== right;
    case "lt":
      return left < right;
    case "lte":
      return left <= right;
    case "gt":
      return left > right;
    case "gte":
      return left >= right;
    default:
      return assertNeverOp(operation);
  }
}

function assertNeverOp(operation: never): never {
  throw new Error(`Unhandled comparison op: ${JSON.stringify(operation)}`);
}

/** Compare a numeric left against a FabComparison whose value is a plain number (not amount AST). */
export function matchesNumericComparison(
  left: number,
  comparison: { readonly op: FabComparison["op"]; readonly value: unknown },
): boolean {
  if (typeof comparison.value !== "number") return false;
  return comparePrimitive(left, comparison.op, comparison.value);
}

export function requireBoundNumber(binding: string, context: FabEvalContext): number {
  const value = context.bindings.numbers[binding];
  if (value === undefined) throw new FabRulesEvaluationError(`missing number binding ${binding}`);
  return value;
}

export function requireSingleNumberBinding(context: FabEvalContext, mechanic: string): number {
  const values = Object.values(context.bindings.numbers);
  if (values.length !== 1) {
    throw new FabRulesEvaluationError(`${mechanic} requires exactly one numeric binding`);
  }
  return values[0]!;
}

export function arenaObjectZone(zone: FabRulesBaseObject["zone"]["zone"]): boolean {
  return ["arena", "head", "chest", "arms", "legs", "weapon1", "weapon2", "heroZone"].includes(
    zone,
  );
}

export function vocabularyFor(
  kind: "type" | "subtype" | "supertype" | "metatype" | "trait",
): readonly string[] {
  return kind === "type"
    ? FAB_TYPES
    : kind === "subtype"
      ? FAB_SUBTYPES
      : kind === "supertype"
        ? [...FAB_CLASS_SUPERTYPES, ...FAB_TALENT_SUPERTYPES]
        : kind === "metatype"
          ? FAB_METATYPES
          : FAB_TRAITS;
}

export function isKnownVocabulary(
  kind: "type" | "subtype" | "supertype" | "metatype" | "trait",
  value: string,
): boolean {
  return vocabularyFor(kind).includes(value);
}

export function assertVocabulary(kind: "type", value: string): MutableProperties["types"][number];
export function assertVocabulary(
  kind: "subtype",
  value: string,
): MutableProperties["subtypes"][number];
export function assertVocabulary(
  kind: "supertype",
  value: string,
): MutableProperties["supertypes"][number];
export function assertVocabulary(
  kind: "metatype",
  value: string,
): MutableProperties["metatypes"][number];
export function assertVocabulary(kind: "trait", value: string): MutableProperties["traits"][number];
export function assertVocabulary(
  kind: "type" | "subtype" | "supertype" | "metatype" | "trait",
  value: string,
): string {
  if (!isKnownVocabulary(kind, value)) {
    throw new FabRulesEvaluationError(`unknown ${kind} ${value}`);
  }
  return value;
}

export function removeValue<T extends string>(values: T[], value: string): void {
  const index = values.indexOf(value as T);
  if (index >= 0) values.splice(index, 1);
}

export function mutableObjectFromMoveLki(
  lkiId: NonNullable<import("../../state.ts").FabObjectMoveHistoryEntry["lki"]>,
  context: FabEvalContext,
): MutableObject {
  const lki = context.facts?.moveLkiById?.[lkiId];
  if (!lki) throw new FabRulesEvaluationError(`missing reachable LKI ${lkiId}`);
  const mutable = createMutableObject({
    ref: lki.ref,
    canonicalId: lki.canonicalId,
    ownerId: lki.ownerId,
    controllerId: lki.controllerId,
    zone: lki.zone,
    zoneIndex: 0,
    visibility: "public",
    base: lki.base,
    baseNumeric: lki.baseNumeric,
    counters: lki.counters,
    markers: lki.markers,
    history: { moves: [] },
  });
  mutable.properties = cloneBase(lki.current);
  mutable.baseNumeric = { ...lki.baseNumeric };
  for (const effectId of lki.appliedEffectIds) mutable.effectIds.add(effectId);
  return mutable;
}

export function playerMatches(
  player: Extract<FabTarget, { selector: "object" }>["player"],
  objectControllerId: string | null,
  context: FabEvalContext,
): boolean {
  // Omitted / any / each = every seat. Specific CR player words share
  // playerIdsForWho so defending-hero / target-controller / iteration-subject
  // cannot drift from the scan path.
  if (!player || player === "any" || player === "each") return true;
  if (objectControllerId === null) return false;
  return playerIdsForWho(player, context).includes(objectControllerId);
}

export function zoneObjectMatchesPlayer(
  object: MutableObject,
  player: Extract<FabCondition, { type: "zone-count" }>["player"],
  context: FabEvalContext,
): boolean {
  const zonePlayerId = object.input.zone.playerId ?? object.controllerId ?? object.input.ownerId;
  if (player === "self" || player === "controller") return zonePlayerId === context.controllerId;
  if (player === "opponent" || player === "another-hero") {
    return zonePlayerId !== null && zonePlayerId !== context.controllerId;
  }
  if (player === "any" || player === "each") return true;
  if (player === "target-controller") {
    return zonePlayerId === context.bindings?.strings?.["target-controller"];
  }
  if (player === "iteration-subject") {
    return zonePlayerId === context.bindings?.strings?.["iteration-subject"];
  }
  if (player === "attacking-hero") return zonePlayerId === context.facts?.combat?.attackingPlayerId;
  if (player === "defending-hero" || player === "attack-target") {
    const defendingPlayerId =
      context.facts?.combat?.defendingPlayerId ??
      Object.keys(context.facts?.heroRefs ?? {}).find((id) => id !== context.controllerId);
    return zonePlayerId === defendingPlayerId;
  }
  if (player === "winner" || player === "loser") {
    return zonePlayerId === context.bindings?.strings?.[player];
  }
  if (player === "turn-player") {
    return zonePlayerId === context.facts?.activePlayerId;
  }
  throw new FabRulesEvaluationError(
    `zone-count player ${typeof player === "string" ? player : "binding"}`,
  );
}

export function historyMoveMatchesPlayer(
  playerId: string | null,
  player: Extract<FabCondition, { readonly type: "zone-count" }>["player"],
  context: FabEvalContext,
): boolean {
  if (player === "self" || player === "controller") return playerId === context.controllerId;
  if (player === "opponent" || player === "another-hero" || player === "each-other-hero") {
    return playerId !== null && playerId !== context.controllerId;
  }
  if (player === "any" || player === "each") return true;
  if (player === "iteration-subject") {
    return playerId === context.bindings?.strings?.["iteration-subject"];
  }
  if (player === "attacking-hero") return playerId === context.facts?.combat?.attackingPlayerId;
  if (player === "defending-hero" || player === "attack-target") {
    const defendingPlayerId =
      context.facts?.combat?.defendingPlayerId ??
      Object.keys(context.facts?.heroRefs ?? {}).find((id) => id !== context.controllerId);
    return playerId === defendingPlayerId;
  }
  if (player === "turn-player") {
    return playerId === context.facts?.activePlayerId;
  }
  throw new FabRulesEvaluationError(
    `history player ${typeof player === "string" ? player : "binding"}`,
  );
}

export function playerIdsForFacts(
  player: Extract<FabCondition, { readonly type: "damage-dealt" }>["player"],
  context: FabEvalContext,
): readonly string[] {
  const facts = context.facts;
  if (!facts) return [];
  const playerIds = Object.keys(facts.playerLife);
  if (player === "self" || player === "controller") return [context.controllerId];
  if (player === "opponent" || player === "another-hero" || player === "each-other-hero") {
    return playerIds.filter((playerId) => playerId !== context.controllerId);
  }
  if (player === "any" || player === "each") return playerIds;
  if (player === "attacking-hero") return [facts.combat?.attackingPlayerId].filter(isDefined);
  if (player === "defending-hero" || player === "attack-target") {
    return [facts.combat?.defendingPlayerId].filter(isDefined);
  }
  if (player === "turn-player") {
    const turnPlayerId = facts.activePlayerId;
    return typeof turnPlayerId === "string" ? [turnPlayerId] : [];
  }
  throw new FabRulesEvaluationError(
    `damage-dealt player ${typeof player === "string" ? player : "binding"}`,
  );
}

export function playerIdsForWho(
  who: FabPlayer | undefined,
  context: FabEvalContext,
): readonly string[] {
  const facts = context.facts;
  const playerIds = facts?.playerIds ?? (facts ? Object.keys(facts.heroRefs) : []);
  const controllerId = context.controllerId;
  if (who === undefined || who === "controller" || who === "self") return [controllerId];
  if (typeof who === "object" && "binding" in who) {
    const bound = context.bindings?.strings?.[who.binding];
    return typeof bound === "string" && playerIds.includes(bound) ? [bound] : [];
  }
  switch (who) {
    case "opponent":
    case "another-hero":
    case "each-other-hero":
      return playerIds.filter((playerId) => playerId !== controllerId);
    case "any":
    case "each":
      return playerIds;
    case "attacking-hero":
      return [facts?.combat?.attackingPlayerId].filter(isDefined);
    case "defending-hero":
    case "attack-target":
      return [facts?.combat?.defendingPlayerId].filter(isDefined);
    case "iteration-subject": {
      const subject = context.bindings?.strings?.["iteration-subject"];
      return typeof subject === "string" && playerIds.includes(subject) ? [subject] : [];
    }
    case "target-controller": {
      const expected = context.bindings?.strings?.["target-controller"];
      return typeof expected === "string" && playerIds.includes(expected) ? [expected] : [];
    }
    case "winner": {
      const winner = context.bindings?.strings?.winner;
      return typeof winner === "string" && playerIds.includes(winner) ? [winner] : [];
    }
    case "loser": {
      const loser = context.bindings?.strings?.loser;
      return typeof loser === "string" && playerIds.includes(loser) ? [loser] : [];
    }
    case "turn-player": {
      const turnPlayerId = facts?.activePlayerId;
      return typeof turnPlayerId === "string" ? [turnPlayerId] : [];
    }
    case "highest-life-hero":
    case "lowest-life-hero":
      return [];
    default:
      return assertNeverWho(who);
  }
}

function assertNeverWho(who: never): readonly string[] {
  void who;
  return [];
}

export function heroObjectsForPlayer(
  playerId: string | undefined,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  if (!playerId) return [];
  const ref = context.facts?.heroRefs[playerId];
  return ref ? [objects.get(refKey(ref))].filter(isDefined) : [];
}

export function heroObjectsForAmountPlayer(
  player: Extract<Exclude<FabAmount, number>, { type: "hero-property" }>["player"],
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  return playerIdsForWho(player, context).flatMap((playerId) =>
    heroObjectsForPlayer(playerId, context, objects),
  );
}

export function countCounters(
  object: MutableObject,
  counter: Extract<Exclude<FabAmount, number>, { type: "count" }>["counter"],
): number {
  return object.input.counters
    .filter((candidate) => candidate.kind !== "damage")
    .filter(
      (candidate) =>
        !counter ||
        (counter.kind === "named"
          ? candidate.kind === "named" && candidate.name === counter.name
          : candidate.kind === "numeric" &&
            candidate.property === counter.property &&
            candidate.value === counter.value),
    )
    .reduce((total, candidate) => total + candidate.count, 0);
}

export function subjectPropertyBindingKey(
  subject: FabObjectRef,
  amount: Exclude<FabAmount, number> & { type: "subject-property" },
): string {
  return `$subject:${refKey(subject)}:${amount.basis}:${amount.property}`;
}
