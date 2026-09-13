import type { FabTarget } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { playerMatches, refKey, toCatalogZone } from "../helpers.ts";
import { matchesFilter } from "../matches-filter.ts";
import { catalogZoneMatchesTargetZones } from "../../zones.ts";
import { matchesOtherAllyControlledByHitTarget } from "./other-ally-controlled-by-hit-target.ts";

export function resolveObjectSelector(
  target: Extract<FabTarget, { selector: "object" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  const candidates = [...objects.values()].filter((object) => {
    if (!objectMatchesTargetZones(object, target.zones, context, objects)) return false;
    if (
      !playerMatches(
        target.player,
        target.playerRelation === "owner"
          ? object.input.ownerId
          : (object.controllerId ?? object.input.zone.playerId ?? object.input.ownerId),
        context,
      )
    )
      return false;
    if (target.relation) {
      const relation = target.relation;
      switch (relation.kind) {
        case "other-ally-controlled-by-hit-target":
          if (!matchesOtherAllyControlledByHitTarget(relation, object, context)) return false;
          break;
        default:
          return assertNeverRelationKind(relation.kind);
      }
    }
    if (!target.filter) return true;
    if (matchesFilter(object, target.filter, context, objects)) return true;
    return matchesCombatChainAttack(object, target, context, objects);
  });
  if (!target.position) return candidates;
  const byZone = new Map<string, MutableObject[]>();
  for (const object of candidates) {
    const key = `${object.input.zone.playerId ?? "shared"}:${object.input.zone.zone}`;
    const group = byZone.get(key) ?? [];
    group.push(object);
    byZone.set(key, group);
  }
  return [...byZone.values()].flatMap((group) => {
    const ordered = [...group].sort((left, right) => left.input.zoneIndex - right.input.zoneIndex);
    return target.position === "bottom" ? ordered.slice(0, 1) : ordered.slice(-1);
  });
}

function assertNeverRelationKind(kind: never): never {
  throw new Error(`Unhandled FAB target relation: ${JSON.stringify(kind)}`);
}

/**
 * Catalog zone match for object targets. `permanent` matches arena + equipment
 * + weapon seats (CR arena permanents). `combat-chain` also matches the
 * active combat attack (weapons / allies that attack without leaving seat).
 */
/**
 * CR 1.4 / Errata #3: "target attack" is the active combat-chain attack,
 * whether that object is an Attack-subtype card or an attack-proxy whose
 * source keeps Attack in types (or no Attack token at all).
 */
function matchesCombatChainAttack(
  object: MutableObject,
  target: Extract<FabTarget, { selector: "object" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  if (!target.zones.includes("combat-chain") || !target.filter) return false;
  if (!filterRequiresAttack(target.filter)) return false;
  const attack = context.facts?.combat?.attack;
  const isActiveAttack = Boolean(attack && refKey(attack) === refKey(object.input.ref));
  const hasAttackToken = object.properties.subtypes.includes("Attack");
  if (!isActiveAttack && !hasAttackToken) return false;
  return matchesFilter(object, filterWithoutAttackToken(target.filter), context, objects);
}

function filterRequiresAttack(
  filter: NonNullable<Extract<FabTarget, { selector: "object" }>["filter"]>,
): boolean {
  return filter.typeBox?.subtypes?.includes("Attack") === true;
}

function filterWithoutAttackToken(
  filter: NonNullable<Extract<FabTarget, { selector: "object" }>["filter"]>,
): typeof filter {
  return {
    ...filter,
    typeBox: filter.typeBox
      ? {
          ...filter.typeBox,
          types: filter.typeBox.types,
          subtypes: filter.typeBox.subtypes?.filter((value) => value !== "Attack"),
        }
      : filter.typeBox,
  };
}

function objectMatchesTargetZones(
  object: MutableObject,
  zones: readonly string[],
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const catalog = toCatalogZone(object.input.zone.zone);
  if (catalogZoneMatchesTargetZones(catalog, zones)) return true;
  const attack = context.facts?.combat?.attack;
  const isActiveAttack = Boolean(
    attack &&
    (refKey(attack) === refKey(object.input.ref) ||
      attack.instanceId === object.input.ref.instanceId),
  );
  if (zones.includes("combat-chain")) {
    if (isActiveAttack) return true;
    const zone = object.input.zone.zone;
    if (zone === "weapon1" || zone === "weapon2") return true;
  }
  // CR 7.2.2b: a weapon attack-source stays in its equipped seat while
  // attacking. "Weapons/daggers you control" still includes that source.
  if (isActiveAttack && object.properties.types.includes("Weapon")) {
    if (zones.includes("weapon") || zones.includes("permanent")) return true;
  }
  // Attacking allies leave the arena for the combat chain. "Allies/zombies
  // you control" still includes those chain objects.
  const isAlly = object.properties.subtypes.includes("Ally");
  if (
    isAlly &&
    zones.includes("permanent") &&
    (isActiveAttack || object.input.zone.zone === "combatChain")
  ) {
    return true;
  }
  if (zones.includes("under") && object.input.zone.zone === "under") {
    const source = context.source;
    if (!source) return false;
    const host = [...objects.values()].find(
      (candidate) => refKey(candidate.input.ref) === refKey(source),
    );
    return host?.input.underInstanceIds?.includes(object.input.ref.instanceId) === true;
  }
  return false;
}
